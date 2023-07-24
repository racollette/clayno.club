import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";

export default function SubDAO() {
  const { data: RLG, isLoading } = api.dao.getSubDAO.useQuery({
    name: "Red Lip Gang",
  });

  console.log(RLG);

  return (
    <Layout>
      <div className="flex flex-1 flex-wrap md:w-4/5">
        {!isLoading &&
          RLG?.dinos.map((dino) => (
            <div key={dino.mint} className="flex gap-2">
              <div className="relative m-0.5 h-40 w-40 overflow-clip rounded-md md:h-48 md:w-48">
                <Image
                  src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                  alt={dino.name}
                  quality={100}
                  fill
                />
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
}
