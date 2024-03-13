import { S3Client } from "s3";
import { S3_ACCESS_KEY, S3_SECRET_KEY } from "./env.ts";

export type Post = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  content: string;
};

export type NewPost = Omit<Post, "id" | "createdAt" | "updatedAt">;

export type Poem = {
  id: string;
  createdAt: string;
  content: string;
};

export type NewPoem = {
  content: string;
};

export type Content = {
  posts: Post[];
  poems: Poem[];
};

export const s3Client = new S3Client({
  endPoint: "s3.ap-northeast-2.amazonaws.com",
  port: 443,
  useSSL: true,
  region: "ap-northeast-2",
  bucket: "decompressed-poems",
  pathStyle: false,
  accessKey: S3_ACCESS_KEY,
  secretKey: S3_SECRET_KEY,
});

export async function getObject(key: string) {
  try {
    const object = await s3Client.getObject(key);
    const content = await object.text();
    return content;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function putObject(
  key: string,
  data: string,
  contentType?: string,
) {
  await s3Client.putObject(key, data, {
    metadata: {
      "Content-Type": contentType ?? "text/html",
      "Cache-Control": "no-cache",
    },
  });
}

export async function deleteObject(key: string) {
  await s3Client.deleteObject(key);
}

export async function getContent() {
  try {
    const contentObject = await s3Client.getObject("content.json");
    const content = await contentObject.json() as Content;
    console.log(content);
    return content;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function putContent(newContent: Content) {
  await s3Client.putObject("content.json", JSON.stringify(newContent), {
    metadata: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
}
