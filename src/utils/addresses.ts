export function truncateAccount(str: string) {
  const firstFive = str.slice(0, 5);
  const lastFive = str.slice(-5);

  return `${firstFive}...${lastFive}`;
}

export function shortAccount(str: string) {
  const firstFive = str.slice(0, 5);
  return `${firstFive}`;
}

export function isValidAptosAddress(address: string): boolean {
  // Aptos addresses are 32 bytes (64 characters) long and start with '0x'
  const aptosAddressRegex = /^0x[a-fA-F0-9]{64}$/;
  return aptosAddressRegex.test(address);
}
