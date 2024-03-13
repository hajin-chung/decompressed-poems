/** @jsx h */
/** @jsxFrag Fragment */
import { h } from "jsx";
import { Content, Poem, Post } from "./s3.ts";
import { render } from "./utils.ts";

type LayoutProps = { children?: JSX.Element };

function Header() {
  return (
    <header>
      <h1>Decompressed Poems</h1>
      <nav>
        <a href="/posts.html">posts</a>
        <a href="/poems.html">poems</a>
      </nav>
    </header>
  );
}

function Layout({ children }: LayoutProps) {
  return (
    <html>
      <head>
        <title>Decompressed Poems</title>
        <link href="/style.css" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>
          {...children}
        </main>
      </body>
    </html>
  );
}

type PostListProps = {
  posts: Post[];
};

function PostList({ posts }: PostListProps) {
  return (
    <div class="post-list">
      {posts.map((post) => (
        <a href={`/post/${post.id}.html`} class="post-link">
          <p class="post-title">{post.title}</p>
          <p class="post-description">{post.description}</p>
          <p class="post-date">{post.createdAt}</p>
        </a>
      ))}
    </div>
  );
}

export function Test() {
  return (
    <Layout>
      <h1>hi</h1>
    </Layout>
  );
}

export function MainPage(content: Content) {
  return (
    <Layout>
      <PostList posts={content.posts} />
    </Layout>
  );
}

export function PostsPage(posts: Post[]) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  );
}

export function PostPage(post: Post) {
  return (
    <Layout>
      <h2>{post.title}</h2>
      <h4>{post.description}</h4>
      <article>
        {render(post.content)}
      </article>
    </Layout>
  );
}

export function PoemsPage(poems: Poem[]) {
  return (
    <Layout>
      {poems.map((poem) => (
        <div class="poem">
          <p class="poem-content">{poem.content}</p>
          <p class="poem-date">{poem.createdAt}</p>
        </div>
      ))}
    </Layout>
  );
}
