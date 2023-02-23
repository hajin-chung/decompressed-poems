import { Post, PostInfo } from "./types";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URI,
});

export const getPosts = async (cursor?: string) => {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT id, title, created FROM posts ORDER BY created DESC"
    );
    return res.rows as PostInfo[];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getPost = async (id: string) => {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT id, title, created, content FROM posts WHERE id=$1",
      [id]
    );
    return res.rows[0] as Post;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
