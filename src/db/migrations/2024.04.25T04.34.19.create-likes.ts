import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  return params.context.query(`CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    postId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES posts(id),
    FOREIGN KEY (userId) REFERENCES users(id),
    CONSTRAINT unique_like UNIQUE (postId, userId)
  );
  `);
};
export const down: Migration = async (params) => {
  return params.context.query(`DROP TABLE likes;`);
};
