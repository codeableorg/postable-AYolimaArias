import { User} from "../models/user";
import * as userDB from "../data/user-data";

//GET/me:

export async function getProfile(id: number): Promise<User | undefined> {
  const user = await userDB.getUser(id);
  return user;
}
