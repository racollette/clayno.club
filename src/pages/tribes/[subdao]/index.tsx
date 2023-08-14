import Image from "next/image";
import Layout from "~/components/Layout";
import { Member } from "~/components/Member";
import { useRouter } from "next/router";
import { getQueryString } from "~/utils/routes";
import Link from "next/link";
import { getTraitBadgeColor } from "~/utils/colors";
import { groupAndFilter } from "~/utils/subdaos";

export default function SubDAO() {
  const router = useRouter();
  const { subdao } = router.query;
  const acronym = getQueryString(subdao);
  const { data, isLoading, sortedMap } = groupAndFilter(acronym);

  return (
    <Layout>
      <div className="flex flex-col justify-center gap-8 align-middle">
        {!isLoading && data ? (
          <>
            <div className="relative aspect-[3/1] overflow-clip rounded-lg md:mx-8">
              {data.banner_url && (
                <Image
                  src={data.banner_url}
                  alt={data?.name}
                  className="object-contain"
                  fill
                />
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
            <div className="md:mx-8">
              <div className="p-1 text-2xl font-extrabold">{data?.name}</div>
              <div className="text-wrap text-md p-1 text-left text-zinc-400">
                {data?.description}
              </div>
              {data.requirements && (
                <div className="my-2 inline-block rounded-lg bg-stone-800 p-1">
                  <div className="text-wrap p-2 text-center text-xs font-bold">
                    Eligibility
                  </div>
                  <div className="flex flex-row gap-2 p-2">
                    {data.requirements.split("_").map((requirement: any) => (
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
            </div>

            <div className="grid grid-cols-2 justify-center gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {!isLoading &&
                sortedMap &&
                Array.from(sortedMap.entries()).map(([owner, dinos]) => (
                  <Member
                    key={owner}
                    owner={owner}
                    dinos={dinos}
                    acronym={getQueryString(subdao)}
                  />
                ))}
              <div className="flex"></div>
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
