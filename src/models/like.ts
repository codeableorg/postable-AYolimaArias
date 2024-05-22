import { z } from "zod";

export const likeSchema = z.object({
  createdat: z.string(),
});

export type LikeParams = z.infer<typeof likeSchema>;

export type Like = LikeParams & { id?: number; postid: number; userid: number };
