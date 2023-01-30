import { handleTransactionSuccess } from "@/utils/contract/base";
import { useRequestWithdrawal } from "@/utils/contract/CrossbellGateway";
import { NIL_ADDRESS } from "@/utils/ethers/constants";
import {
	getTokenDecimals,
	parseLog,
	parseTokenAmount,
} from "@crossbell/bridge-sdk";
import { Button, Code, Loader, Space, Text } from "@mantine/core";
import { BigNumber } from "ethers";
import { useAtom } from "jotai";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useWithdrawModal } from ".";
import {
	formAmountAtom,
	formMainchainNetworkIdAtom,
	formSidechainNetworkIdAtom,
} from "../../store";
import { requestWithdrawalInfo } from "./store";

export default function StepRequestWithdrawal() {
	const [sidechainNetworkId] = useAtom(formSidechainNetworkIdAtom);
	const [mainchainNetworkId] = useAtom(formMainchainNetworkIdAtom);
	const [amountStr] = useAtom(formAmountAtom);

	const decimals = getTokenDecimals(sidechainNetworkId, "MIRA");
	const amount = parseTokenAmount(amountStr, decimals);

	const { address = NIL_ADDRESS } = useAccount();

	const fee = BigNumber.from(0); // TODO:

	// 1. Request Withdrawal
	const {
		data: requestWithdrawalTx,
		write,
		isLoading: isLoadingSendTransaction,
		isSuccess: isSuccessSendTransaction,
	} = useRequestWithdrawal(mainchainNetworkId, address, "MIRA", amount, fee);

	// 2. Wait for transaction
	const [requestWithdrawalInfoValue, setRequestWithdrawalInfo] = useAtom(
		requestWithdrawalInfo
	);
	const { isLoading: isMining, isSuccess: isMined } = useWaitForTransaction({
		chainId: sidechainNetworkId,
		hash: requestWithdrawalTx?.hash,
		onSuccess: (data) => {
			const event = parseLog(data.logs, "RequestWithdrawal");
			const networkId = event.args.chainId.toNumber();
			const withdrawalId = event.args.withdrawalId.toNumber();
			const recipient = event.args.recipient;
			const amount = event.args.amount;
			const fee = event.args.fee;
			const transactionHash = data.transactionHash;
			setRequestWithdrawalInfo({
				networkId,
				withdrawalId,
				transactionHash,
				recipient,
				amount,
				fee,
			});

			handleTransactionSuccess(data);
		},
	});

	const handleClickRequest = () => {
		write?.();
	};

	const { nextStep } = useWithdrawModal();
	const handleClickNext = () => {
		nextStep();
	};

	const amountElement = (
		<Text fw="bold" inline span>
			{amountStr}
		</Text>
	);

	const txHash = <Code fw="bold">{requestWithdrawalTx?.hash}</Code>;

	const isSuccess = isSuccessSendTransaction && isMined;

	return (
		<div>
			<Text my="md">
				Please click the button below to request withdrawal of {amountElement}{" "}
				USDC.
			</Text>

			{requestWithdrawalTx?.hash && isMining && (
				<Text my="md">
					<Loader size="xs" /> Your transaction hash is {txHash}. Please wait
					for the transaction to be mined.
				</Text>
			)}

			{requestWithdrawalTx?.hash && isMined && (
				<Text my="md">✅ Your transaction hash is {txHash}.</Text>
			)}

			{Boolean(requestWithdrawalInfoValue.transactionHash) && (
				<Text my="md">
					✅ Withdrawal ID:{" "}
					<Code fw="bold">{requestWithdrawalInfoValue.withdrawalId}</Code>.
					Network ID:{" "}
					<Code fw="bold">{requestWithdrawalInfoValue.networkId}</Code>.
				</Text>
			)}

			<Space h="lg" />

			{isSuccess ? (
				<Button fullWidth size="lg" onClick={handleClickNext}>
					Next
				</Button>
			) : (
				<Button
					fullWidth
					size="lg"
					onClick={handleClickRequest}
					loading={isLoadingSendTransaction || isMining}
				>
					{isLoadingSendTransaction && "Please Approve in Your Wallet..."}
					{isMining && "Mining Transaction..."}
					{!isLoadingSendTransaction && !isMining && "Request Withdrawal"}
				</Button>
			)}
		</div>
	);
}
