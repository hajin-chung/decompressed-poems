import { formatDate } from "@/utils/formatDate";
import { PostInfo } from "@/utils/types";
import Link from "next/link";
import { FC } from "react";

export const PostCard: FC<PostInfo> = ({ id, title, created }) => {
  return (
    <Link
      className="group flex items-center rounded-lg bg-black bg-opacity-5 p-4 dark:bg-white dark:bg-opacity-5"
      href={`/post/${id}`}
    >
      <p className="text-xl font-bold  transition-all group-hover:text-2xl group-hover:text-sky-500">
        {title}
      </p>
      <p className="ml-auto text-sm font-semibold ">{formatDate(created)}</p>
    </Link>
  );
};
