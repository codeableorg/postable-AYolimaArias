import express, { Request, Response } from "express";
import { PostsFilters } from "../models/posts";
import {
  getPostsByUsername,
  getPosts,
  getPostsCount,
} from "../services/posts-service";

const postsRouter = express.Router();

// GET/posts?page=2&limit=5

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

//GET/posts/:username?page=2&limit=5

postsRouter.get("/posts/:username", async (req: Request, res: Response) => {
  // const filters: PostsFilters = {
  //   username: req.params["username"] as string,
  // };
  // const sort = req.query["sort"] as string | undefined;
  // const page = Number(req.query["page"]) || 1;
  // const limit = Number(req.query["limit"]) || 10;

  // const username = req.params["username"];
  // const post = await getPostWithUsername(filters, sort, page, limit, username);

  // //pagination:
  // const totalItems = await getPostsCount(filters);
  // const totalPages = Math.ceil(totalItems / limit);
  // res.json({
  //   ok: true,
  //   data: post,
  //   pagination: {
  //     page: 1,
  //     pageSize: 10,
  //     totalItems: 5,
  //     totalPages: 1,
  //     nextPage: page < totalPages ? page + 1 : null,
  //     previousPage: page > 1 ? page - 1 : null,
  //   },
  // });
  const { username } = req.params;
  try {
    const result = await getPostsByUsername(username);
    res.json({
      ok: true,
      result: result,
    });
  } catch (error) {
    res.status(404).json({ ok: false, message: "Error" });
  }
});

export default postsRouter;
