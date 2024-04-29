import { describe, beforeEach, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app"; // Import your Express app

import * as db from "../db";

const testPosts = [
  { userid: 4, content: "Im a testing" },
  { userid: 2, content: "Hello world" },
];

// const updates = [
//   {
//     content: "I'm a new  testing",
//     userid: "2024-04-28T12:00:00.000Z",
//     updatedat: "2024-04-28T12:30:00.000Z",
//   },
//   {
//     content: "I'm a update",
//     createdat: "2024-04-29T12:00:00.000Z",
//     updatedat: "2024-04-29T12:30:00.000Z",
//   },
// ];

describe("Posts API", () => {
  beforeEach(async () => {
    const values = testPosts
      .map((post) => `('${post.userid}','${post.content}')`)
      .join(", ");
    let query = `INSERT INTO posts (userid, content) VALUES ${values} RETURNING id,content,createdat,updatedat,(SELECT u.username FROM users AS u WHERE u.id =posts.userid) AS username, 0 AS likesCount`;

    await db.query(query);
  });
  it("should get all posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    // expect(response.body.data).toHaveLength(2);
  });
});
