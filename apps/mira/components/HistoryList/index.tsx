import { useIsMounted } from "@/utils/ssr";
import { Stack } from "@mantine/core";
import { useAccount } from "wagmi";
import WithdrawalTable from "./WithdrawTable";

export default function HistoryList() {
	const isMounted = useIsMounted();
	const { address, isConnected } = useAccount();

	if (!isMounted) return <></>;

	if (!isConnected) {
		return <div>Please connect your wallet.</div>;
	}

	return (
		<>
			<WithdrawalTable />
		</>
	);
}
