import { api } from "@/utils/api";
import { Alert, Group, Text } from "@mantine/core";
import { IconAlertCircle, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function PendingAlert() {
  const { address } = useAccount();

  const { data: pendingRequestWithdrawalCount } =
    api.indexer.pendingRequestWithdrawalCount.useQuery({ recipient: address });

  const { data: pendingRequestDepositCount } =
    api.indexer.pendingRequestDepositCount.useQuery({ recipient: address });

  const show =
    (pendingRequestWithdrawalCount && pendingRequestWithdrawalCount > 0) ||
    (pendingRequestDepositCount && pendingRequestDepositCount > 0);

  if (!show) return <></>;

  return (
    <Link href="/history" title="View history">
      <Alert icon={<IconAlertCircle />}>
        <Group position="apart">
          <Text>
            You have
            {!!pendingRequestWithdrawalCount && (
              <>
                {" "}
                <span className="font-bold">
                  {pendingRequestWithdrawalCount}
                </span>{" "}
                pending swap-outs
                {pendingRequestWithdrawalCount > 1 && "s"}
              </>
            )}
            {!!pendingRequestDepositCount && (
              <>
                {" "}
                and{" "}
                <span className="font-bold">
                  {pendingRequestDepositCount}
                </span>{" "}
                pending swap-ins
                {pendingRequestDepositCount > 1 && "s"}
              </>
            )}
            .
          </Text>

          <IconArrowRight />
        </Group>
      </Alert>
    </Link>
  );
}
