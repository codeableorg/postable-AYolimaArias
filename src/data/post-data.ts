import { query } from "../db";
import { Like } from "../models/like";
import { Post, UpdatePostParams } from "../models/posts";

//POST/posts:
export async function createPostDB(id: number, post: Post) {
  const { content } = post;
  const result = await query(
    "INSERT INTO posts (userid, content) VALUES ($1,$2) RETURNING id,content,createdat,updatedat,(SELECT u.username FROM users AS u WHERE u.id =$1) AS username, 0 AS likesCount",
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

  const params = [...entries.map(([, value]) => value), id];

  const result = await query(updateQuery, params);

  return result.rows[0];
}

//POST/posts/:postId/like:
export async function createLikePostDB(like: Like): Promise<Post> {
  const { userid, postid, createdat } = like;
  const likeResult = await query(
    "INSERT INTO likes (userId, postId, createdat) VALUES ($1, $2, $3)",
    [userid, postid, createdat]
  );

  const postResult = await query(
    "SELECT p.id, p.content, p.createdat, p.updatedat, u.username, COALESCE(COUNT(pl.*), 0) AS likesCount FROM posts AS p JOIN users AS u ON u.id = p.userid LEFT JOIN likes AS pl ON pl.postid = p.id WHERE p.id = $1 GROUP BY p.id, u.username",
    [postid]
  );

  return {
    ...postResult.rows[0],
    like: likeResult.rows[0],
  };
}

//DELETE/posts/:postId/like:
export async function deleteLikeFromDB(
  postId: number,
  userId: number
): Promise<void> {
  await query("DELETE FROM likes WHERE postid = $1 AND userid =$2", [
    postId,
    userId,
  ]);
  const postResult = await query(
    "SELECT p.id, p.content, p.createdat, p.updatedat, u.username, COALESCE(COUNT(pl.*), 0) AS likesCount FROM posts AS p JOIN users AS u ON u.id = p.userid LEFT JOIN likes AS pl ON pl.postid = p.id WHERE p.id = $1 GROUP BY p.id, u.username",
    [postId]
  );

  return postResult.rows[0];
}
