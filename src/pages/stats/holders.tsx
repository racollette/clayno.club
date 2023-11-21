import Head from "next/head";
import HoldersDataTable from "~/components/HoldersDataTable";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";

const Holders = () => {
  const { data: holders, isLoading } = api.stats.getDinoHolders.useQuery();

  console.log(holders);

  return (
    <>
      <Head>
        <title>DinoHerd | Holders</title>
      </Head>
      <Layout>
        <section className="flex w-full flex-col items-center justify-center gap-12 overflow-hidden py-4 md:px-4 md:py-8">
          {!isLoading && <HoldersDataTable data={holders} />}
        </section>
      </Layout>
    </>
  );
};

export default Holders;
