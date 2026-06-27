import {JWT_SECRET} from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return res.status(401).json({ success:false, message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user || user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ success:false, message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch(error) {
        next(error);
    }
}