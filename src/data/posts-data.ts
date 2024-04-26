import { Post, PostsFilters } from "../models/posts";
import * as db from "../db";
import { filtering, sorting } from "./utils";

export async function getPostsFromDB(
  filters: PostsFilters = {},
  sort?: string,
  page?: number,
  limit?: number
): Promise<Post[]> {
  let query =
    "SELECT p.id,p.content,p.createdat,p.updatedat,u.username, COALESCE(SUM(CASE WHEN pl.id IS NOT NULL THEN 1 ELSE 0 END),0) AS LikesCount FROM posts AS p JOIN users AS u ON u.id=p.userid LEFT JOIN likes AS pl ON pl.postid = p.id GROUP BY p.id, u.username";
  const queryParams: (string | boolean | number)[] = [];

  //Filtering:
  query = filtering(query, filters, queryParams);

  //Sorting:
  query = sorting(query, sort);

  //Pagination:
  if (page && limit) {
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  const result = await db.query(query, queryParams);
  return result.rows;
}

export async function getPostsCountFromDB(
  filters: PostsFilters = {}
): Promise<number> {
  let query = "SELECT COUNT(*) FROM posts";
  const queryParams: (string | boolean | number)[] = [];
  // Filtering
  query = filtering(query, filters, queryParams);

  const result = await db.query(query, queryParams);
  return Number(result.rows[0].count);
}
