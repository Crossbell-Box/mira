import { useIsMounted } from "@/utils/ssr";
import { Stack } from "@mantine/core";
import { useAccount } from "wagmi";
import WithdrawalTable from "./WithdrawTable";
import DepositTable from "@/components/HistoryList/DepositTable";

export default function HistoryList() {
	const isMounted = useIsMounted();
	const { address, isConnected } = useAccount();

	if (!isMounted) return <></>;

	if (!isConnected) {
		return <div>Please connect your wallet.</div>;
	}

	return (
		<div>
			<h2>Deposits</h2>
			<DepositTable />
			<h2>Withdrawals</h2>
			<WithdrawalTable />
		</div>
	);
}
