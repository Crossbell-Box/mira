import { Button, Code, Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useWithdrawModal } from ".";
import { formAmountAtom } from "../../store";
import { requestWithdrawalInfo } from "./store";

export default function StepComplete() {
	const [amountStr] = useAtom(formAmountAtom);

	const [requestWithdrawalInfoValue] = useAtom(requestWithdrawalInfo);

	const { close } = useWithdrawModal();

	const amountElement = (
		<Text fw="bold" inline span>
			{amountStr}
		</Text>
	);

	return (
		<div>
			<Text my="md">
				You have successfully requested to withdraw {amountElement} USDC.
			</Text>

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
				Recipient: <Code fw="bold">{requestWithdrawalInfoValue.recipient}</Code>
				<br />
				Amount: {amountElement} USDC
				<br />
			</Text>

			<Space h="lg" />

			<Button fullWidth size="lg" onClick={() => close()}>
				Done
			</Button>
		</div>
	);
}
