// admin.model.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 60, maxlength: 60 }, // Adjust the length based on your bcrypt configuration
    email: { type: String, unique: true, required: true },
    mobileNumber: { type: String, unique: true, required: true }, // Assuming mobile numbers are strings
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
