import { getNeededConfirmations } from "@crossbell/bridge-sdk";
import { useBlockNumber } from "wagmi";

export function useConfirmedBlockNumber(
	chainId: number,
	currentBlockNumber?: number
) {
	let { data, ...props } = useBlockNumber({
		chainId,
		watch: true,
		enabled: Boolean(currentBlockNumber),
	});

	const neededConfirmations = getNeededConfirmations(chainId);

	if (data && currentBlockNumber) {
		data = data - currentBlockNumber;
	}

	return {
		confirmations: data,
		neededConfirmations,
		satisfied: data && data >= neededConfirmations,
		...props,
	};
}
