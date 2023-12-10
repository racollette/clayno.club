import { useRouter } from "next/router";
import LoginModal from "./LoginModal";
import { Navbar } from "flowbite-react";
import VoterInfo from "./herds/VoterInfo";

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
          className="text-md cursor-pointer self-center whitespace-nowrap px-2 font-claynoShadow hover:animate-wiggle dark:text-white md:text-xl"
          onClick={() => router.push(`/`)}
        >
          DinoHerd.cc
        </span>
      </Navbar.Brand>
      <div className="flex gap-2 md:order-2">
        {/* {isHerdsPage && <VoterInfo />} */}
        <VoterInfo />
        <LoginModal />
        <Navbar.Toggle className="bg-transparent text-white hover:bg-transparent focus:ring-zinc-500" />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          className="text-md cursor-pointer font-clayno text-white"
          href={`/herds`}
        >
          Herds
        </Navbar.Link>
        <Navbar.Link
          className="text-md cursor-pointer font-clayno text-white"
          href={`/tribes`}
        >
          Tribes
        </Navbar.Link>
        <Navbar.Link
          className="text-md cursor-pointer font-clayno text-white"
          href={`/stats`}
        >
          Stats
        </Navbar.Link>
        <Navbar.Link
          className="text-md cursor-pointer font-clayno text-white"
          href={`/tools`}
        >
          Tools
        </Navbar.Link>
        <Navbar.Link
          className="text-md cursor-pointer font-clayno text-white"
          href={`/resources`}
        >
          Resources
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
