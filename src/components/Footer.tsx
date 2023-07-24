import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center bg-black pb-6 text-center text-lg text-white">
      <span className="flex flex-row gap-2">
        <span>Made with</span>
        <Image src="/icons/heart.svg" alt="Love" width={20} height={20} />
        <span>by</span>
        <Link
          href={`https://twitter.com/AlphaDecay235`}
          className="text-sky-500"
          target="_blank"
        >
          <span>@AlphaDecay235</span>
        </Link>
      </span>
    </footer>
  );
}
