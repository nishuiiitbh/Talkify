import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);

app.listen(port, () => {
  connectDb();
  console.log("server started");
});
