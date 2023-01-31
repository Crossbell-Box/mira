import { api } from "@/utils/api";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import { MantineReactTable } from "mantine-react-table";
import type { MRT_ColumnDef } from "mantine-react-table";
import type { request_withdrawal } from "@prisma/client";

export default function WithdrawalTable() {
	const { address } = useAccount();

	const { data, isLoading } = api.indexer.withdrawals.useInfiniteQuery(
		{ recipient: address },
		{ getNextPageParam: (page) => page.nextCursor }
	);

	const columns = useMemo<MRT_ColumnDef<request_withdrawal>[]>(
		() => [
			{
				accessorKey: "mainchain_id",
				header: "Mainchain ID",
			},
			{
				accessorKey: "withdrawal_id",
				header: "Withdrawal ID",
			},
		],
		[]
	);

	const list = useMemo<request_withdrawal[]>(() => {
		if (!data) return [];
		return data.pages.flatMap((page) => page.list);
	}, [data]);

	return (
		<MantineReactTable
			columns={columns}
			data={list}
			enableRowSelection
			enableColumnOrdering
			enableGlobalFilter={false}
		/>
	);
}
