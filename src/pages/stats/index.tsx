import Layout from "~/components/Layout";
import MoldedMeter from "../../components/stats/MoldedMeter";
import ClassCounter from "../../components/stats/ClassCounter";
import MakerMeter from "../../components/stats/MakerMeter";
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

  const tab = searchParams.get("tab") || "summary";

  return (
    <>
      <MetaTags title="DinoHerd | Stats" />
      <Layout>
        <section className="flex w-full flex-col items-center">
          <Tabs
            defaultValue="summary"
            value={tab}
            className="flex w-full flex-col items-center gap-2 md:gap-4"
          >
            <TabsList className="flex flex-row items-center justify-center bg-neutral-800 font-clayno text-white md:gap-4">
              <TabsTrigger
                value="summary"
                className="md:text-md w-1/3 rounded-lg px-6 text-sm md:px-10"
              >
                <Link href={`?tab=summary`} scroll={false}>
                  Summary
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="dinos"
                className="md:text-md w-1/3 rounded-lg px-6 text-sm md:px-10"
              >
                <Link href={`?tab=dinos`} scroll={false}>
                  Dinos
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="clay"
                className="md:text-md w-1/3 rounded-lg px-6 text-sm md:px-10"
              >
                <Link href={`?tab=clay`} scroll={false}>
                  Clay
                </Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="summary"
              className="flex w-full flex-col gap-12 md:items-start"
            >
              <ClassCounter />
              <MoldedMeter />
              <MakerMeter />
            </TabsContent>
            <TabsContent value="dinos" className="w-full">
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
