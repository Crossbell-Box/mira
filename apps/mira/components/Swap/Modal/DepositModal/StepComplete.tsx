import { formatTokenAmount, getTokenDecimals } from "@crossbell/bridge-sdk";
import { Button, Code, Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useDepositModal } from ".";
import { requestDepositInfo } from "./store";

export default function StepComplete() {
  const [requestDepositInfoValue] = useAtom(requestDepositInfo);

  const decimals = getTokenDecimals(requestDepositInfoValue.networkId, "MIRA");
  const amountStr = formatTokenAmount(requestDepositInfoValue.amount, decimals);

  const { close } = useDepositModal();

  const amountElement = (
    <Text fw="bold" inline span>
      {amountStr}
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
        Network ID: <Code fw="bold">{requestDepositInfoValue.networkId}</Code>
        <br />
        Deposit ID: <Code fw="bold">{requestDepositInfoValue.depositId}</Code>
        <br />
        Recipient: <Code fw="bold">{requestDepositInfoValue.recipient}</Code>
        <br />
        Amount: {amountElement} MIRA
      </Text>

      <Space h="lg" />

      <Button fullWidth size="lg" onClick={() => close()}>
        Done
      </Button>
    </div>
  );
}
