import Layout from "~/components/Layout";
import Head from "next/head";
import { MoldedMeter } from "~/components/MoldedMeter";
import { ClassCounter } from "~/components/ClassCounter";
import { MakerMeter } from "~/components/MakerMeter";

export default function StatsPage() {
  return (
    <>
      <Head>
        <title>DinoHerd | Stats</title>
      </Head>
      <Layout>
        <section className="flex w-full flex-col items-center justify-center gap-8 py-4 md:items-start md:px-4 md:py-8">
          <ClassCounter />
          <MoldedMeter />
          <MakerMeter />
        </section>
      </Layout>
    </>
  );
}
