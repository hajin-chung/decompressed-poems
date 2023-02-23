import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <div className="flex w-full flex-wrap items-end py-4">
      <Link
        href="/"
        className="flex gap-2 text-lg font-extrabold tracking-tight hover:text-sky-500"
      >
        <div className="relative h-7 w-7">
          <Image src="/favicon.svg" fill alt="f" />
        </div>
        Decompressed Poems
      </Link>
      <div className="ml-auto flex flex-wrap gap-10 font-semibold">
        <Link href="/" className="hover:text-sky-500">
          posts
        </Link>
        <Link href="/post/about" className="hover:text-sky-500">
          about
        </Link>
      </div>
    </div>
  );
};
