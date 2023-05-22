import { useConfirmedBlockNumber } from "@/utils/contract";
import { handleTransactionSuccess } from "@/utils/contract/base";
import { useRequestDeposit } from "@/utils/contract/CrossbellGateway";
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
import { useDepositModal } from ".";
import {
	formAmountAtom,
	formMainchainNetworkIdAtom,
	formSidechainNetworkIdAtom,
} from "../../store";
import { requestDepositInfo } from "./store";

export default function StepRequestDeposit() {
	const [sidechainNetworkId] = useAtom(formSidechainNetworkIdAtom);
	const [mainchainNetworkId] = useAtom(formMainchainNetworkIdAtom);
	const [amountStr] = useAtom(formAmountAtom);

	const decimals = getTokenDecimals(sidechainNetworkId, "MIRA");
	const amount = parseTokenAmount(amountStr, decimals);

	const { address = NIL_ADDRESS } = useAccount();

	const fee = BigNumber.from(0); // TODO:

	// 1. Request Deposit
	const {
		data: requestDepositTx,
		write,
		isLoading: isLoadingSendTransaction,
		isSuccess: isSuccessSendTransaction,
	} = useRequestDeposit(mainchainNetworkId, address, "MIRA", amount, fee);

	// 2. Wait for transaction
	const [requestDepositInfoValue, setRequestDepositInfo] = useAtom(
		requestDepositInfo
	);
	const { isLoading: isMining, isSuccess: isMined } = useWaitForTransaction({
		chainId: sidechainNetworkId,
		hash: requestDepositTx?.hash,
		onSuccess: (data) => {
			const event = parseLog(data.logs, "RequestDeposit");
			const networkId = event.args.chainId.toNumber();
			const depositId = event.args.depositId.toNumber();
			const recipient = event.args.recipient;
			const amount = event.args.amount;
			const fee = event.args.fee;
			const transactionHash = data.transactionHash;
			const blockNumber = data.blockNumber;
			setRequestDepositInfo({
				networkId,
				depositId,
				transactionHash,
				blockNumber,
				recipient,
				amount,
				fee,
			});

			handleTransactionSuccess(data);
		},
	});

	// 3. Wait for confirmations
	const {
		isLoading: isLoadingConfirmation,
		confirmations,
		neededConfirmations,
		satisfied: isConfirmationsSatisfied,
	} = useConfirmedBlockNumber(
		sidechainNetworkId,
		requestDepositInfoValue.blockNumber
	);

	const handleClickRequest = () => {
		write?.();
	};

	const { nextStep } = useDepositModal();
	const handleClickNext = () => {
		nextStep();
	};

	const amountElement = (
		<Text fw="bold" inline span>
			{amountStr}
		</Text>
	);

	const txHash = <Code fw="bold">{requestDepositTx?.hash}</Code>;

	const hasAlreadyMined = Boolean(requestDepositInfoValue.transactionHash); // when recovering from history
	const isSuccess =
		hasAlreadyMined ||
		(isSuccessSendTransaction && isMined && isConfirmationsSatisfied);
	const isLoading =
		isLoadingSendTransaction || isMining || isLoadingConfirmation;
	const isBtnDisabled = !isConfirmationsSatisfied;

	return (
		<div>
			<Text my="md">
				Please click the button below to request swap-out of {amountElement}{" "}
				MIRA.
			</Text>

			{requestDepositTx?.hash && isMining && (
				<Text my="md">
					<Loader size="xs" /> Your transaction hash is {txHash}. Please wait
					for the transaction to be mined.
				</Text>
			)}

			{requestDepositTx?.hash && isMined && (
				<Text my="md">✅ Your transaction hash is {txHash}.</Text>
			)}

			{Boolean(requestDepositInfoValue.transactionHash) && (
				<Text my="md">
					✅ Deposit ID:{" "}
					<Code fw="bold">{requestDepositInfoValue.depositId}</Code>.
					Network ID:{" "}
					<Code fw="bold">{requestDepositInfoValue.networkId}</Code>.
				</Text>
			)}

			{Boolean(requestDepositInfoValue.blockNumber) &&
				isLoadingConfirmation && (
					<Text my="md">
						<Loader size="xs" /> Waiting for confirmations... {confirmations}/
						{neededConfirmations}
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
					loading={isLoading}
					disabled={isBtnDisabled}
				>
					{isLoadingSendTransaction && "Please Approve in Your Wallet..."}
					{isMining && "Mining Transaction..."}
					{!isLoading && "Request Deposit"}
				</Button>
			)}
		</div>
	);
}
