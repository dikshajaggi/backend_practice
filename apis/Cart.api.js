// routes/cart.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import Product from '../models/product.models.js';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to authenticate the user
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Missing Token' });
    }

    try {
        const decoded = jwt.verify(token, 'QiOjE3MDE2OTk0MzMsImV4cCI6MTcwMTcwMzAzM30.1sR1U6uNDE0cGB7Pb-Di-nBeiRgpMN3Jog4aduTlY4o');
        console.log('Decoded Token:', decoded);
        req.user = decoded; // Attach user information to the request object
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden - Invalid Token' });
    }
};

// api to add products to cart
router.post('/add-to-cart/:productId', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const productId = req.params.productId;
        const product = await Product.findOne({ id: productId });;
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Add the product to the user's cart
        user.cart.push(product);
        await user.save();

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route to get all cart products for a user
router.get('/all-products', authenticateUser, async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : undefined;

        // Check if the user exists
        const user = await User.findById(userId).populate('cart');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract cart products from the user
        const cartProducts = user.cart;

        res.status(200).json({ cartProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to delete a product from the user's cart
router.delete('/delete-from-cart/:productId', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const productId = req.params.productId;

        // Convert productId to a Buffer for comparison
        const productToRemove = Buffer.from(productId, 'hex');
        console.log(productToRemove, "rmeoving---")
        const productIndex = user.cart.findIndex(item => Buffer.compare(item.id, productToRemove) === 0);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }

        // Remove the product from the user's cart
        user.cart.splice(productIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



export default router;
