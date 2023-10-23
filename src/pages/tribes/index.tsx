import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Image from "next/image";
import Head from "next/head";
import DataTable from "~/components/DataTable";

export default function TribesPage() {
  const { data, isLoading } = api.subdao.getAllSubDAOs.useQuery();

  return (
    <>
      <Head>
        <title>DinoHerd | Tribes</title>
        <meta name="description" content="Claynosaurz Collectors Gallery" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section className="container relative m-4 aspect-[7/2] w-full overflow-clip">
          <Image
            src="/images/tribes_banner.png"
            alt="Tribes"
            fill
            quality={100}
            className="rounded-lg"
          />
          <div className="absolute left-0 top-0 h-full items-start justify-end md:flex md:w-1/3">
            <div className="m-2 flex max-w-lg flex-col gap-4 rounded-xl bg-black/70 p-2 px-4 text-white hover:bg-black/30 md:m-4 md:p-4 lg:p-6">
              <h2 className="text-md font-extrabold text-white md:text-2xl">
                <span className="text-[hsl(280,100%,70%)]">Tribes</span>
              </h2>
              <div className="md:text-md hidden text-sm md:block">
                <p className="text-md pb-2 font-semibold">
                  Tribes are SubDAOs (or Sub-Communities) within the world of
                  Claynotopia!
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-0 py-2 pb-24">
          {data ? <DataTable data={data} /> : null}
        </section>
      </Layout>
    </>
  );
}
