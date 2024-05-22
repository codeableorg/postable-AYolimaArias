import express from "express";
import { validationHandler } from "../middlewares/validation";
import { userSchema } from "../models/auth";
import jwt from "jsonwebtoken";
import { createUser, validateCredentials } from "../services/auth-service";

const jwtSecret = "ultra-secret";

const authRouter = express.Router();

//POST/signup:

authRouter.post(
  "/signup",
  validationHandler(userSchema),
  async (req, res, next) => {
    try {
      const newUser = await createUser(req.body);
      console.log(newUser);
      res.status(201).json({
        ok: true,
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstname,
          lastName: newUser.lastname,
          createdAt: newUser.createdat,
          updatedAt: newUser.updatedat,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//POST/login:

authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await validateCredentials(req.body);
    const payload = { userId: user.id, userRole: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "120m" });
    res.json({
      ok: true,
      message: "Login successful",
      data: { token: token },
    });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
