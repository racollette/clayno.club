import { useRouter } from "next/router";
import LoginModal from "./LoginModal";
import { Navbar } from "flowbite-react";

export default function Header() {
  const router = useRouter();

  return (
    <Navbar className="bg-black text-white" fluid>
      <Navbar.Brand>
        {/* <img
          alt="Flowbite React Logo"
          className="mr-3 h-6 sm:h-9"
          src="/favicon.svg"
        /> */}
        <span
          className="cursor-pointer self-center whitespace-nowrap px-2 text-xl font-semibold dark:text-white"
          onClick={() => router.push(`/`)}
        >
          DinoHerd.cc
        </span>
      </Navbar.Brand>
      <div className="flex gap-2 md:order-2">
        <LoginModal />
        <Navbar.Toggle className="bg-transparent text-zinc-500 hover:bg-transparent hover:text-white focus:ring-zinc-500" />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          className="text-md cursor-pointer text-zinc-500 hover:bg-zinc-800 hover:text-white"
          href={`/`}
        >
          Herds
        </Navbar.Link>
        <Navbar.Link
          className="text-md cursor-pointer text-zinc-500 hover:bg-zinc-800 hover:text-white"
          href={`/tribes`}
        >
          Tribes
        </Navbar.Link>
        <Navbar.Link
          className="text-md cursor-pointer text-zinc-500 hover:bg-zinc-800 hover:text-white"
          href={`/fuser`}
        >
          Fuser
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
