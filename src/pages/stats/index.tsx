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
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MetaTags from "~/components/MetaTags";
import ClayHolders from "./clayHolders";

export default function StatsPage() {
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "resources";

  return (
    <>
      <MetaTags title="DinoHerd | Stats" />
      <Layout>
        <section className="flex w-full flex-col items-center">
          <Tabs
            defaultValue="resources"
            value={tab}
            className="flex w-full flex-col items-center gap-4"
          >
            <TabsList className="flex flex-row items-center justify-center gap-8 bg-neutral-800 font-clayno text-white">
              <TabsTrigger
                value="resources"
                className="rounded-lg px-10 text-lg"
              >
                <Link href={`?tab=resources`} scroll={false}>
                  Summary
                </Link>
              </TabsTrigger>
              <TabsTrigger value="holders" className="rounded-lg px-10 text-lg">
                <Link href={`?tab=holders`} scroll={false}>
                  Holders
                </Link>
              </TabsTrigger>
              <TabsTrigger value="clay" className="rounded-lg px-10 text-lg">
                <Link href={`?tab=clay`} scroll={false}>
                  Clay
                </Link>
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
            <TabsContent value="holders" className="w-full">
              <Holders />
            </TabsContent>
            <TabsContent value="clay" className="w-full">
              <ClayHolders />
            </TabsContent>
          </Tabs>
        </section>
      </Layout>
    </>
  );
}
