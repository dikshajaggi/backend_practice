// app.js
import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';
import connectDB from './Db.js'
import { authenticateAdmin } from './auth.js';
import productRoutes from "./apis/Product.api.js"
import addProductRoutes from './apis/AddProduct.api.js'
import addCategoryRoutes from './apis/AddCategory.api.js'
import authRoutes from "./apis/Auth.api.js"
import categoryRoute from "./apis/Category.api.js"

const { json } = pkg;
const app = express();

app.use(cors());
app.use(json());

// Connect to MongoDB
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticateAdmin, addProductRoutes, addCategoryRoutes);
app.use('/api/', productRoutes, categoryRoute);


app.get("/", (req, res) => {
    res.send("working")
})


export default app;
