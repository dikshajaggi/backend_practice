// db.js
import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect('mongodb+srv://ceediksha:1234diksha@cluster0.9o6duky.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
