import { chains } from "@/components/Providers/WalletProvider/chains";
import { networkIdToNameMapping } from "@crossbell/bridge-sdk/src/contract/network";
import { showNotification } from "@mantine/notifications";
import { useSwitchNetwork as useSwitchNetwork_ } from "wagmi";

export function useSwitchNetwork(networkId: number) {
	return useSwitchNetwork_({
		chainId: networkId,
		onError: (e) => {
			showNotification({
				color: "red",
				title: "Failed to switch network",
				message: e.message,
			});
		},
		onSuccess: (e) => {
			const networkName = networkIdToNameMapping[networkId];
			showNotification({
				color: "green",
				title: `Switched to ${networkName}`,
				message: `You are now connected to ${networkName}`,
			});
		},
	});
}

export function getNetworkNameById(networkId: number) {
	return chains.find((chain) => chain.id === networkId)?.name;
}

export function getTxScanUrl(networkId: number, txHash: string) {
	const chain = chains.find((chain) => chain.id === networkId);
	if (!chain || !chain.blockExplorers?.default) {
		return undefined;
	}
	return chain.blockExplorers.default.url + "/tx/" + txHash;
}
