import { BellLogo } from "@/components/Logo";
import { isProd } from "@/utils/env";
import { ReactElement } from "react";
import { Chain, configureChains } from "wagmi";
import {
	mainnet,
	polygon,
	bsc,
	goerli,
	polygonMumbai,
	bscTestnet,
	sepolia,
	crossbell as crossbell_,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const crossbell: Chain & {
	logo?: ReactElement;
} = {
	...crossbell_,
	// logo: <BellLogo />,
};

// prod

export const prodMainChains: Chain[] = [
	// mainnet,
	polygon,
	//bsc
];
export const prodCrossbellChain = crossbell;
export const prodChains: Chain[] = [mainnet, polygon, bsc, crossbell];

// testnet

export const devMainChains: Chain[] = [goerli, polygonMumbai, bscTestnet];
export const devCrossbellChain = sepolia;
export const devChains: Chain[] = [goerli, polygonMumbai, bscTestnet, sepolia];

// composed

export const mainChains = isProd() ? prodMainChains : devMainChains;
export const crossbellChain = isProd() ? prodCrossbellChain : devCrossbellChain;
export const chains = isProd() ? prodChains : devChains;

export const { provider } = configureChains(chains, [
	// alchemyProvider({ apiKey: "N5tKjxRiiwKH4kmdQge4rus_qea3lQTS" }),
	publicProvider(),
	jsonRpcProvider({
		rpc: (chain) => {
			if (chain.id !== crossbellChain.id) return null;
			return { http: chain.rpcUrls.default.http[0] };
		},
	}),
]);
