import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Image from "next/image";
import DataTable from "../../components/tribes/DataTable";
import MetaTags from "~/components/MetaTags";

export default function TribesPage() {
  const { data, isLoading } = api.subdao.getAllSubDAOs.useQuery();

  return (
    <>
      <MetaTags
        title="Claynosaurz Tribes | Clayno Club"
        description="Tribes are subcommunities within the world of Claynotopia. Learn more about the Crimson Clan, Clayno Capital and more!"
      />
      <Layout>
        {/* Hero Section */}
        <section className="container mx-auto px-4 pb-4 pt-8">
          <div className="relative rounded-xl bg-[#1a1a1a] p-8 shadow-lg ring-1 ring-white/5">
            <Image
              src="/images/clayno_bg.svg"
              alt=""
              fill
              className="absolute inset-0 rounded-xl object-cover opacity-[0.35]"
            />
            <div className="relative">
              <h1 className="mb-2 font-clayno text-3xl text-white md:text-4xl lg:text-5xl">
                Tribes
              </h1>
              <p className="max-w-2xl text-base font-semibold text-white/90 md:text-lg">
                Discover unique subcommunities within the Claynosaurz ecosystem.
                Each tribe brings its own culture, values, and perks to its
                members.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-[#1a1a1a] p-6 shadow-lg ring-1 ring-white/5">
              <h3 className="text-sm font-semibold uppercase text-gray-400">
                Total Tribes
              </h3>
              <p className="text-3xl font-bold text-white">
                {data?.length ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-[#1a1a1a] p-6 shadow-lg ring-1 ring-white/5">
              <h3 className="text-sm font-semibold uppercase text-gray-400">
                Active Members
              </h3>
              <p className="text-3xl font-bold text-white">
                {data?.reduce(
                  (acc, tribe) => acc + (tribe.verifiedAddresses ?? 0),
                  0
                )}
              </p>
            </div>
            <div className="rounded-xl bg-[#1a1a1a] p-6 shadow-lg ring-1 ring-white/5">
              <h3 className="text-sm font-semibold uppercase text-gray-400">
                Access Types
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {data && (
                  <>
                    <span className="rounded-md bg-cyan-500/20 px-2 py-1 text-sm text-cyan-300">
                      {
                        data.filter(
                          (tribe) => tribe.accessType === "BOT_MANAGED"
                        ).length
                      }{" "}
                      Bot Managed
                    </span>
                    <span className="rounded-md bg-yellow-500/20 px-2 py-1 text-sm text-yellow-300">
                      {
                        data.filter((tribe) => tribe.accessType === "VOTE_IN")
                          .length
                      }{" "}
                      Vote-in
                    </span>
                    <span className="rounded-md bg-red-500/20 px-2 py-1 text-sm text-red-300">
                      {
                        data.filter((tribe) => tribe.accessType === "CLOSED")
                          .length
                      }{" "}
                      Closed
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tribes Table */}
        <section className="container mx-auto px-4 pb-24">
          <div className="rounded-xl bg-black/20 p-4 backdrop-blur-sm">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
              </div>
            ) : data ? (
              <DataTable data={data} />
            ) : null}
          </div>
        </section>
      </Layout>
    </>
  );
}
