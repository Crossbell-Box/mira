import { showNotification } from "@mantine/notifications";
import type { providers } from "ethers";

export function handleContractError(e: Error) {
  console.error(e);
  showNotification({
    color: "red",
    title: "Error",
    // @ts-ignore
    message: e.error?.data?.originalError?.message ?? e.message,
  });
}

export function handleTransactionSuccess(data: providers.TransactionReceipt) {
  showNotification({
    color: "green",
    title: "Success",
    message: `Transaction ${data.transactionHash} is confirmed.`,
  });
}
