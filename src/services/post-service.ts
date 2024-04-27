import { createPostDB } from "../data/post-data";
import { Post } from "../models/posts";

//POST/posts:
export async function createPost(id: number, post: Post) {
  const newPost: Post = await createPostDB(id, post);
  return newPost;
}
