import { renderToString } from "jsx";
import opine, { json } from "https://deno.land/x/opine@2.3.3/mod.ts";
import { Main } from "./views.tsx";
import { deleteObject, getContent, Post, putContent, putObject } from "./s3.ts";
import { NewPost } from "./s3.ts";
import { createId, current } from "./utils.ts";
import { Thought } from "./s3.ts";
import { NewThought } from "./s3.ts";

const app = opine();
app.use(json());

app.post("/build", async (_, res) => {
  const content = await getContent();
  if (content === null) {
    res.send("ERROR content.json not found").sendStatus(500);
    return;
  }

  const mainPage = await renderToString(Main());
  const postsPage = await renderToString(Main());
  const thoughtsPage = await renderToString(Main());

  await putObject("index.html", mainPage);
  await putObject("posts.html", postsPage);
  await putObject("thoughts.html", thoughtsPage);

  await Promise.all(
    content.posts.map(async (post) => {
      const postPage = await renderToString(Main());
      return putObject(`post/${post.id}.html`, postPage);
    }),
  );

  res.send("success").sendStatus(200);
});

app.post("/post", async (req, res) => {
  const body = req.body as NewPost;
  const createdAt = current();

  const postId = createId();
  const post: Post = { id: postId, createdAt, ...body };

  const content = await getContent();
  if (content === null) {
    res.send("ERROR content.json not found").sendStatus(404);
    return;
  }

  content.posts.push(post);
  await putContent(content);

  const mainPage = await renderToString(Main());
  const postsPage = await renderToString(Main());
  const postPage = await renderToString(Main());

  await putObject("index.html", mainPage);
  await putObject(`posts.html`, postsPage);
  await putObject(`post/${postId}.html`, postPage);

  return res.send("success").sendStatus(200);
});

app.delete("/post/:id", async (req, res) => {
  const postId = req.params["id"];

  const content = await getContent();
  if (content === null) {
    res.send("ERROR content.json not found").sendStatus(404);
    return;
  }

  const postIdx = content.posts.findIndex((p) => p.id === postId);
  if (postIdx === -1) {
    res.send(`ERROR post with id ${postId} not found`).sendStatus(404);
    return;
  }

  content.posts.splice(postIdx, 1);
  await putContent(content);
  await deleteObject(`post/${postId}.html`);

  const mainPage = await renderToString(Main());
  const postsPage = await renderToString(Main());

  await putObject("index.html", mainPage);
  await putObject(`posts.html`, postsPage);
  await deleteObject(`post/${postId}.html`);

  return res.send("success");
});

app.post("/post/:id", async (req, res) => {
  const body = req.body as NewPost;
  const postId = req.params.id;
  const updatedAt = current();

  const content = await getContent();
  if (content === null) {
    res.send("ERROR content.json not found").sendStatus(404);
    return;
  }

  const postIdx = content.posts.findIndex((post) => post.id === postId);
  if (postIdx === -1) {
    return res.send(`ERROR post with ${postId} not found`).sendStatus(404);
  }

  const post: Post = { ...content.posts[postIdx], updatedAt, ...body };
  content.posts[postIdx] = post;

  await putContent(content);

  const mainPage = await renderToString(Main());
  const postsPage = await renderToString(Main());
  const postPage = await renderToString(Main());

  await putObject("index.html", mainPage);
  await putObject(`posts.html`, postsPage);
  await putObject(`post/${postId}.html`, postPage);

  return res.send("success").sendStatus(200);
});

app.post("/thought", async (req, res) => {
  const body = req.body as NewThought;
  const thoughtId = createId();
  const createdAt = current();

  const thought: Thought = { id: thoughtId, content: body.content, createdAt };

  const content = await getContent();
  if (content === null) {
    return res.send("ERROR content.json not found").sendStatus(404);
  }

  content.thoughts.push(thought);
  await putContent(content);

  const thoughtsPage = await renderToString(Main());
  await putObject("thoughts.html", thoughtsPage);

  return res.send("success").sendStatus(200);
});

app.delete("/thought/:id", async (req, res) => {
  const thoughtId = req.params.id;

  const content = await getContent();
  if (content === null) {
    return res.send("ERROR content.json not found").sendStatus(404);
  }

  const thoughtIdx = content.thoughts.findIndex((t) => t.id === thoughtId);
  if (thoughtIdx === -1) {
    return res.send(`ERROR thought with id ${thoughtId} not found`).sendStatus(
      404,
    );
  }

  content.thoughts.splice(thoughtIdx, 1);
  await putContent(content);

  const thoughtsPage = await renderToString(Main());
  await putObject("thoughts.html", thoughtsPage);

  return res.send("success").sendStatus(200);
});

app.get("/", (_, res) => {
  res.send("Welcome! you have reached decompressed poems api.");
});

app.listen(3000, () => {
  console.log("server listening on http://localhost:3000");
});
