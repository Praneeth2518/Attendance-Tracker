import mongoose from "mongoose";
import User from "../models/user.model.js";
import ApiError from "../classes/apiError.class.js";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import bcrypt from "bcrypt";
import { ADMIN_KEY } from "../config/env.js";

export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let { name, password, role, key } = req.body;
        const existingUser = await User.findOne({ name });

        if(existingUser) {
            throw new ApiError(409, "User already exists");
        }

        if(!process.env.JWT_SECRET) {
            throw new ApiError(402, "JWT_SECRET missing");
        }

        if(key === ADMIN_KEY) role = 'admin';
        else role = 'user';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await User.create([{ name, password: hashedPassword, role }], { session });

        const token = jwt.sign({ userId: newUser._id, tokenVersion: newUser.tokenVersion }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();
        newUser.password = undefined;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async(req, res, next) => {
    try {
        const { name, password } = req.body;

        const user = await User.findOne({ name }).select("+password");

        if(!user) {
            throw new ApiError(401, "Incorrect username or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new ApiError(401, "Incorrect username or password");
        }

        const token = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        user.password = undefined;

        res.status(201).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user: user
            }
        })

    } catch (error) {
        next(error);
    }
}

export const logoutAll = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);


        if(!user) {
            throw new ApiError(401, "Incorrect username or password");
        }

        user.tokenVersion += 1;

        await user.save();

        res.status(201).json({
            success: true,
            message: "All Devices Logged Out",
        })
    } catch(error) {
        next(error);
    }
}

export const signOut = async(req, res, next) => {}