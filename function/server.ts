import { renderToString } from "jsx";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono-helper";
import { serveStatic } from "hono-middleware";
import { MainPage, PoemsPage, PostPage, PostsPage, Test } from "./views.tsx";
import {
  deleteObject,
  getContent,
  NewPoem,
  NewPost,
  Poem,
  Post,
  putContent,
  putObject,
} from "./s3.ts";
import { createId, current } from "./utils.ts";
import { PASSWORD } from "./env.ts";

const app = new Hono();

type AuthBody = {
  password: string;
};

app.post("/auth", async (c) => {
  const { password } = await c.req.json() as AuthBody;
  if (password === PASSWORD) {
    setCookie(c, "password", password);
    return c.json({ error: false });
  }
  return c.json({ error: true, message: "password not match" });
});

app.use(async (c, next) => {
  const password = getCookie(c, "password");
  if (password !== PASSWORD) {
    return c.json({ error: true, message: "unauthorized" }, 401);
  }
  await next();
});

app.post("/build", async (c) => {
  const content = await getContent();
  if (content === null) {
    return c.json({ error: true, message: "content.json not found" }, 500);
  }

  const mainPage = await renderToString(MainPage(content));
  const postsPage = await renderToString(PostsPage(content.posts));
  const poemsPage = await renderToString(PoemsPage(content.poems));

  await putObject("index.html", mainPage);
  await putObject("posts.html", postsPage);
  await putObject("poems.html", poemsPage);

  await Promise.all(
    content.posts.map(async (post) => {
      const postPage = await renderToString(PostPage(post));
      return putObject(`post/${post.id}.html`, postPage);
    }),
  );

  return c.json({ error: false });
});

app.post("/post", async (c) => {
  const body = await c.req.json() as NewPost;
  const createdAt = current();

  const postId = createId();
  const post: Post = { id: postId, createdAt, ...body };

  const content = await getContent();
  if (content === null) {
    return c.json({ error: true, message: "content.json not found" }, 500);
  }

  content.posts.push(post);
  await putContent(content);

  const mainPage = await renderToString(MainPage(content));
  const postsPage = await renderToString(PostsPage(content.posts));
  const postPage = await renderToString(PostPage(post));

  await putObject("index.html", mainPage);
  await putObject(`posts.html`, postsPage);
  await putObject(`post/${postId}.html`, postPage);

  return c.json({ error: false, post });
});

app.delete("/post/:id", async (c) => {
  const postId = c.req.param("id");

  const content = await getContent();
  if (content === null) {
    return c.json({ error: true, message: "content.json not found" }, 500);
  }

  const postIdx = content.posts.findIndex((p) => p.id === postId);
  if (postIdx === -1) {
    return c.json(
      { error: true, message: `post with id ${postId} not found` },
      500,
    );
  }

  content.posts.splice(postIdx, 1);
  await putContent(content);
  await deleteObject(`post/${postId}.html`);

  const mainPage = await renderToString(MainPage(content));
  const postsPage = await renderToString(PostsPage(content.posts));

  await putObject("index.html", mainPage);
  await putObject(`posts.html`, postsPage);
  await deleteObject(`post/${postId}.html`);

  return c.json({ error: false, postId });
});

app.post("/post/:id", async (c) => {
  const body = await c.req.json() as NewPost;
  const postId = c.req.param("id");
  const updatedAt = current();

  const content = await getContent();
  if (content === null) {
    return c.json({ error: true, message: "content.json not found" }, 500);
  }

  const postIdx = content.posts.findIndex((post) => post.id === postId);
  if (postIdx === -1) {
    return c.json(
      { error: true, message: `post with id ${postId} not found` },
      500,
    );
  }

  const post: Post = { ...content.posts[postIdx], updatedAt, ...body };
  content.posts[postIdx] = post;

  await putContent(content);

  const mainPage = await renderToString(MainPage(content));
  const postsPage = await renderToString(PostsPage(content.posts));
  const postPage = await renderToString(PostPage(post));

  await putObject("index.html", mainPage);
  await putObject(`posts.html`, postsPage);
  await putObject(`post/${postId}.html`, postPage);

  return c.json({ error: false, post });
});

app.post("/poem", async (c) => {
  const body = await c.req.json() as NewPoem;
  const poemId = createId();
  const createdAt = current();

  const poem: Poem = { id: poemId, content: body.content, createdAt };

  const content = await getContent();
  if (content === null) {
    return c.json({ error: true, message: "content.json not found" }, 500);
  }

  content.poems.push(poem);
  await putContent(content);

  const poemsPage = await renderToString(PoemsPage(content.poems));
  await putObject("poems.html", poemsPage);

  return c.json({ error: false, poem });
});

app.delete("/poem/:id", async (c) => {
  const poemId = c.req.param("id");

  const content = await getContent();
  if (content === null) {
    return c.json({ error: true, message: "content.json not found" }, 500);
  }

  const poemIdx = content.poems.findIndex((p) => p.id === poemId);
  if (poemIdx === -1) {
    return c.json(
      { error: true, message: `poem with id ${poemId} not found` },
      500,
    );
  }

  content.poems.splice(poemIdx, 1);
  await putContent(content);

  const poemsPage = await renderToString(PoemsPage(content.poems));
  await putObject("poems.html", poemsPage);

  return c.json({ error: false, poemId });
});

app.get("/content", async (c) => {
  const content = await getContent();
  if (content === null) {
    return c.json({ error: true, message: "content.json not found" }, 500);
  }

  return c.json(content);
});

app.get("/", (c) => {
  return c.text("Welcome! you have reached decompressed poems api.");
});

app.get("/test", async (c) => {
  const html = await renderToString(Test());
  return c.html(html);
});

app.use("/*", serveStatic({ root: "./public" }));

Deno.serve({ port: 3000 }, app.fetch);
