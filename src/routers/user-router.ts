import express, { NextFunction, Request, Response } from "express";
// import { authenticateHandler } from "../middlewares/authenticate";
import { getProfile } from "../services/user-service";
import { ApiError } from "../middlewares/error";
import jwt from "jsonwebtoken";

const jwtSecret = "ultra-secret";

const userRouter = express.Router();

//GET/me:

userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  let userId;
  try {
    const payload = jwt.verify(token, jwtSecret) as {
      userId: number;
      iat: number;
      exp: number;
    }; // { userId: 5, iat: 1704896639, exp: 1704896699 }

    userId = payload.userId;
  } catch (error) {
    next(new ApiError("No autorizado", 401));
    return;
  }

  if (!userId) {
    next(new ApiError("No autorizado", 401));
    return;
  }
  const profile = await getProfile(userId);
  if (profile) {
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
  } else {
    next(new ApiError("No autorizado", 401));
  }
});

export default userRouter;
