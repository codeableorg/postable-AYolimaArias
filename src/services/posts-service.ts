import { getPostsCountFromDB, getPostsFromDB } from "../data/posts-data";
import { Post, PostsFilters } from "../models/posts";

export async function getPosts(
  filters: PostsFilters = {},
  sort?: string,
  page: number = 1,
  limit: number = 10
): Promise<Post[]> {
  return await getPostsFromDB(filters, sort, page, limit);
}

export async function getPostsCount(
  filters: PostsFilters = {}
): Promise<number> {
  return getPostsCountFromDB(filters);
}
