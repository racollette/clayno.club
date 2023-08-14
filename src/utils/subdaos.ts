import { api } from "./api";

export const groupAndFilter = (acronym: string) => {
  const { data, isLoading } = api.subdao.getSubDAO.useQuery({
    acronym: acronym,
  });
  const { data: users } = api.binding.getAllUsers.useQuery();

  if (data?.type === "Quantity") {
    return processQuantityTypeData(data, isLoading, users);
  } else {
    return processTraitAndSpeciesData(data, isLoading, users);
  }
};

function processQuantityTypeData(data: any, isLoading: boolean, users: any) {
  const sagaFiltered = data.holders.reduce((quantityMap: any, holder: any) => {
    const key = holder.owner || "unowned";
    const dinos = quantityMap.get(key) || [];
    holder.mints.forEach((dino: any) => {
      if (
        dino.attributes?.species !== "Para" &&
        dino.attributes?.species !== "Spino"
      ) {
        dinos.push(dino);
      }
    });
    quantityMap.set(key, dinos);
    return quantityMap;
  }, new Map());

  const sortedGroupedDinos = new Map(sortByAmount(sagaFiltered));

  return {
    data: data,
    isLoading: isLoading,
    sortedMap: processDinosMap(sortedGroupedDinos, users),
  };
}

function processTraitAndSpeciesData(data: any, isLoading: boolean, users: any) {
  const groupedDinos = data?.dinos.reduce((groupsMap: any, dino: any) => {
    const key = dino.holderOwner || "unowned";
    const dinos = groupsMap.get(key) || [];
    dinos.push(dino);
    groupsMap.set(key, dinos);
    return groupsMap;
  }, new Map());

  const combinedDinosMap = processDinosMap(groupedDinos, users);

  const sortedGroupedDinos =
    combinedDinosMap &&
    new Map(
      [...combinedDinosMap.entries()].sort(
        ([keyA, dinosA], [keyB, dinosB]) => dinosB.length - dinosA.length
      )
    );

  const sagaSortedMap = processSortedGroupedDinos(sortedGroupedDinos);

  return { data: data, isLoading: isLoading, sortedMap: sagaSortedMap };
}

function processDinosMap(dinosMap: any, users: any) {
  const combinedDinosMap = new Map();

  if (dinosMap) {
    for (const [walletAddress, dinos] of dinosMap.entries()) {
      const user = users?.find((u: any) =>
        u.wallets.some((w: any) => w.address === walletAddress)
      );

      if (user) {
        const userKey = user.defaultAddress;
        const existingCombinedDinos = combinedDinosMap.get(userKey) || [];
        if (existingCombinedDinos.length === 0) {
          combinedDinosMap.set(userKey, dinos);
        } else {
          combinedDinosMap.set(userKey, existingCombinedDinos.concat(dinos));
        }
      } else {
        combinedDinosMap.set(walletAddress, dinos);
      }
    }
  }

  return combinedDinosMap;
}

function processSortedGroupedDinos(sortedGroupedDinos: any) {
  const sagaSortedMap = new Map(sortedGroupedDinos);

  if (sortedGroupedDinos) {
    for (const [key, value] of sortedGroupedDinos.entries()) {
      if (value.length === 1) {
        const singleDino = value[0];
        if (
          singleDino.attributes.species === "Spino" ||
          singleDino.attributes.species === "Para"
        ) {
          sagaSortedMap.delete(key);
          sagaSortedMap.set(key, [singleDino, ...sortedGroupedDinos.get(key)]);
        }
      }
    }
  }

  return sagaSortedMap;
}

function sortByAmount(groupedDinos: any) {
  return (
    groupedDinos &&
    [...groupedDinos.entries()].sort(
      ([keyA, dinosA], [keyB, dinosB]) => dinosB.length - dinosA.length
    )
  );
}

export function fetchOtherWallets(wallets: string[], acronym: string) {
  const { data: otherWallets } = api.subdao.getHolders.useQuery({
    wallets: wallets || [],
  });

  return otherWallets;
}
