import { Router } from "express";
import {logoutAll, signIn, signOut, signUp} from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);
authRouter.post('/log-out-all', authMiddleware, logoutAll);

export default authRouter;