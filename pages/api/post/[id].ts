import type { NextApiRequest, NextApiResponse } from "next";
import { Post } from "@/utils/types";
import { getPost } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | undefined>
) {
  const id = req.query.id as string;
  const post = await getPost(id);
  res
    .status(200)
    .json(post);
}
