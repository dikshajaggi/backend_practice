// product.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Product from '../models/product.models.js';
import { generateAdminToken } from '../auth.js';
import Category from '../models/category.models.js';

const router = express.Router();

router.post('/products', async (req, res) => {
  try {
    const { username, password, ...productData } = req.body;

    // Check admin credentials and generate admin token
    const authResult = generateAdminToken(username, password);

    if (authResult.success) {
      // Verify if the user is an admin before allowing product creation
      const decoded = jwt.verify(authResult.token, process.env.JWT_SECRET || 'VlLCJpYXQiOjE3MDE2OTk0MzMsImV4cCI6MTcwMTcwMzAzM30.1sR1U6uNDE0cGB7Pb-Di-nBeiRgpMN3Jog4aduTlY4o');

      if (decoded.isAdmin) {
        // Create a new product using the Product model
        const product = new Product(productData);

        // Validate product data
        const validationError = product.validateSync();
        if (validationError) {
          return res.status(400).json({ error: validationError.message });
        }

        // Save the product to the database
        await product.save();

        // Respond with the created product
        return res.status(201).json({
          message: 'Product created successfully',
          product: product
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
