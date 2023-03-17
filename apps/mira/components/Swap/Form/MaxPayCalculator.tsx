import { useTokenBalance } from "@/utils/contract/Erc20";
import { NIL_ADDRESS } from "@/utils/ethers/constants";
import { useIsMounted } from "@/utils/ssr";
import {
	formatTokenAmount,
	getTokenDecimals,
	parseTokenAmount,
} from "@crossbell/bridge-sdk";
import { Space, Text } from "@mantine/core";
import { BigNumber } from "ethers";
import { useAtom } from "jotai";
import { useAccount } from "wagmi";
import { formAmountAtom, formSidechainNetworkIdAtom } from "../store";

export function useIsAmountLargerThanBalance() {
	const { address } = useAccount();
	const [sidechainNetworkId] = useAtom(formSidechainNetworkIdAtom);
	const { data: balance = BigNumber.from(0) } = useTokenBalance(
		sidechainNetworkId,
		"MIRA",
		address ?? NIL_ADDRESS
	);

	const decimals = getTokenDecimals(sidechainNetworkId, "MIRA");

	const [amount] = useAtom(formAmountAtom);
	const isAmountLargerThanBalance =
		Boolean(amount) && balance.lt(parseTokenAmount(amount, decimals));

	return isAmountLargerThanBalance;
}

export function useIsAmountLargerThanZero() {
	const [amount] = useAtom(formAmountAtom);
	const [sidechainNetworkId] = useAtom(formSidechainNetworkIdAtom);
	const decimals = getTokenDecimals(sidechainNetworkId, "MIRA");
	const isAmountLargerThanZero =
		Boolean(amount) && parseTokenAmount(amount, decimals).gt(0);

	return isAmountLargerThanZero;
}

export default function MaxPayCalculator() {
	const { address, isConnected } = useAccount();
	const [sidechainNetworkId] = useAtom(formSidechainNetworkIdAtom);
	const { data: balance = BigNumber.from(0), isLoading } = useTokenBalance(
		sidechainNetworkId,
		"MIRA",
		address ?? NIL_ADDRESS
	);

	const decimals = getTokenDecimals(sidechainNetworkId, "MIRA");
	const balanceStr = formatTokenAmount(balance, decimals);

	const [amount, setAmount] = useAtom(formAmountAtom);
	const handleClickMax = () => {
		setAmount(balanceStr);
	};

	const isMounted = useIsMounted();

	if (!isMounted || !isConnected) {
		return <div></div>;
	}

	const isAmountLargerThanBalance =
		amount && balance.lt(parseTokenAmount(amount, decimals));

	return (
		<div className="flex">
			<Text color={isAmountLargerThanBalance ? "red" : "dimmed"} size="xs" span>
				Available: {isLoading ? "loading..." : balanceStr}
			</Text>

			<Space w="xs" />

			<Text
				color="yellow"
				size="xs"
				span
				className="cursor-pointer"
				onClick={handleClickMax}
			>
				Max
			</Text>
		</div>
	);
}
