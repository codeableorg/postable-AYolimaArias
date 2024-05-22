import {
  createLikePostDB,
  createPostDB,
  deleteLikeFromDB,
  updatePostDB,
} from "../data/post-data";
import { Like } from "../models/like";
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

//POST/posts/:postId/like:
export async function likePostInPostData(like: Like): Promise<Post> {
  const likedPost = await createLikePostDB(like);
  return likedPost;
}

//DELETE/posts/:postId/like:
export async function deleteLikeInPost(
  postId: number,
  userId: number
): Promise<void> {
  const deleteLike = await deleteLikeFromDB(postId, userId);
  return deleteLike;
}
