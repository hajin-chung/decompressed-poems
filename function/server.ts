import { renderToString } from "jsx";
import opine, { json } from "opine";
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

const app = opine();
app.use(json());

app.post("/build", async (_, res) => {
  const content = await getContent();
  if (content === null) {
    res.send("ERROR content.json not found").sendStatus(500);
    return;
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

  const mainPage = await renderToString(MainPage(content));
  const postsPage = await renderToString(PostsPage(content.posts));
  const postPage = await renderToString(PostPage(post));

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

  const mainPage = await renderToString(MainPage(content));
  const postsPage = await renderToString(PostsPage(content.posts));

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

  const mainPage = await renderToString(MainPage(content));
  const postsPage = await renderToString(PostsPage(content.posts));
  const postPage = await renderToString(PostPage(post));

  await putObject("index.html", mainPage);
  await putObject(`posts.html`, postsPage);
  await putObject(`post/${postId}.html`, postPage);

  return res.send("success").sendStatus(200);
});

app.post("/poem", async (req, res) => {
  const body = req.body as NewPoem;
  const poemId = createId();
  const createdAt = current();

  const poem: Poem = { id: poemId, content: body.content, createdAt };

  const content = await getContent();
  if (content === null) {
    return res.send("ERROR content.json not found").sendStatus(404);
  }

  content.poems.push(poem);
  await putContent(content);

  const poemsPage = await renderToString(PoemsPage(content.poems));
  await putObject("poems.html", poemsPage);

  return res.send("success").sendStatus(200);
});

app.delete("/poem/:id", async (req, res) => {
  const poemId = req.params.id;

  const content = await getContent();
  if (content === null) {
    return res.send("ERROR content.json not found").sendStatus(404);
  }

  const poemIdx = content.poems.findIndex((p) => p.id === poemId);
  if (poemIdx === -1) {
    return res.send(`ERROR poem with id ${poemId} not found`).sendStatus(
      404,
    );
  }

  content.poems.splice(poemIdx, 1);
  await putContent(content);

  const poemsPage = await renderToString(PoemsPage(content.poems));
  await putObject("poems.html", poemsPage);

  return res.send("success").sendStatus(200);
});

app.get("/", (_, res) => {
  res.send("Welcome! you have reached decompressed poems api.");
});

app.get("/test", async (_, res) => {
  const html = await renderToString(Test());
  res.send(html).setHeader("Content-Type", "text/html; utf-8").sendStatus(200);
});

app.listen(3000, () => {
  console.log("server listening on http://localhost:3000");
});
