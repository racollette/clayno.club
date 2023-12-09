import Layout from "~/components/Layout";
import MetaTags from "~/components/MetaTags";
import { api } from "~/utils/api";
import { Tweet } from "react-tweet";

const CATEGORIES = ["bullish", "guides", "opinions"];

const Threads = () => {
  const threadCategories = api.useQueries((t) =>
    CATEGORIES.map((category) =>
      t.resources.getAllThreads({ categoryId: category })
    )
  );

  return (
    <>
      <MetaTags title="DinoHerd | Fusion" />
      <Layout>
        <section className="flex flex-row justify-between gap-x-16">
          <div className="flex flex-col items-center">
            <h1 className="font-clayno text-xl">Why Bullish?</h1>
            {threadCategories[0]?.data?.map((thread) => (
              <div key={thread.id}>
                <Tweet id={thread.tweetId} />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-clayno text-xl">Guides</h1>
            {threadCategories[1]?.data?.map((thread) => (
              <div key={thread.id}>
                <Tweet id={thread.tweetId} />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-clayno text-xl">Opinions</h1>
            {threadCategories[2]?.data?.map((thread) => (
              <div key={thread.id}>
                <Tweet id={thread.tweetId} />
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Threads;
