// product.js
import express from 'express';
import Product from '../models/product.models.js';
import mongoose from "mongoose"

const router = express.Router();

// GET ALL PRODUCTS
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET PRODUCT BY ID
router.get('/products/:id/:name', async (req, res) => {
  const productId = req.params.id;
  const productName = req.params.name;

  try {
    const product = await Product.findOne({ id: productId });

    if (!product) {
      // If the product with the given ID is not found
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the provided name matches the product's name
    if (productName.toLowerCase() !== product.name.toLowerCase()) {
      return res.status(400).json({ error: 'Invalid product name' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET PRODUCTS BY CATEGORY
router.get('/products/:cat', async (req, res) => {
  const category_item = req.params.cat;
  try {
    const products = await Product.find({ category: category_item }).sort('name');

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found in the specified category' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
