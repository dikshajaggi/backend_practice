// app.js
import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';
import connectDB from './Db.js'
import { authenticateAdmin } from './auth.js';
import productRoutes from "./apis/Product.api.js"
import addProductRoutes from './apis/AddProduct.api.js'
import authRoutes from "./apis/Auth.api.js"

const { json } = pkg;
const app = express();

app.use(cors());
app.use(json());

// Connect to MongoDB
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticateAdmin, addProductRoutes);
app.use('/api/', productRoutes);


app.get("/", (req, res) => {
    res.send("working")
})


export default app;
