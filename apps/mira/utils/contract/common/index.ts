import { getNeededConfirmations } from "@crossbell/bridge-sdk";
import { useBlockNumber } from "wagmi";

export function useConfirmedBlockNumber(
	chainId: number,
	txBlockNumber?: number
) {
	let { data: currentBlockNumber, ...props } = useBlockNumber({
		chainId,
		watch: true,
		enabled: Boolean(txBlockNumber),
	});

	const neededConfirmations = getNeededConfirmations(chainId);

	let confirmations: number | undefined;
	if (currentBlockNumber && txBlockNumber) {
		confirmations = currentBlockNumber - txBlockNumber;
	}

	return {
		confirmations,
		neededConfirmations,
		satisfied: currentBlockNumber && currentBlockNumber >= neededConfirmations,
		...props,
	};
}
