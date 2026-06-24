import { Router } from "express";
import {deleteUser, getAllUsers, getImpData, getUserByID, updateUser} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserByID);

userRouter.put('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

userRouter.get('/imp/:id', getImpData);

export default userRouter;