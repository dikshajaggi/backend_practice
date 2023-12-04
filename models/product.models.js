import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true }, // You can use ObjectId or a unique identifier for id
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // You might want to store the URL or file path
  stock: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product
