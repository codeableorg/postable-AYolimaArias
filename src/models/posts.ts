import { z } from "zod";

export const postSchema = z.object({
  content: z.string(),
  createdat: z.string(),
  updatedat: z.string(),
  username: z.string(),
  likes_count: z.number(),
});

export type PostParams = z.infer<typeof postSchema>;

export type Post = PostParams & { id?: number };

export type PostsFilters = {
  username?: string;
};
export interface UpdatePostParams {
  id: number;
  fieldsToUpdate: Record<string, any>;
}
