import { formatTokenAmount, getTokenDecimals } from "@crossbell/bridge-sdk";
import { Button, Code, Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useWithdrawModal } from ".";
import { requestWithdrawalInfo } from "./store";

export default function StepComplete() {
  const [requestWithdrawalInfoValue] = useAtom(requestWithdrawalInfo);
  const [withdrawalInfoValue] = useAtom(requestWithdrawalInfo);

  const decimals = getTokenDecimals(
    requestWithdrawalInfoValue.networkId,
    "MIRA"
  );
  const amountStr = formatTokenAmount(
    requestWithdrawalInfoValue.amount,
    decimals
  );
  const feeStr = formatTokenAmount(requestWithdrawalInfoValue.fee, decimals);

  const { close } = useWithdrawModal();

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
        You have successfully requested to withdraw {amountElement} MIRA.
      </Text>

      <Text my="md">
        Request Tx:{" "}
        <Code fw="bold">{requestWithdrawalInfoValue.transactionHash}</Code>
        <br />
        Withdrawal Tx:{" "}
        <Code fw="bold">{withdrawalInfoValue.transactionHash}</Code>
        <br />
        Network ID:{" "}
        <Code fw="bold">{requestWithdrawalInfoValue.networkId}</Code>
        <br />
        Withdrawal ID:{" "}
        <Code fw="bold">{requestWithdrawalInfoValue.withdrawalId}</Code>
        <br />
        Recipient: <Code fw="bold">{requestWithdrawalInfoValue.recipient}</Code>
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
