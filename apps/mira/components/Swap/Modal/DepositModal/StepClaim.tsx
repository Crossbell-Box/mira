import {
	useConfirmedBlockNumber,
	useGetDailyDepositMaxQuota,
	useGetDailyDepositRemainingQuota,
	useDeposit,
} from "@/utils/contract";
import { handleTransactionSuccess } from "@/utils/contract/base";
import {
	useGetDepositEntry,
	useGetDepositSignature,
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
	requestDepositInfo,
	saveRequestDepositTxHashInLocalStorage,
	step,
	depositInfo,
} from "./store";

export default function StepClaim() {
	const [requestDepositInfoValue] = useAtom(requestDepositInfo);
	const amount = requestDepositInfoValue.amount;
	const decimals = getTokenDecimals(
		requestDepositInfoValue.networkId,
		"MIRA"
	);
	const amountStr = formatTokenAmount(amount, decimals);

	// 0. check daily deposit quota
	const { data: maxQuota, isLoading: isLoadingMaxQuota } =
		useGetDailyDepositMaxQuota(requestDepositInfoValue.networkId);
	const { data: remainingQuota, isLoading: isLoadingRemainingQuota } =
		useGetDailyDepositRemainingQuota(requestDepositInfoValue.networkId);
	const isExceedQuota = remainingQuota?.lt(amount);

	// 1. get deposit entry
	const { data: depositEntry, isLoading: isLoadingDepositEntry } =
		useGetDepositEntry(
			requestDepositInfoValue.networkId,
			requestDepositInfoValue.depositId
		);

	// 2. get validator numbers
	const { data: validatorNumber, isLoading: isLoadingValidatorNumbers } =
		useGetRequiredValidatorNumber(requestDepositInfoValue.networkId);
	const requiredValidatorNumber = validatorNumber?.toNumber() ?? 0;

	// 3. get deposit signature
	const { data: depositSignature, isLoading: isLoadingDepositSignature } =
		useGetDepositSignature(
			requestDepositInfoValue.networkId,
			requestDepositInfoValue.depositId,
			requiredValidatorNumber
		);

	// 4. recover signatures
	const signs = recoverSignatures(
		depositSignature?.signers ?? [],
		depositSignature?.sigs ?? [],
		requiredValidatorNumber
	);

	// 5. deposit
	const [depositInfoValue, setDepositInfo] = useAtom(depositInfo);
	const [isOldDepositError, setIsOldDepositError] = useState(false);
	const {
		data: depositTx,
		isLoading: isLoadingSendTransaction,
		write,
		isSuccess: isSuccessSendTransaction,
	} = useDeposit(
		requestDepositInfoValue.networkId,
		requestDepositInfoValue.depositId,
		depositEntry?.recipient,
		depositEntry?.token,
		depositEntry?.amount,
		depositEntry?.fee,
		signs,
		{
			enabled: !depositInfoValue.transactionHash,
			onOldDeposit() {
				setIsOldDepositError(true);
			},
			onSuccess() {
				saveRequestDepositTxHashInLocalStorage(
					requestDepositInfoValue.transactionHash
				);
			},
		}
	);

	// 6. wait for transaction
	const existedHash = !!depositInfoValue.transactionHash
		? (depositInfoValue.transactionHash as `0x${string}`)
		: undefined;
	const { isLoading: isMining, isSuccess: isMined } = useWaitForTransaction({
		chainId: requestDepositInfoValue.networkId,
		hash: existedHash ?? depositTx?.hash,
		onSuccess: (data) => {
			const transactionHash = data.transactionHash;
			setDepositInfo({
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
		requestDepositInfoValue.networkId,
		requestDepositInfoValue.blockNumber
	);

	const handleClickDeposit = () => {
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

	const txHash = <Code fw="bold">{depositTx?.hash}</Code>;

	const isLtRequiredValidatorNumber =
		(depositSignature?.signers.length ?? 0) < requiredValidatorNumber;
	const isBtnDisabled =
		isLtRequiredValidatorNumber ||
		!isConfirmationsSatisfied ||
		isLoadingRemainingQuota ||
		isExceedQuota ||
		isOldDepositError;

	const isLoading =
		isLoadingDepositEntry ||
		isLoadingValidatorNumbers ||
		isLoadingDepositSignature ||
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
				<Code fw="bold">{requestDepositInfoValue.transactionHash}</Code>
				<br />
				Network ID:{" "}
				<Code fw="bold">{requestDepositInfoValue.networkId}</Code>
				<br />
				Deposit ID:{" "}
				<Code fw="bold">{requestDepositInfoValue.depositId}</Code>
				<br />
				Recipient: <Code fw="bold">{depositEntry?.recipient ?? "..."}</Code>
				<br />
				Amount: {amountElement} MIRA
				<br />
			</Text>

			{isLtRequiredValidatorNumber && (
				<Text my="md">
					<Loader size="xs" /> [{depositSignature?.signers.length ?? "..."} /{" "}
					{requiredValidatorNumber}] Waiting for signs. You are able to deposit
					after the required number of validators sign. This may take 1-2
					minutes.
				</Text>
			)}

			{remainingQuota && maxQuota && isExceedQuota && (
				<Text my="md">
					Sorry. You have exceeded the daily deposit quota (
					{formatTokenAmount(remainingQuota, decimals)}/
					{formatTokenAmount(maxQuota, decimals)} MIRA left). Please contact us
					or wait until tomorrow.
				</Text>
			)}

			{depositTx?.hash && isMining && (
				<Text my="md">
					<Loader size="xs" /> Your transaction hash is {txHash}. Please wait
					for the transaction to be mined.
				</Text>
			)}

			{depositTx?.hash && isMined && (
				<Text my="md">✅ Your transaction hash is {txHash}.</Text>
			)}

			{Boolean(requestDepositInfoValue.blockNumber) &&
				isLoadingConfirmation && (
					<Text my="md">
						<Loader size="xs" /> Waiting for confirmations... {confirmations}/
						{neededConfirmations}
					</Text>
				)}

			{isOldDepositError && (
				<Text my="md">
					This deposit has already been processed. Please refresh the page to
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
					onClick={handleClickDeposit}
					loading={isLoading}
					disabled={isBtnDisabled}
				>
					{isLoadingSendTransaction && "Please Approve in Your Wallet..."}
					{isMining && "Mining Transaction..."}
					{!isLoading && "Deposit"}
				</Button>
			)}
		</div>
	);
}
