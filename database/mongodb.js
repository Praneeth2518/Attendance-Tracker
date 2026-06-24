import {DB_URI} from "../config/env.js";
import mongoose from "mongoose";

if(!DB_URI) {
    throw new Error('MongoDB URI is missing!');
}

export const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB Connected');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}