import type { NextApiRequest, NextApiResponse } from "next";
import { PostInfo } from "@/utils/types";
import { getPosts } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostInfo[]>
) {
  let { cursor } = req.query;
  if (typeof cursor === "object") cursor = "";
  const posts = await getPosts(cursor);
  res.status(200).json(posts);
}
