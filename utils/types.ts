export type PostInfo = {
  id: string;
  title: string;
  created: string;
}

export type Post = PostInfo & {
  content: string;
};
