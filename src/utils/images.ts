export const handleUserPFPDoesNotExist: React.EventHandler<
  React.SyntheticEvent<HTMLImageElement, Event>
> = (event) => {
  event.currentTarget.onerror = null; // Avoid infinite loop in case of multiple errors

  // Use the image's alt text (which often contains the address) or a timestamp for consistency
  const identifier = event.currentTarget.alt || Date.now().toString();
  const dinoIndex = getHashIndex(identifier, dinos.length);
  event.currentTarget.src = `/icons/${dinos[dinoIndex]}_colored.svg`;
};

// Helper function to get consistent index from string
const getHashIndex = (str: string, max: number): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % max;
};

const dinos = [
  "stego",
  "trice",
  "raptor",
  "rex",
  "bronto",
  "dactyl",
  "ankylo",
] as const;

export const getUserAvatar = (user: {
  image?: string | null;
  defaultAddress: string;
}) => {
  console.log("user", user);
  console.log("user.image", user?.image);
  // Only use custom uploaded avatar, otherwise default to deterministic dino
  if (user?.image) {
    return user.image;
  }

  // Get consistent dino index based on user's address
  const dinoIndex = getHashIndex(user.defaultAddress, dinos.length);
  return `/icons/${dinos[dinoIndex]}_colored.svg`;
};
