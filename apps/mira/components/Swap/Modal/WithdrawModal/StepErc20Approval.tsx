import { handleTransactionSuccess } from "@/utils/contract/base";
import { useTokenAllowance, useTokenApprove } from "@/utils/contract/Erc20";
import { getNetworkNameById } from "@/utils/ethers";
import { NIL_ADDRESS } from "@/utils/ethers/constants";
import {
	formatTokenAmount,
	getTokenDecimals,
	parseTokenAmount,
} from "@crossbell/bridge-sdk";
import { Button, Loader, Space, Text } from "@mantine/core";
import { BigNumber } from "ethers";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useWithdrawModal } from ".";
import { formAmountAtom, formSidechainNetworkIdAtom } from "../../store";

export default function StepErc20Approval() {
	const [sidechainNetworkId] = useAtom(formSidechainNetworkIdAtom);
	const [amountStr] = useAtom(formAmountAtom);

	const decimals = getTokenDecimals(sidechainNetworkId, "MIRA");
	const amount = parseTokenAmount(amountStr, decimals);

	const { address } = useAccount();

	// 1. loading allowance
	const {
		data: allowance = BigNumber.from(0),
		isLoading: isLoadingAllowance,
		refetch: refetchAllowance,
	} = useTokenAllowance(sidechainNetworkId, "MIRA", address ?? NIL_ADDRESS);
	useEffect(() => {
		refetchAllowance();
	}, []);

	// 2. approve
	const {
		data: approveTx,
		write,
		isLoading: isLoadingSendTransaction,
	} = useTokenApprove(sidechainNetworkId, "MIRA", amount);

	// 3. wait for transaction
	const { isLoading: isMining } = useWaitForTransaction({
		chainId: sidechainNetworkId,
		hash: approveTx?.hash,
		onSuccess: (data) => {
			handleTransactionSuccess(data);
			refetchAllowance();
		},
	});

	const hasEnoughAllowance = allowance?.gte(amount);

	const sidechainNetworkName = (
		<Text fw="bold" inline span>
			{getNetworkNameById(sidechainNetworkId)}
		</Text>
	);

	const requiredAllowance = (
		<Text fw="bold" inline span>
			{formatTokenAmount(amount?.toString(), decimals)}
		</Text>
	);

	const currentAllowance = (
		<Text fw="bold" inline span>
			{formatTokenAmount(allowance?.toString(), decimals)}
		</Text>
	);

	const handleClickApprove = () => {
		if (!hasEnoughAllowance) {
			write?.();
		}
	};

	const { nextStep } = useWithdrawModal();
	const handleClickNext = () => {
		nextStep();
	};

	const isLoading = isLoadingAllowance || isLoadingSendTransaction || isMining;

	return (
		<div>
			<Text my="md">
				To sell $MIRA on the {sidechainNetworkName} network, you need to approve
				the amount of $MIRA token for the withdraw contract.
			</Text>

			{isLoadingAllowance ? (
				<Text my="md">
					<Loader size="xs" /> You have approved ... MIRA ({requiredAllowance}{" "}
					required) for the withdraw contract.
				</Text>
			) : (
				<Text my="md">
					{hasEnoughAllowance ? "✅" : "❌"} You have approved{" "}
					{currentAllowance} MIRA ({requiredAllowance} required) for the
					withdraw contract.
				</Text>
			)}

			<Space h="lg" />

			{hasEnoughAllowance ? (
				<Button fullWidth size="lg" onClick={handleClickNext}>
					Next
				</Button>
			) : (
				<Button
					fullWidth
					size="lg"
					onClick={handleClickApprove}
					loading={isLoading}
				>
					{isLoadingAllowance && "Loading Allowance..."}
					{isLoadingSendTransaction && "Please Approve in Your Wallet"}
					{isMining && "Mining Transaction..."}
					{!isLoading && "Approve"}
				</Button>
			)}
		</div>
	);
}
