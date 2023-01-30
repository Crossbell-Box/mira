import { CONTRACT_ADDRESS } from "./address";

// @see https://chainlist.org/
export const networkIdToNameMapping: Record<
	number,
	keyof (typeof CONTRACT_ADDRESS)["Validator"]
> = {
	1: "mainnet",
	137: "polygon",
	56: "bsc",
	3737: "crossbell",

	5: "goerli",
	80001: "polygonMumbai",
	97: "bscTestnet",
	11155111: "sepolia",
};
