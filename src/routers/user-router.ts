import express, { NextFunction, Request, Response } from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { getProfile, updateProfile } from "../services/user-service";
import { ApiError } from "../middlewares/error";
import { User } from "../models/user";

const userRouter = express.Router();

//GET/me:

userRouter.get(
  "/",
  authenticateHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.userId === undefined) {
      return next(new ApiError("Unauthorized", 401));
    }
    try {
      const profile = await getProfile(req.userId);
      res.json({
        ok: true,
        data: {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          firstName: profile.firstname,
          lastName: profile.lastname,
          createdAt: profile.createdat,
          updatedAt: profile.updatedat,
        },
      });
    } catch (error) {
      next(new ApiError("Unauthorized", 401));
    }
  }
);

//PATCH/me:
userRouter.patch(
  "/",
  authenticateHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.userId === undefined) {
      return next(new ApiError("Unauthorized", 401));
    }
    try {
      const userData: User = req.body;
      const profile = await updateProfile(req.userId, userData);
      res.json({
        ok: true,
        message: "User updated successfully",
        data: {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          firstName: profile.firstname,
          lastName: profile.lastname,
          createdAt: profile.createdat,
          updatedAt: profile.updatedat,
        },
      });
    } catch (error) {
      next(
        new ApiError(
          "Bad request: only firstName, lastName or email can be edited",
          401
        )
      );
    }
  }
);

export default userRouter;
