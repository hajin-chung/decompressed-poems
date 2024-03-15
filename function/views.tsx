/** @jsx h */
/** @jsxFrag Fragment */
import { h } from "jsx";
import { Content, Poem, Post } from "./s3.ts";
import { render } from "gfm";
import { formatDate } from "./utils.ts";

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

type LayoutProps = { children?: JSX.Element; isAdmin?: boolean };

function Layout({ children, isAdmin }: LayoutProps) {
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
      <body class={isAdmin ? "admin" : ""}>
        {!isAdmin && <Header />}
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
      <div class="poems">
        {poems.map((poem) => (
          <div class="poem">
            <p class="poem-content">{poem.content}</p>
            <p class="poem-date">{formatDate(poem.createdAt)}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export function AdminPage() {
  return (
    <Layout isAdmin={true}>
      <a id="title" href="/">Decompressed Poems</a>
      <nav>
        <a href="/admin/posts.html">posts</a>
        <a href="/admin/poems.html">poems</a>
      </nav>
    </Layout>
  );
}

export function AdminPostPage(posts: Post[]) {
  return (
    <Layout isAdmin={true}>
      <a id="title" href="/">Decompressed Poems</a>
      <nav>
        <a href="/admin/posts.html">posts</a>
        <a href="/admin/poems.html">poems</a>
      </nav>
      <div id="dashboard-post">
        <div class="list">
          <button class="new">new</button>
          {posts.map((post) => (
            <div class="controls">
              <button class="edit link">{post.title}</button>
              <button class="delete">delete</button>
            </div>
          ))}
        </div>
        <div class="content">
          <input class="title-input" placeholder="title" />
          <input class="description-input" placeholder="description" />
          <textarea class="content-input" />
          <button class="save">save</button>
        </div>
      </div>
    </Layout>
  );
}

export function AdminPoemPage(poems: Poem[]) {
  return (
    <Layout isAdmin={true}>
      <a id="title" href="/">Decompressed Poems</a>
      <nav>
        <a href="/admin/posts.html">posts</a>
        <a href="/admin/poems.html">poems</a>
      </nav>
      <div id="dashboard-poem">
        <div class="new">
          <textarea class="input" />
          <button class="save">save</button>
        </div>
        <div class="list">
          {poems.map((poem) => (
            <div class="controls">
              <div class="content">{poem.content}</div>
              <button class="delete">delete</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
