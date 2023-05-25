import { networkIdToNameMapping } from "./network";

export const NETWORK_CONFIRMATIONS = {
  mainnet: 12,
  polygon: 130,
  bsc: 15,
  crossbell: 30,
  goerli: 6,
  polygonMumbai: 8,
  bscTestnet: 8,
  sepolia: 6,
} satisfies Record<string, number>;

export const getNeededConfirmations = (networkId: number) => {
  const networkName = networkIdToNameMapping[networkId];
  if (!networkName) {
    throw new Error(`Unknown network id: ${networkId}`);
  }

  if (NETWORK_CONFIRMATIONS[networkName]) {
    return NETWORK_CONFIRMATIONS[networkName];
  }

  throw new Error(`Unknown network name: ${networkName}`);
};
