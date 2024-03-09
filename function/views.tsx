/** @jsx h */
/** @jsxFrag Fragment */
import { h } from "jsx";

type LayoutProps = { children?: JSX.Element };

export function Layout({ children }: LayoutProps) {
  return (
    <html>
      <head>
        <title>Decompressed Poems</title>
      </head>
      <body>
        {...children}
      </body>
    </html>
  );
}

export function Test() {
  return <h1>hi</h1>;
}

export function Main() {
  return (
    <Layout>
      <Test />
    </Layout>
  );
}
