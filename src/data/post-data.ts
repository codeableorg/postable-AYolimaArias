import { query } from "../db";
import { Post } from "../models/posts";

//POST/posts:
export async function createPostDB(id: number, post: Post) {
  const { content } = post;
  const result = await query(
    "INSERT INTO posts (userid, content) VALUES ($1,$2) RETURNING *,(SELECT u.username FROM users AS u WHERE u.id =$1) AS username, 0 AS likesCount",
    [id, content]
  );
  return result.rows[0];
}
