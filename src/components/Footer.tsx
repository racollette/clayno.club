import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center bg-black pb-6 text-center text-white md:text-lg">
      <span className="flex flex-row gap-2">
        <span className="self-center text-sm">Made with</span>
        <Image src="/icons/heart.svg" alt="Love" width={16} height={16} />
        <span className="self-center text-sm">by</span>
        <Link
          href={`https://twitter.com/AlphaDecay235`}
          className="self-center text-sky-500"
          target="_blank"
        >
          <span className="self-center text-sm">@AlphaDecay235</span>
        </Link>
      </span>
    </footer>
  );
}
