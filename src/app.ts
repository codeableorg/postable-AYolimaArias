import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import sessionHandler from "./middlewares/session";
import errorHandler from "./middlewares/error";

if (process.env["NODE_ENV"] === "test") {
    configDotenv({ path: ".env.test" });
  } else {
    configDotenv();
  }
  
  export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(sessionHandler());