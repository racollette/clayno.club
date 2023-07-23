import { useRouter } from "next/router";
import LoginModal from "./LoginModal";
import { useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const signedIn = status === "authenticated";

  return (
    <nav className="flex flex-row justify-between gap-2 bg-black p-3 align-middle">
      <div className="flex gap-4">
        <div
          className="mr-6 flex cursor-pointer self-center text-xl font-extrabold text-white"
          onClick={() => router.push(`/`)}
        >
          DinoHerd.cc
        </div>
        <div className="hidden self-center md:block">
          <div
            className="flex cursor-pointer text-zinc-500"
            onClick={() => router.push(`/`)}
          >
            Gallery
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <LoginModal />
      </div>
    </nav>
  );
}
