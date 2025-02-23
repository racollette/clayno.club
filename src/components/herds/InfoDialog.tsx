import { HiX } from "react-icons/hi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/@/components/ui/dialog";
import { HiInformationCircle } from "react-icons/hi";

export default function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 rounded-md bg-neutral-800 p-2 text-sm font-medium text-white hover:bg-neutral-700">
          <HiInformationCircle size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="mx-auto max-w-[95%] rounded-lg border-none bg-neutral-900/95 p-4 backdrop-blur-md sm:max-w-[600px] sm:p-6">
        <DialogHeader className="relative">
          <DialogTitle className="self-start font-clayno text-2xl tracking-wide text-white sm:text-3xl">
            Understanding{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Herds
            </span>
          </DialogTitle>
          <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-neutral-100">
            <HiX className="h-5 w-5 text-neutral-300 sm:h-6 sm:w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="text-neutral-200">
          <div className="space-y-3 pt-2 sm:space-y-4">
            {/* Basic Description */}
            <div>
              <p className="mb-3 text-sm leading-relaxed text-neutral-200 sm:mb-4 sm:text-base">
                A herd is defined as one of each original Claynosaurz species:{" "}
                <span className="font-clayno tracking-wide text-neutral-300">
                  Rex, Raptor, Trice, Bronto, Stego,
                </span>{" "}
                and{" "}
                <span className="font-clayno tracking-wide text-neutral-300">
                  Ankylo
                </span>
                .
              </p>
              <p className="text-sm sm:text-base">
                Herds are ranked by how many matching traits they share, with
                additional bonuses for owning matching Sagas (
                <span className="font-clayno tracking-wide text-neutral-300">
                  Spino
                </span>{" "}
                and{" "}
                <span className="font-clayno tracking-wide text-neutral-300">
                  Para
                </span>{" "}
                ) or{" "}
                <span className="font-clayno tracking-wide text-neutral-300">
                  Dactyl.
                </span>
              </p>
            </div>

            {/* Base Herds */}
            <div>
              <h3 className="mb-2 font-clayno text-lg tracking-wide text-white sm:mb-3 sm:text-xl">
                Base Herds:
              </h3>
              <p className="mb-2 text-sm text-neutral-300 sm:text-base">
                There are three core traits: Skin, Color, and Background
              </p>
              <ul className="list-inside space-y-1 pl-3 text-sm sm:pl-4 sm:text-base">
                <li>
                  <span className="font-semibold">Basic</span>: Matching Skin OR
                  Color
                </li>
                <li>
                  <span className="font-semibold">Impressive</span>: Any 2
                  matching core traits
                </li>
                <li>
                  <span className="font-semibold">Flawless</span>: All 3 core
                  traits matching
                </li>
                <li>
                  <span className="font-semibold">Perfect</span>: All core
                  traits matching, plus either Belly ON or Pattern ON
                </li>
              </ul>
            </div>

            {/* Qualifiers */}
            <div>
              <h3 className="mb-2 font-clayno text-lg tracking-wide text-white sm:mb-3 sm:text-xl">
                Herd Qualifiers:
              </h3>
              <ul className="list-inside list-disc space-y-1 pl-3 text-sm sm:pl-4 sm:text-base">
                <li>
                  <span className="font-semibold">Mighty</span>: if you own 2
                  Sagas <span className="text-yellow-400">OR</span> 1 Dactyl
                </li>
                <li>
                  <span className="font-semibold">Legendary</span>: if you own 2
                  Sagas <span className="text-yellow-400">AND</span> 1 Dactyl
                </li>
              </ul>
            </div>

            {/* Example */}
            <div className="mt-2 rounded-lg bg-neutral-800/50 p-4 sm:p-6">
              <p className="mb-2 font-clayno text-xs text-neutral-300 sm:text-sm">
                Example
              </p>
              <p className="text-xs sm:text-sm">
                A{" "}
                <span className="font-clayno text-base tracking-wide text-yellow-400 sm:text-lg">
                  Mighty Flawless Herd
                </span>{" "}
                would have:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 pl-3 text-xs text-neutral-300 sm:pl-4 sm:text-sm">
                <li>
                  One of each OG species with matching Skin, Color, and
                  Background
                </li>
                <li>Plus either 2 Sagas or 1 Dactyl</li>
              </ul>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
