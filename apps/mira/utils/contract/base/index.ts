import { showNotification } from "@mantine/notifications";
import type { providers } from "ethers";

export function handleContractError(e: Error) {
	showNotification({
		color: "red",
		title: "Error",
		message: e.message,
	});
}

export function handleTransactionSuccess(data: providers.TransactionReceipt) {
	showNotification({
		color: "green",
		title: "Success",
		message: `Transaction ${data.transactionHash} is confirmed.`,
	});
}
