import Layout from "~/components/Layout";
import Head from "next/head";
import { MoldedMeter } from "~/components/MoldedMeter";
import { ClassCounter } from "~/components/ClassCounter";
import { MakerMeter } from "~/components/MakerMeter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/@/components/ui/tabs";
import Holders from "./holders";

export default function StatsPage() {
  return (
    <>
      <Head>
        <title>DinoHerd | Stats</title>
      </Head>
      <Layout>
        <section className="flex w-full flex-col items-center overflow-hidden py-4 md:px-4 md:py-8">
          <Tabs
            defaultValue="resources"
            className="flex w-full flex-col items-center gap-4"
          >
            <TabsList className="flex flex-row items-center justify-center gap-8 bg-neutral-800 font-clayno text-white">
              <TabsTrigger
                value="resources"
                className="rounded-lg px-10 text-lg"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger value="holders" className="rounded-lg px-10 text-lg">
                Holders
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="resources"
              className="flex w-full flex-col gap-12 md:items-start"
            >
              <ClassCounter />
              <MoldedMeter />
              <MakerMeter />
            </TabsContent>
            <TabsContent value="holders">
              <Holders />
            </TabsContent>
          </Tabs>
        </section>
      </Layout>
    </>
  );
}
