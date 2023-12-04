// auth.routes.js
import express from 'express';
import { generateAdminToken, authenticateAdmin } from '../auth.js';
import bcrypt from 'bcrypt';
import Admin from "../models/admin/admin_reg.models.js"


const router = express.Router();
// Admin register
router.post('/admin/register', async (req, res) => {
  try {
    const { username, password, email, mobileNumber } = req.body;

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new admin instance with the hashed password
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      email,
      mobileNumber
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Generate a token for the newly registered admin
    const token = generateAdminToken(username, password);

    return res.status(201).json({
      message: 'Admin registered successfully',
      token: token.token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -----------------------------------------------------------------------------------------------------------------------------

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch the admin from the database based on the username
    const admin = await Admin.findOne({ username });

    if (admin) {
      // Compare the entered password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (passwordMatch) {
        // Passwords match, generate and return a token
        const token = generateAdminToken(username, password);
        return res.status(200).json({ message: 'Admin login successful', token: token.token });
      } else {
        // Passwords don't match
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      // Admin not found
      return res.status(401).json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
