import express, { NextFunction, Request, Response } from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { getProfile } from "../services/user-service";
import { ApiError } from "../middlewares/error";

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
      next(new ApiError("Bad Request", 400));
    }
  }
);

export default userRouter;
