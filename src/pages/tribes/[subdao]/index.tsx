import Image from "next/image";
import Layout from "~/components/Layout";
import Member from "../../../components/tribes/Member";
import { useRouter } from "next/router";
import { getQueryString } from "~/utils/routes";
import Link from "next/link";
import { getTraitBadgeColor } from "~/utils/colors";
import { groupAndFilter } from "~/utils/subdaos";
import { Fragment, useState } from "react";
import { type Attributes, type Dino } from "@prisma/client";
import { useTimeSinceLastUpdate } from "~/hooks/useUpdated";
import MetaTags from "~/components/MetaTags";
import { HiRefresh } from "react-icons/hi";
import { api } from "~/utils/api";

export default function SubDAO() {
  const router = useRouter();
  const { subdao } = router.query;
  const acronym = getQueryString(subdao);
  const { data, isLoading, sortedMap } = groupAndFilter(acronym);
  const [fetchingAddressList, setFetchingAddressList] = useState(false);

  const lastUpdated = useTimeSinceLastUpdate("tribes");

  const { data: airdropList, refetch } = api.subdao.getVerifiedMembers.useQuery(
    {
      acronym,
    },
    { enabled: fetchingAddressList }
  );

  const handleDownloadAirdropList = async () => {
    setFetchingAddressList(true);

    await refetch();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const jsonContent = JSON.stringify(airdropList, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${acronym}AddressList.json`;

    document.body.appendChild(link);
    link.click();

    setFetchingAddressList(false);
    document.body.removeChild(link);
  };

  return (
    <>
      <MetaTags title={data?.name ?? `Clayno.club`} />
      <Layout>
        <div className="flex w-full flex-col justify-center gap-4 align-middle lg:w-full xl:w-11/12 2xl:w-10/12">
          {!isLoading && data ? (
            <>
              <div
                className={`relative aspect-[3/1] overflow-hidden rounded-lg md:mx-8`}
              >
                {data.banner_url && (
                  <div className="overflow-hidden">
                    <Image
                      src={data.banner_url}
                      alt={data?.name}
                      className="rounded-lg object-cover"
                      fill
                    />
                  </div>
                )}
                <div className="absolute bottom-2 left-4 flex flex-row gap-2">
                  {data.website && (
                    <Link
                      className="self-center rounded-md px-2 py-2 text-white hover:bg-white/10"
                      href={data.website}
                      target="_blank"
                    >
                      <Image
                        src="/icons/website.svg"
                        alt="Website"
                        width={20}
                        height={20}
                      />
                    </Link>
                  )}
                  {data.twitter && (
                    <Link
                      className="self-center rounded-md px-2 py-2 text-white hover:bg-white/10"
                      href={data.twitter}
                      target="_blank"
                    >
                      <Image
                        src="/icons/twitter.svg"
                        alt="Twitter"
                        width={20}
                        height={20}
                      />
                    </Link>
                  )}
                  {data.discord && (
                    <Link
                      className="self-center rounded-md px-2 py-2 text-white hover:bg-white/10"
                      href={data.discord}
                      target="_blank"
                    >
                      <Image
                        src="/icons/discord.svg"
                        alt="Discord"
                        width={20}
                        height={20}
                      />
                    </Link>
                  )}
                </div>
              </div>

              <section className="flex flex-col gap-4 md:mx-8">
                <div className="flex flex-row items-center gap-2">
                  <div className="relative aspect-square h-20">
                    <Image
                      src={data?.thumbnail}
                      alt=""
                      fill
                      quality={50}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="text-md p-1 font-extrabold md:text-xl">
                      {data?.name}
                    </div>
                    <div className="text-wrap md:text-md p-1 text-left text-sm text-zinc-400">
                      {data?.description}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row flex-wrap gap-2 md:gap-4">
                  <div className="flex flex-row items-center justify-start gap-x-6 rounded-lg bg-neutral-800 px-4 py-2">
                    <div className="flex flex-col">
                      <div className="text-md font-bold">
                        {data?.uniqueAddresses}
                      </div>
                      <div className="text-xs uppercase text-neutral-500">
                        Addresses
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-md font-bold">
                        {`${data.verifiedAddresses}`}
                        <span className="ml-2 font-bold">
                          {`(${(
                            (data?.verifiedAddresses / data?.uniqueAddresses) *
                            100
                          ).toFixed(1)}%)`}
                        </span>
                      </div>
                      <div className="text-xs uppercase text-neutral-500">
                        Verified
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-md font-bold">
                        {data?.qualifyingCount}
                      </div>
                      <div className="text-xs uppercase text-neutral-500">
                        Total Dinos
                      </div>
                    </div>
                  </div>
                  {data.requirements && (
                    <div className="inline-block rounded-lg bg-neutral-800 p-1">
                      <div className="flex flex-row gap-2 p-2">
                        <div className="text-wrap p-2 text-left text-xs uppercase text-neutral-500">
                          Eligibility
                        </div>
                        {data.requirements
                          .split("_")
                          .map((requirement: any) => (
                            <div
                              key={requirement}
                              className={`rounded-md px-2 py-1 text-sm font-semibold ${getTraitBadgeColor(
                                requirement
                              )}`}
                            >
                              {requirement}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {lastUpdated && (
                    <div className="flex flex-row flex-wrap md:gap-4">
                      <div className="flex flex-row items-center justify-start gap-x-6 rounded-lg bg-neutral-800 px-4 py-2">
                        <div className="flex flex-col">
                          <div className="text-md font-bold">{lastUpdated}</div>
                          <div className="text-xs uppercase text-neutral-500">
                            Last Updated
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {acronym === "cc" && (
                    <>
                      {!fetchingAddressList ? (
                        <button
                          className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold uppercase hover:bg-emerald-600"
                          onClick={() => handleDownloadAirdropList()}
                        >
                          Airdrop List
                        </button>
                      ) : (
                        <button
                          className="flex flex-row items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold uppercase"
                          onClick={() => handleDownloadAirdropList()}
                        >
                          <HiRefresh
                            size={20}
                            className="inline-block animate-spin"
                          />
                          Generating
                        </button>
                      )}
                    </>
                  )}
                </div>
              </section>

              <div className="mt-4 grid grid-cols-2 justify-center gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {!isLoading && sortedMap && (
                  <>
                    {!data.grouping ? (
                      <>
                        {Array.from(sortedMap.entries()).map(
                          ([owner, data]) => (
                            <Fragment key={owner}>
                              {data.dinos.map(
                                (
                                  dino: Dino & { attributes: Attributes },
                                  index: number
                                ) => (
                                  <Member
                                    key={`${owner}_${index}`} // Use a unique key for each dino
                                    owner={owner}
                                    data={{ dinos: [dino], user: data.user }}
                                    acronym={getQueryString(subdao)}
                                  />
                                )
                              )}
                            </Fragment>
                          )
                        )}
                      </>
                    ) : (
                      <>
                        {Array.from(sortedMap.entries()).map(
                          ([owner, data]) => (
                            <Member
                              key={owner}
                              owner={owner}
                              data={data}
                              acronym={getQueryString(subdao)}
                            />
                          )
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          ) : null}
        </div>
      </Layout>
    </>
  );
}
