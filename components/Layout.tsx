import Head from "next/head";
import { FC } from "react";
import { Controls } from "./Controls";
import { Header } from "./Header";

type LayoutProps = {
  children?: React.ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="relative flex min-h-screen w-full justify-center bg-white text-black dark:bg-slate-900 dark:text-white">
      <Head>
        <title>Decompressed Poems: 압축해제된 시들</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className="mx-2 flex w-full flex-col md:max-w-3xl">
        <Header />
        {children}
      </div>
      <Controls />
    </main>
  );
};
