import { query } from "../db";
import { User } from "../models/user";

//GET/me:

export async function getUser(id: number): Promise<User | undefined> {
  const result = await query("SELECT * FROM users WHERE id=$1", [id]);
  return result.rows[0];
}
