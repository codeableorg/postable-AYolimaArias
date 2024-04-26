import express, { Request, Response } from "express";
import { PostsFilters } from "../models/posts";
import { getPosts, getPostsCount } from "../services/posts-service";

const postsRouter = express.Router();

postsRouter.get("/posts", async (req: Request, res: Response) => {
  const filters: PostsFilters = {
    username: req.query["username"] as string,
  };
  const sort = req.query["sort"] as string | undefined;
  const page = Number(req.query["page"]) || 1;
  const limit = Number(req.query["limit"]) || 10;

  const posts = await getPosts(filters, sort, page, limit);

  //pagination:
  const totalItems = await getPostsCount(filters);
  const totalPages = Math.ceil(totalItems / limit);

  res.json({
    ok: true,
    data: [{ posts: posts }],
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 20,
      totalPages: 2,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    },
  });
});

export default postsRouter;
