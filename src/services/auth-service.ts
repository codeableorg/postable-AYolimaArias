import bcrypt from "bcrypt";
import { User, UserParams } from "../models/auth";
import * as userDB from "../data/auth-data";
import { ApiError } from "../middlewares/error";

//POST/signup:
export async function createUser(data: UserParams): Promise<User> {
  const { username, firstname, lastname, email, password, role } = data;

  const user = await userDB.getUserByUsername(username);
  if (user) {
    throw new ApiError("El username ya está registrado", 400);
  }
  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor);
  const newUser = await userDB.createUser(
    username,
    firstname ?? "",
    lastname ?? "",
    email ?? "",
    hashedPassword,
    role
  );
  return newUser;
}
