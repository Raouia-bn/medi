import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import prescriptionRouter from "./routes/prescriptionRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/user", userRouter);

app.use("/api/v1/appointment", appointmentRouter);

app.use("/api/v1/prescription", prescriptionRouter);
connection();
app.use(errorMiddleware);

export default app;