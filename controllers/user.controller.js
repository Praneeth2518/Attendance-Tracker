import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Subject from "../models/subject.model.js";
import ApiError from "../classes/apiError.class.js";

export const getAllUsers = async (req, res, next) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(401).json({ success:false, message: 'Unauthorized' });
        }

        const userData = await User.find();

        res.status(200).json({ success: true, data: userData});
    } catch(error) {
        next(error);
    }
}

export const getUserByID = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if(!user) {
            return res.status(404).json({ success:false, message: 'User not found' });
        }

        if(user.role === "admin") {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const currUser = req.user;

        if(currUser.role !== "admin" && currUser.id !== id) {
            return res.status(401).json({ success:false, message: 'Unauthorized' });
        }

        const { password } = req.body;

        if(!password) {
            throw new ApiError(400, "Password required");
        }

        const user = await User.findById(id);

        if(!user) {
            throw new ApiError(404, "User not found");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch(error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const currUser = req.user;

        if(currUser.role !== "admin" && currUser.id !== id) {
            return res.status(401).json({ success:false, message: 'Unauthorized' });
        }

        await Subject.deleteMany({ user:id });
        await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        next(error);
    }
}

export const getImpData = async (req, res, next) => {
    try {
        const currUser = req.user;
        const reqUser = req.params.id;

        if(reqUser !== currUser.id) {
            return res.status(401).json({ success:false, message: 'Unauthorized' });
        }

        res.status(200).json({ success: true, data: currUser });
    } catch(error) {
        next(error);
    }
}