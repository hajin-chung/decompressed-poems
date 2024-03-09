import { renderToString } from "jsx";
import opine, { json } from "https://deno.land/x/opine@2.3.3/mod.ts";
import { Main } from "./views.tsx";
import { getContent, Post, putContent, putObject } from "./s3.ts";
import { NewPost } from "./s3.ts";
import { createId } from "npm:@paralleldrive/cuid2";

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
  const body = await req.body as NewPost;

  const postId = createId();
  const post: Post = { id: postId, ...body };

  const content = await getContent();
  if (content === null) {
    res.send("ERROR content.json not found").sendStatus(500);
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

app.get("/", (_, res) => {
  res.send("Welcome! you have reached decompressed poems api.");
});

app.listen(3000, () => {
  console.log("server listening on http://localhost:3000");
});
