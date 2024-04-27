import express, { NextFunction, Request, Response } from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { ApiError } from "../middlewares/error";
import { Post } from "../models/posts";
import { createPost } from "../services/post-service";

const postRouter = express.Router();

//POST/posts:
postRouter.post(
  "/",
  authenticateHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.userId === undefined) {
      return next(new ApiError("Unauthorized", 401));
    }
    try {
      const postData: Post = req.body;
      const newPost = await createPost(req.userId, postData);
      res.status(201).json({
        ok: true,
        data: newPost,
      });
    } catch (error) {
      next(new ApiError("Bad Request", 400));
    }
  }
);

export default postRouter;
