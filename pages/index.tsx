import { getPosts } from "@/utils/db";
import { PostInfo } from "@/utils/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/post/Card";

type Data = {
  posts: PostInfo[];
};

export const getServerSideProps: GetServerSideProps<Data> = async () => {
  const posts = await getPosts();
  return { props: { posts } };
};

export default function Home({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="mt-4 flex flex-col gap-6">
        {posts.map((info) => (
          <PostCard key={info.id} {...info} />
        ))}
      </div>
    </Layout>
  );
}
