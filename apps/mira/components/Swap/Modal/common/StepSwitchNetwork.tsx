import { getNetworkNameById, useSwitchNetwork } from "@/utils/ethers";
import { Button, Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import type { PropsWithChildren, ReactElement } from "react";
import { useNetwork } from "wagmi";

export default function StepSwitchNetwork({
	onClickNext,
	targetNetworkId,
	description,
}: PropsWithChildren<{
	onClickNext: (...args: any[]) => any;
	targetNetworkId: number;
	description: ReactElement;
}>) {
	const { chain } = useNetwork();

	const isOnCurrentChain = chain?.id === targetNetworkId;

	const { switchNetwork, isLoading: isSwitchingNetwork } =
		useSwitchNetwork(targetNetworkId);

	const handleClickSwitchNetwork = () => {
		switchNetwork?.();
	};

	const handleClickNext = () => {
		onClickNext?.();
	};

	const chainNetworkName = (
		<Text fw="bold" inline span>
			{getNetworkNameById(targetNetworkId)}
		</Text>
	);

	const currentNetworkName = (
		<Text fw="bold" inline span>
			{chain?.name}
		</Text>
	);

	return (
		<div>
			<Text my="md">{description}</Text>

			<Text my="md">
				Now, you need to switch to the {chainNetworkName} network.
			</Text>

			<Text my="md">
				{isOnCurrentChain ? "✅" : "❌"} You are now on the {currentNetworkName}{" "}
				network.
			</Text>

			<Space h="lg" />

			{isOnCurrentChain ? (
				<Button fullWidth size="lg" onClick={handleClickNext}>
					Next
				</Button>
			) : (
				<Button
					fullWidth
					size="lg"
					onClick={handleClickSwitchNetwork}
					loading={isSwitchingNetwork}
				>
					{isSwitchingNetwork
						? "Please Switch in Your Wallet..."
						: "Switch Network"}
				</Button>
			)}
		</div>
	);
}
