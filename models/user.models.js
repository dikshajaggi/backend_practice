// models/user.model.js
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: false,
            },
            quantity: {
                type: Number,
                required: false,
                default: 1,
            },
        },
    ],
});

const User = mongoose.model('User', userSchema);

export default User;
