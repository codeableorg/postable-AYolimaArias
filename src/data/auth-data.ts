import { query } from "../db";
import { User } from "../models/auth";

export async function createUser(
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: string
): Promise<User> {
  return (
    await query(
      "INSERT INTO users (username, firstname, lastname,email, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, firstname, lastname, email, password, role]
    )
  ).rows[0];
}

export async function getUserByUsername(
  username: string
): Promise<User | undefined> {
  return (await query("SELECT * FROM users WHERE username=$1", [username]))
    .rows[0];
}
