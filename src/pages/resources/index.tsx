import Link from "next/link";
import Layout from "~/components/Layout";
import MetaTags from "~/components/MetaTags";

const Resources = () => {
  return (
    <>
      <MetaTags title="DinoHerd | Resources" />
      <Layout>
        <section className="flex flex-col items-center justify-center gap-y-8 p-2 md:container">
          <div className="font-clayno text-3xl">Resources</div>
          <div className="flex w-full flex-row justify-center gap-4">
            <Link
              className="min-w-2xl flex aspect-square cursor-pointer flex-col items-center justify-center gap-4 rounded-lg p-4 hover:animate-wiggle md:w-1/4"
              style={{
                background: `url('/images/threads.jpeg')`,
                backgroundSize: `cover`,
              }}
              href={`/resources/threads`}
            >
              <h2 className="text-md rounded-md bg-black px-4 py-2 font-clayno md:text-lg">
                Threads
              </h2>
              <p className="md:text-md rounded-md bg-black px-4 py-2 text-center font-clayno text-sm">
                Explore the best X threads on Claynos!
              </p>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Resources;
