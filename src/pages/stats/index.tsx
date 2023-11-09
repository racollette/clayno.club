import Layout from "~/components/Layout";
import Head from "next/head";
import { MoldedMeter } from "~/components/MoldedMeter";
import { ClassCounter } from "~/components/ClassCounter";

export default function StatsPage() {
  return (
    <>
      <Head>
        <title>DinoHerd | Stats</title>
      </Head>
      <Layout>
        <section className="flex w-full flex-col items-center justify-center gap-8 py-4 md:items-start md:px-4 md:py-8">
          <MoldedMeter />
          <ClassCounter />
        </section>
      </Layout>
    </>
  );
}
