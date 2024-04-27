import { query } from "../db";
import { Post, UpdatePostParams } from "../models/posts";

//POST/posts:
export async function createPostDB(id: number, post: Post) {
  const { content } = post;
  const result = await query(
    "INSERT INTO posts (userid, content) VALUES ($1,$2) RETURNING *,(SELECT u.username FROM users AS u WHERE u.id =$1) AS username, 0 AS likesCount",
    [id, content]
  );
  return result.rows[0];
}

//PATCH/posts:id:
export async function updatePostDB({
  id,
  fieldsToUpdate,
}: UpdatePostParams): Promise<Post> {
  if (!id || Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }

  const entries = Object.entries(fieldsToUpdate);
  const setClauses = entries.map(([key, _], index) => `${key} = $${index + 1}`);

  const updateQuery = `UPDATE posts SET ${setClauses.join(
    ", "
  )}, updatedat = NOW() WHERE id = $${
    entries.length + 1
  } RETURNING *, (SELECT username FROM users WHERE id = posts.userid) AS username`;

  // Los parámetros deben incluir id y userId al principio, seguidos de los valores de los campos a actualizar
  const params = [...entries.map(([, value]) => value), id];

  const result = await query(updateQuery, params);

  return result.rows[0];
}
