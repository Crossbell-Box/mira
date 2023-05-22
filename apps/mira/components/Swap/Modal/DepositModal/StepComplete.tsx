import { formatTokenAmount, getTokenDecimals } from "@crossbell/bridge-sdk";
import { Button, Code, Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useDepositModal } from ".";
import { requestDepositInfo } from "./store";

export default function StepComplete() {
	const [requestDepositInfoValue] = useAtom(requestDepositInfo);
	const [depositInfoValue] = useAtom(requestDepositInfo);

	const decimals = getTokenDecimals(
		requestDepositInfoValue.networkId,
		"MIRA"
	);
	const amountStr = formatTokenAmount(
		requestDepositInfoValue.amount,
		decimals
	);
	const feeStr = formatTokenAmount(requestDepositInfoValue.fee, decimals);

	const { close } = useDepositModal();

	const amountElement = (
		<Text fw="bold" inline span>
			{amountStr}
		</Text>
	);

	const feeElement = (
		<Text fw="bold" inline span>
			{feeStr}
		</Text>
	);

	return (
		<div>
			<Text my="md">
				You have successfully requested to deposit {amountElement} MIRA.
			</Text>

			<Text my="md">
				Request Tx:{" "}
				<Code fw="bold">{requestDepositInfoValue.transactionHash}</Code>
				<br />
				Deposit Tx:{" "}
				<Code fw="bold">{depositInfoValue.transactionHash}</Code>
				<br />
				Network ID:{" "}
				<Code fw="bold">{requestDepositInfoValue.networkId}</Code>
				<br />
				Deposit ID:{" "}
				<Code fw="bold">{requestDepositInfoValue.depositId}</Code>
				<br />
				Recipient: <Code fw="bold">{requestDepositInfoValue.recipient}</Code>
				<br />
				Amount: {amountElement} MIRA
				<br />
				Claim Tip Fee: {feeElement} MIRA
			</Text>

			<Space h="lg" />

			<Button fullWidth size="lg" onClick={() => close()}>
				Done
			</Button>
		</div>
	);
}
