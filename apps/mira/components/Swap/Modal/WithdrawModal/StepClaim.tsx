import {
	useConfirmedBlockNumber,
	useGetDailyWithdrawalMaxQuota,
	useGetDailyWithdrawalRemainingQuota,
	useWithdraw,
} from "@/utils/contract";
import { handleTransactionSuccess } from "@/utils/contract/base";
import {
	useGetWithdrawalEntry,
	useGetWithdrawalSignature,
} from "@/utils/contract/CrossbellGateway";
import { useGetRequiredValidatorNumber } from "@/utils/contract/Validator";
import {
	formatTokenAmount,
	getTokenDecimals,
	recoverSignatures,
} from "@crossbell/bridge-sdk";
import { Button, Code, Loader, Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import { useWaitForTransaction } from "wagmi";
import {
	requestWithdrawalInfo,
	saveRequestWithdrawalTxHashInLocalStorage,
	step,
	withdrawalInfo,
} from "./store";

export default function StepClaim() {
	const [requestWithdrawalInfoValue] = useAtom(requestWithdrawalInfo);
	const amount = requestWithdrawalInfoValue.amount;
	const decimals = getTokenDecimals(
		requestWithdrawalInfoValue.networkId,
		"MIRA"
	);
	const amountStr = formatTokenAmount(amount, decimals);

	// 0. check daily withdrawal quota
	const { data: maxQuota, isLoading: isLoadingMaxQuota } =
		useGetDailyWithdrawalMaxQuota(requestWithdrawalInfoValue.networkId);
	const { data: remainingQuota, isLoading: isLoadingRemainingQuota } =
		useGetDailyWithdrawalRemainingQuota(requestWithdrawalInfoValue.networkId);
	const isExceedQuota = remainingQuota?.lt(amount);

	// 1. get withdrawal entry
	const { data: withdrawalEntry, isLoading: isLoadingWithdrawalEntry } =
		useGetWithdrawalEntry(
			requestWithdrawalInfoValue.networkId,
			requestWithdrawalInfoValue.withdrawalId
		);

	// 2. get validator numbers
	const { data: validatorNumber, isLoading: isLoadingValidatorNumbers } =
		useGetRequiredValidatorNumber(requestWithdrawalInfoValue.networkId);
	const requiredValidatorNumber = validatorNumber?.toNumber() ?? 0;

	// 3. get withdrawal signature
	const { data: withdrawalSignature, isLoading: isLoadingWithdrawalSignature } =
		useGetWithdrawalSignature(
			requestWithdrawalInfoValue.networkId,
			requestWithdrawalInfoValue.withdrawalId,
			requiredValidatorNumber
		);

	// 4. recover signatures
	const signs = recoverSignatures(
		withdrawalSignature?.signers ?? [],
		withdrawalSignature?.sigs ?? [],
		requiredValidatorNumber
	);

	// 5. withdraw
	const [withdrawalInfoValue, setWithdrawalInfo] = useAtom(withdrawalInfo);
	const [isOldWithdrawalError, setIsOldWithdrawalError] = useState(false);
	const {
		data: withdrawTx,
		isLoading: isLoadingSendTransaction,
		write,
		isSuccess: isSuccessSendTransaction,
	} = useWithdraw(
		requestWithdrawalInfoValue.networkId,
		requestWithdrawalInfoValue.withdrawalId,
		withdrawalEntry?.recipient,
		withdrawalEntry?.token,
		withdrawalEntry?.amount,
		withdrawalEntry?.fee,
		signs,
		{
			enabled: !withdrawalInfoValue.transactionHash,
			onOldWithdrawal() {
				setIsOldWithdrawalError(true);
			},
			onSuccess() {
				saveRequestWithdrawalTxHashInLocalStorage(
					requestWithdrawalInfoValue.transactionHash
				);
			},
		}
	);

	// 6. wait for transaction
	const existedHash = !!withdrawalInfoValue.transactionHash
		? (withdrawalInfoValue.transactionHash as `0x${string}`)
		: undefined;
	const { isLoading: isMining, isSuccess: isMined } = useWaitForTransaction({
		chainId: requestWithdrawalInfoValue.networkId,
		hash: existedHash ?? withdrawTx?.hash,
		onSuccess: (data) => {
			const transactionHash = data.transactionHash;
			setWithdrawalInfo({
				transactionHash,
			});

			handleTransactionSuccess(data);
		},
	});

	// 7. Wait for confirmations
	const {
		isLoading: isLoadingConfirmation,
		confirmations,
		neededConfirmations,
		satisfied: isConfirmationsSatisfied,
	} = useConfirmedBlockNumber(
		requestWithdrawalInfoValue.networkId,
		requestWithdrawalInfoValue.blockNumber
	);

	const handleClickWithdraw = () => {
		write?.();
	};

	const [_, setStep] = useAtom(step);
	const handleClickNext = () => {
		setStep((v) => v + 1);
	};

	const amountElement = (
		<Text fw="bold" inline span>
			{amountStr}
		</Text>
	);

	const txHash = <Code fw="bold">{withdrawTx?.hash}</Code>;

	const isLtRequiredValidatorNumber =
		(withdrawalSignature?.signers.length ?? 0) < requiredValidatorNumber;
	const isBtnDisabled =
		isLtRequiredValidatorNumber ||
		!isConfirmationsSatisfied ||
		isLoadingRemainingQuota ||
		isExceedQuota ||
		isOldWithdrawalError;

	const isLoading =
		isLoadingWithdrawalEntry ||
		isLoadingValidatorNumbers ||
		isLoadingWithdrawalSignature ||
		isLoadingSendTransaction ||
		isMining ||
		isLoadingConfirmation ||
		isLoadingMaxQuota ||
		isLoadingRemainingQuota;
	const isSuccess =
		isSuccessSendTransaction && isMined && isConfirmationsSatisfied;

	return (
		<div>
			<Text my="md">
				Request Tx:{" "}
				<Code fw="bold">{requestWithdrawalInfoValue.transactionHash}</Code>
				<br />
				Network ID:{" "}
				<Code fw="bold">{requestWithdrawalInfoValue.networkId}</Code>
				<br />
				Withdrawal ID:{" "}
				<Code fw="bold">{requestWithdrawalInfoValue.withdrawalId}</Code>
				<br />
				Recipient: <Code fw="bold">{withdrawalEntry?.recipient ?? "..."}</Code>
				<br />
				Amount: {amountElement} MIRA
				<br />
			</Text>

			{isLtRequiredValidatorNumber && (
				<Text my="md">
					<Loader size="xs" /> [{withdrawalSignature?.signers.length ?? "..."} /{" "}
					{requiredValidatorNumber}] Waiting for signs. You are able to withdraw
					after the required number of validators sign. This may take 1-2
					minutes.
				</Text>
			)}

			{remainingQuota && maxQuota && isExceedQuota && (
				<Text my="md">
					Sorry. You have exceeded the daily withdrawal quota (
					{formatTokenAmount(remainingQuota, decimals)}/
					{formatTokenAmount(maxQuota, decimals)} MIRA left). Please contact us
					or wait until tomorrow.
				</Text>
			)}

			{withdrawTx?.hash && isMining && (
				<Text my="md">
					<Loader size="xs" /> Your transaction hash is {txHash}. Please wait
					for the transaction to be mined.
				</Text>
			)}

			{withdrawTx?.hash && isMined && (
				<Text my="md">✅ Your transaction hash is {txHash}.</Text>
			)}

			{Boolean(requestWithdrawalInfoValue.blockNumber) &&
				isLoadingConfirmation && (
					<Text my="md">
						<Loader size="xs" /> Waiting for confirmations... {confirmations}/
						{neededConfirmations}
					</Text>
				)}

			{isOldWithdrawalError && (
				<Text my="md">
					This withdrawal has already been processed. Please refresh the page to
					continue.
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
					onClick={handleClickWithdraw}
					loading={isLoading}
					disabled={isBtnDisabled}
				>
					{isLoadingSendTransaction && "Please Approve in Your Wallet..."}
					{isMining && "Mining Transaction..."}
					{!isLoading && "Withdraw"}
				</Button>
			)}
		</div>
	);
}
