import { createPostDB, updatePostDB } from "../data/post-data";
import { Post } from "../models/posts";

//POST/posts:
export async function createPost(id: number, post: Post) {
  const newPost: Post = await createPostDB(id, post);
  return newPost;
}

//PATCH/posts/:id:
export async function updatePost(id: number, post: Post) {
  const dataPost = {
    id,
    fieldsToUpdate: post,
  };
  const updatePost: Post = await updatePostDB(dataPost);
  return updatePost;
}
