import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false }
});

const User = mongoose.model('User', userSchema);
export default User;
