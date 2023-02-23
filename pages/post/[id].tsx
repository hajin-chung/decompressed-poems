import { getPost } from "@/utils/db";
import { Post } from "@/utils/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Layout } from "@/components/Layout";
import remarkGfm from "remark-gfm";

type Data = {
  post?: Post;
};

export const getServerSideProps: GetServerSideProps<Data> = async (ctx) => {
  const { id } = ctx.query;
  const post = await getPost(id as string);
  return {
    props: { post },
  };
};

export default function PostView({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (post === undefined) {
    return (
      <Layout>
        <div className="w-full text-2xl font-bold">404 Not Found</div>
      </Layout>
    );
  }

  const { id, title, content, created } = post;

  return (
    <Layout>
      <div className="flex w-full flex-col gap-1">
        <p className="text-2xl font-bold">{title}</p>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose prose-stone dark:prose-invert"
        >
          {content}
        </ReactMarkdown>
      </div>
    </Layout>
  );
}
