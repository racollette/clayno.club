import Link from "next/link";
import Image from "next/image";
import Layout from "~/components/Layout";
import MetaTags from "~/components/MetaTags";
import { motion } from "framer-motion";
import { FaQuestion } from "react-icons/fa";

export default function ToolsPage() {
  return (
    <>
      <MetaTags
        title="Community Tools | Clayno Club"
        description="Discover our suite of community tools for Claynosaurz collectors. Create collages, get notifications, track sales, and more!"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center font-clayno text-4xl md:text-5xl"
          >
            Community Tools
          </motion.h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Fusion Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-900"
            >
              <Link href="/tools/fusion" className="block h-full w-full">
                <Image
                  src="/images/sticker_collage.png"
                  fill
                  alt="Fusion Tool"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <h2 className="mb-3 font-clayno text-3xl">Fusion</h2>
                  <p className="text-lg font-medium text-neutral-300">
                    Create videos collages of your Claynosaurz collection.
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Telegram Bot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-900"
            >
              <div className="relative h-full">
                <Link
                  href="https://t.me/ClaynoClubBot"
                  target="_blank"
                  className="block h-full w-full"
                >
                  <Image
                    src="/images/og_club.jpg"
                    fill
                    alt="Telegram Bot"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <h2 className="mb-3 font-clayno text-3xl">Telegram Bot</h2>
                    <p className="mb-4 text-lg font-medium text-neutral-300">
                      Automated token gating for tribes, custom listing
                      notifications, sales feeds, and community stats.
                    </p>
                    <Link
                      href="/resources/telegramBot"
                      className="flex items-center justify-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      <span>View Setup Guide</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </Link>
                <Link
                  href="/resources/telegramBot"
                  className="absolute right-4 top-4 flex items-center justify-center rounded-lg bg-black/50 p-2 backdrop-blur-sm transition-transform hover:scale-105"
                >
                  <div className="text-pink-500">
                    <FaQuestion size={16} />
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Twitter Bot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-900"
            >
              <Link
                href="https://x.com/ClaynoClubBot"
                target="_blank"
                className="block h-full w-full"
              >
                <Image
                  src="/images/attic.png"
                  fill
                  alt="Twitter Bot"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <h2 className="mb-3 font-clayno text-3xl">Sales Bot</h2>
                  <p className="text-lg font-medium text-neutral-300">
                    Follow sales activity on X.
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
