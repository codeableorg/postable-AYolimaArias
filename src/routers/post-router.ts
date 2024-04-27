import express, { NextFunction, Request, Response } from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { ApiError } from "../middlewares/error";
import { Post } from "../models/posts";
import {
  createPost,
  deleteLikeInPost,
  likePostInPostData,
  updatePost,
} from "../services/post-service";

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
        data: post,
      });
    } catch (error) {
      console.log(error);
      next(new ApiError("Bad Request", 400));
    }
  }
);

//POST/posts/:postId/like:

postRouter.post(
  "/:postId/like",
  authenticateHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const { postId } = req.params;
      const createdat = new Date().toISOString();
      const like = {
        postid: Number(postId),
        userid: Number(userId),
        createdat,
      };
      const likedPost = await likePostInPostData(like);
      res.json({
        ok: true,
        message: "Like successfull",
        data: likedPost,
      });
    } catch (error) {
      next(new ApiError("Post doesn't exist", 404));
    }
  }
);

// DELETE/posts/:postId/like:
postRouter.delete(
  "/:postId/like",
  authenticateHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const { postId } = req.params;

      const deleteLike = await deleteLikeInPost(Number(postId), Number(userId));
      res.json({
        ok: true,
        message: "Like deleted",
        data: deleteLike,
      });
    } catch (error) {}
  }
);

export default postRouter;
