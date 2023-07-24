import { useRouter } from "next/router";
import LoginModal from "./LoginModal";
import { useSession } from "next-auth/react";
import { Navbar } from "flowbite-react";

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const signedIn = status === "authenticated";

  return (
    // <nav className="flex flex-row justify-between gap-2 bg-black p-3 align-middle">
    //   <div className="flex gap-4">
    //     <div
    //       className="mr-6 flex cursor-pointer self-center text-xl font-extrabold text-white"
    //       onClick={() => router.push(`/`)}
    //     >
    //       DinoHerd.cc
    //     </div>
    //     <div className="hidden flex-row self-center md:block">
    //       <div
    //         className="flex cursor-pointer text-zinc-500"
    //         onClick={() => router.push(`/`)}
    //       >
    //         Gallery
    //       </div>
    //       <div
    //         className="flex cursor-pointer text-zinc-500"
    //         onClick={() => router.push(`/dao`)}
    //       >
    //         DAOs
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex gap-2">
    //     <LoginModal />
    //   </div>
    // </nav>
    <Navbar className="bg-black text-white" fluid>
      <Navbar.Brand href="#">
        {/* <img
          alt="Flowbite React Logo"
          className="mr-3 h-6 sm:h-9"
          src="/favicon.svg"
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          DinoHerd.cc
        </span>
      </Navbar.Brand>
      <div className="flex gap-2 md:order-2">
        <LoginModal />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          className="text-md cursor-pointer text-zinc-500"
          onClick={() => router.push(`/`)}
        >
          Gallery
        </Navbar.Link>
        <Navbar.Link
          className="cursor-pointer text-zinc-500"
          onClick={() => router.push(`/dao`)}
        >
          DAOs
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
