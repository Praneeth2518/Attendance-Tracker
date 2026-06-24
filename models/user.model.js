import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        minlength: [5, 'minLength: 5'],
        maxlength: [20, 'maxLength: 20'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [5, 'minLength: 5'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    tokenVersion: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

export default User;