import { User } from "../models/user";
import * as userDB from "../data/user-data";

//GET/me:
export async function getProfile(id: number): Promise<User> {
  const user = await userDB.getUser(id);
  return user;
}

//PATCH/me:
export async function updateProfile(id: number, user: User) {
  const dataUser = {
    id,
    fieldsToUpdate: user,
  };
  const updateProfile: User = await userDB.editUser(dataUser);
  return updateProfile;
}
