import Link from "next/link";

export const NewsTicker = () => {
  return (
    <div className="h-10 w-screen overflow-hidden bg-fuchsia-700 text-white">
      <div className="flex h-full flex-row items-center justify-center">
        <p className="animate-ticker-mobile whitespace-nowrap text-sm font-semibold md:animate-ticker">
          The Apres Winter Olympics are underway! Compete now at{" "}
          <Link href="https://olympics.clayno.club" className="text-cyan-400">
            olympics.clayno.club
          </Link>
          !
        </p>
      </div>
    </div>
  );
};
