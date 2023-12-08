// routes/user.routes.js
import express from "express"
import bcrypt from "bcrypt"
import User from "../models/user.models.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance with the hashed password
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Fetch the user from the database based on the username
        const user = await User.findOne({ username });

        if (user) {
            // Compare the entered password with the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Passwords match, generate and return a token
                const token = jwt.sign({ userId: user._id }, 'QiOjE3MDE2OTk0MzMsImV4cCI6MTcwMTcwMzAzM30.1sR1U6uNDE0cGB7Pb-Di-nBeiRgpMN3Jog4aduTlY4o', { expiresIn: '1h' });
                return res.status(200).json({ message: 'Login successful', token });
            } else {
                // Passwords don't match
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            // User not found
            return res.status(401).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router
