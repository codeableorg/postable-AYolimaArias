import express, { NextFunction, Request, Response } from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { ApiError } from "../middlewares/error";
import { Post } from "../models/posts";
import { createPost, updatePost } from "../services/post-service";

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

//PATCH/posts/:id:

postRouter.patch(
  "/:id",
  authenticateHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData: Post = req.body;
      const { id } = req.params;
      const post = await updatePost(Number(id), postData);
      res.json({
        ok: true,
        data: {
          id: post.id,
          content: post.content,
          createdAt: post.createdat,
          updatedAt: post.updatedat,
          username: post.username,
          likesCount: post.likes_count,
        },
      });
    } catch (error) {
      console.log(error);
      next(new ApiError("Bad Request", 400));
    }
  }
);

export default postRouter;
