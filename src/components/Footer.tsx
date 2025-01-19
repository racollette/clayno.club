import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center bg-transparent p-3 text-center text-white md:text-lg">
      <div className="flex items-center justify-center">
        <span className="text-sm">
          A{" "}
          <Link
            href={`https://clayno.capital`}
            className="text-sm text-sky-500"
            target="_blank"
          >
            Clayno Capital
          </Link>{" "}
          Product
        </span>
        {/* <Image src="/icons/heart.svg" alt="Love" width={16} height={16} /> */}
      </div>
    </footer>
  );
}
