/** @jsx h */
/** @jsxFrag Fragment */
import { h } from "jsx";
import { Content, Poem, Post } from "./s3.ts";
import { render } from "gfm";

type LayoutProps = { children?: JSX.Element };

function Header() {
  return (
    <header hx-boost="true">
      <a id="title" href="/">Decompressed Poems</a>
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
        <link href="/md.css" rel="stylesheet" />
        <script
          src="https://unpkg.com/htmx.org@1.9.10"
          integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
          crossorigin="anonymous"
        >
        </script>
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

export function Test(content: string) {
  const body = render(content);
  return (
    <Layout>
      <link href="/public/style.css" rel="stylesheet" />
      <link href="/public/md.css" rel="stylesheet" />
      <h2>this is sample title</h2>
      <h4>description of this thingy</h4>
      <article
        data-color-mode="dark"
        data-light-theme="dark"
        data-dark-theme="dark"
        class="markdown-body"
        dangerouslySetInnerHTML={{ __html: body }}
      />
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
