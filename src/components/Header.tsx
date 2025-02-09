import { useRouter } from "next/router";
import LoginModal from "./LoginModal";
import { Navbar } from "flowbite-react";
import Image from "next/image";
import { NewsTicker } from "./attention/NewsTicker";
import { OLYMPICS_ONGOING } from "~/utils/constants";

export default function Header() {
  const router = useRouter();
  const isHerdsPage = router.pathname === "/herds";

  return (
    <>
      {OLYMPICS_ONGOING && <NewsTicker />}
      <Navbar className="bg-transparent text-white" fluid>
        <Navbar.Brand>
          {/* <img
          alt="Flowbite React Logo"
          className="mr-3 h-6 sm:h-9"
          src="/favicon.svg"
        /> */}
          <span
            className="text-md flex cursor-pointer flex-row items-center gap-2 self-center whitespace-nowrap px-2 font-clayno hover:animate-wiggle dark:text-white md:text-xl"
            onClick={() => router.push(`/`)}
          >
            <Image
              src="/icons/dactyl_colored.svg"
              width="40"
              height="40"
              alt="Clayno.club"
              className="hidden hover:animate-wiggle md:block"
            />
            <p>Clayno.club</p>
          </span>
        </Navbar.Brand>
        <div className="flex gap-2 md:order-2">
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
    </>
  );
}
