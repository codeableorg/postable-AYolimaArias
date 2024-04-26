import { z } from "zod";

export const postSchema = z.object({
  content: z.string().optional(),
  createdat: z.string().optional(),
  updatedat: z.string().optional(),
  username: z.string().optional(),
  likescount: z.number().optional(),
});

export type PostParams = z.infer<typeof postSchema>;

export type Post = PostParams & { id: number };

export type PostsFilters = {
  username?: string;
};
