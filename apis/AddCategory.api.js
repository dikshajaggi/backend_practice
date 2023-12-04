// product.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { generateAdminToken } from '../auth.js';
import Category from '../models/category.models.js';

const router = express.Router();

router.post('/categories', async (req, res) => {
    try {
        const { username, password, ...categoryData } = req.body;

        // Check admin credentials and generate admin token
        const authResult = generateAdminToken(username, password);

        if (authResult.success) {
            // Verify if the user is an admin before allowing product creation
            const decoded = jwt.verify(authResult.token, process.env.JWT_SECRET || 'VlLCJpYXQiOjE3MDE2OTk0MzMsImV4cCI6MTcwMTcwMzAzM30.1sR1U6uNDE0cGB7Pb-Di-nBeiRgpMN3Jog4aduTlY4o');

            if (decoded.isAdmin) {
                // Create a new category using the category model
                const category = new Category(categoryData);

                // Validate category data
                const validationError = category.validateSync();
                if (validationError) {
                    return res.status(400).json({ error: validationError.message });
                }

                // Save the category to the database
                await category.save();

                // Respond with the created category
                return res.status(201).json({
                    message: 'category created successfully',
                    category: category
                });
            } else {
                return res.status(403).json({ error: 'Forbidden - Not an Admin' });
            }
        } else {
            return res.status(401).json({ error: authResult.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
