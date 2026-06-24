import express from 'express';
import cookieParser from "cookie-parser";
import { PORT} from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import authRouter from "./routes/auth.routes.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import {connectDB} from "./database/mongodb.js";
import {authMiddleware} from "./middlewares/auth.middleware.js";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
// arcjet middlewareHello World!

app.use('/v1/api/auth', authRouter);
app.use('/v1/api/users', authMiddleware, userRouter);
app.use('/v1/api/subjects', authMiddleware, subjectRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hello Welcome to Attendance Tracker Management V1');
})

await connectDB();

app.listen(PORT, async () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

export default app;