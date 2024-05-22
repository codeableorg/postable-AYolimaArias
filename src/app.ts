import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import sessionHandler from "./middlewares/session";
import errorHandler from "./middlewares/error";
import authRouter from "./routers/auth-router";
import userRouter from "./routers/user-router";
import postsRouter from "./routers/posts-router";
import postRouter from "./routers/post-router";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(sessionHandler());
app.use(errorHandler);

//ROUTERS:
app.use(authRouter);
app.use(postsRouter);
app.use("/me", userRouter);
app.use("/posts", postRouter);
