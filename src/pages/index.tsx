import { useRef } from "react";
import Link from "next/link";
import Metatags from "~/components/MetaTags";
import Image from "next/image";
import { useUser } from "~/hooks/useUser";
import { motion } from "framer-motion";
import { extractProfileFromUser } from "~/utils/wallet";
// import { EventAlert } from "~/components/attention/EventAlert";
// import { OLYMPICS_ONGOING } from "~/utils/constants";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Home() {
  const { user } = useUser();
  const { username } = extractProfileFromUser(user);
  const browseSectionRef = useRef<HTMLElement | null>(null);

  const scrollToBrowse = () => {
    if (browseSectionRef.current) {
      browseSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Metatags
        title="Clayno Club | Your portal to Claynotopia 🌋"
        description="Clayno Club is a fan-curated portal for Claynosaurz collectors. Discover the collections, herds, tribes, and lore that define Claynotopia!"
      />
      <main className="relative text-white">
        {/* {OLYMPICS_ONGOING && <EventAlert />} */}

        <div className="relative flex flex-col gap-12 p-4 pb-16 md:container">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="relative flex min-h-screen flex-col-reverse items-center justify-center gap-6 px-4 py-12 md:flex-row md:gap-12"
          >
            <div className="fixed inset-0 -z-10">
              <Image
                src="/images/rawrmap.png"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                alt="Background Map"
                priority
                className="opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-black/80" />
            </div>
            <div className="flex w-full max-w-xl flex-col gap-8">
              <div className="flex flex-col gap-6">
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex flex-row items-center gap-3"
                >
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                      rotate: [0, -3, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/icons/dactyl_colored.svg"
                      width="52"
                      height="52"
                      alt="Clayno.club"
                      className="hover:animate-wiggle"
                    />
                  </motion.div>
                  <motion.h2
                    className="font-clayno text-3xl"
                    animate={{
                      y: [0, -2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  >
                    Clayno.club
                  </motion.h2>
                </motion.div>
                <div className="flex flex-col gap-4">
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="relative font-clayno text-3xl font-bold md:text-5xl"
                  >
                    Your Gateway{" "}
                    <span className="relative inline-block">
                      to Claynotopia
                      <motion.span
                        className="absolute -inset-1 -z-10 block rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-sm"
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </span>
                  </motion.h1>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="max-w-md text-lg text-neutral-300"
                  >
                    Discover the collections, herds, tribes, and lore that
                    define the world of Claynosaurz! A fan-curated resource by{" "}
                    <Link
                      className="text-cyan-500 hover:text-cyan-400"
                      href="https://clayno.capital"
                      target="_blank"
                    >
                      Clayno Capital
                    </Link>
                    .
                  </motion.p>
                </div>
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex max-w-md flex-col gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/welcome"
                    className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 px-8 py-4 text-lg font-medium shadow-lg transition-all before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-600 before:via-cyan-700 before:to-cyan-800 before:opacity-0 before:transition-opacity hover:before:opacity-100"
                  >
                    <span className="relative z-10 font-clayno font-bold">
                      Start Your Journey
                    </span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 12, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    >
                      <FaLongArrowAltRight className="h-6 w-6" />
                    </motion.span>
                  </Link>
                </motion.div>

                <div className="flex flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full overflow-hidden rounded-lg  bg-neutral-900 px-8 py-3 font-medium transition-all hover:bg-neutral-800"
                    onClick={scrollToBrowse}
                  >
                    <span className="relative z-10 font-clayno font-bold">
                      Explore
                    </span>
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={username ? `/inventory/${username}` : `/inventory`}
                      className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-900 px-8 py-3 font-medium transition-all hover:bg-neutral-800"
                    >
                      <span className="relative z-10 font-clayno font-bold">
                        Inventory
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  },
                },
              }}
              className="relative aspect-square w-full max-w-[450px] overflow-hidden rounded-3xl md:w-1/2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Image
                src="/images/claynotopia.png"
                fill
                style={{ objectFit: "cover" }}
                alt="Claynotopia"
                priority
                className="rounded-3xl"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.section>

          {/* <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-12 rounded-xl py-8"
          >
            <div className="flex w-full flex-col gap-8 md:mx-auto md:max-w-5xl">
              <motion.div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900">
                <Image
                  src="/images/rawrmap.png"
                  fill
                  alt="Claynosaurz Map"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="mb-3 text-2xl font-bold text-white">
                    Community First
                  </h3>
                  <p className="text-lg text-white/90">
                    Join a vibrant community of collectors and enthusiasts
                    sharing their passion for Claynosaurz.
                  </p>
                </div>
              </motion.div>

              <motion.div className="group relative aspect-[1.3] w-full overflow-hidden rounded-2xl bg-neutral-900">
                <Image
                  src="/images/collectibles_community.avif"
                  fill
                  alt="Collectibles Community"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="mb-3 text-2xl font-bold text-white">
                    Discover & Collect
                  </h3>
                  <p className="text-lg text-white/90">
                    Explore unique collectibles and learn about the rich lore of
                    Claynotopia.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section> */}

          <section
            className="relative flex flex-col items-center overflow-hidden font-clayno"
            ref={browseSectionRef}
          >
            <div className="flex w-full flex-col items-center justify-around gap-8 rounded-xl py-8 md:gap-8 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                className="font-clayno text-2xl"
              >
                Browse
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
                className="flex w-full flex-col items-center justify-center gap-10 md:flex-row"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    className="flex aspect-square w-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 p-8 text-center text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[400px]"
                    style={{
                      backgroundImage: `url('/images/trailer_herd.jpeg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    href={`/herds`}
                  >
                    <h1 className="rounded-lg bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                      Herds
                    </h1>
                    <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                      Collectors gallery
                    </h2>
                  </Link>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    className="flex aspect-square w-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 p-8 text-center text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[400px]"
                    style={{
                      backgroundImage: `url('/images/SMALLER_FJORD_CLAYNOS.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    href={`/tribes`}
                  >
                    <h1 className="rounded-lg bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                      Tribes
                    </h1>
                    <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                      {`Claynotopia's sub-communities!`}
                    </h2>
                  </Link>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    className="flex aspect-square w-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 p-8 text-center text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[400px]"
                    style={{
                      backgroundImage: `url('/gifs/GIF_RaptorThinking.gif')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    href={`/stats`}
                  >
                    <h1 className="rounded-lg bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                      Stats
                    </h1>
                    <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                      Data and analytics
                    </h2>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
                className="flex w-full flex-col items-center justify-center gap-10 md:flex-row"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    className="flex aspect-square w-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 p-8 text-center text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[400px]"
                    style={{
                      backgroundImage: `url('/images/limited_claymaker.gif')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    href={`/tools`}
                  >
                    <h1 className="rounded-lg bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                      Tools
                    </h1>
                    <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                      Collage creation and more!
                    </h2>
                  </Link>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    className="flex aspect-square w-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-neutral-800 p-8 text-center text-white shadow-2xl shadow-neutral-900 hover:animate-wiggle md:w-[400px]"
                    style={{
                      backgroundImage: `url('/images/attic.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    href={`/resources`}
                  >
                    <h1 className="rounded-lg bg-neutral-900/70 p-2 text-2xl font-black lg:text-3xl">
                      Resources
                    </h1>
                    <h2 className="lg:text-md rounded-lg bg-neutral-900/70 p-2 text-sm font-semibold text-white">
                      Useful links and information
                    </h2>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
