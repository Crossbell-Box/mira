import { api } from "@/utils/api";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MantineReactTable, MRT_Row } from "mantine-react-table";
import type { MRT_ColumnDef } from "mantine-react-table";
import type { request_deposit } from "@prisma/client";
import { crossbellChain } from "../Providers/WalletProvider/chains";
import {
	renderAmount,
	renderBigNumberId,
	renderChainIdAndName,
	renderStatusCell,
	renderTxUrl,
} from "./table-helpers";
import { Button, Text } from "@mantine/core";
import { BigNumber } from "ethers";
import {
	CONTRACT_ADDRESS,
	formatTokenAmount,
	getTokenDecimals,
	getTokenName,
} from "@crossbell/bridge-sdk";
import {isRequestDepositDepositedButNotIndexed} from "@/components/Swap/Modal/DepositModal/store";
import {useDepositModal} from "@/components/Swap/Modal/DepositModal";
import {networkIdToNameMapping} from "@crossbell/bridge-sdk/src/contract/network";

export default function DepositTable() {
	const { address } = useAccount();

	const { data, isLoading, isFetching, isError, fetchNextPage } =
		api.indexer.deposits.useInfiniteQuery(
			{ recipient: address },
			{ getNextPageParam: (page) => page.nextCursor }
		);

	const list = useMemo<request_deposit[]>(() => {
		if (!data) return [];
		return data.pages.flatMap((page) => page.list);
	}, [data]);

	const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
	const rowVirtualizerInstanceRef = useRef(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method

	const [columnFilters, setColumnFilters] = useState<any[]>([]);
	const [globalFilter, setGlobalFilter] = useState<any>();
	const [sorting, setSorting] = useState<any[]>([]);

	const columns = useMemo<MRT_ColumnDef<request_deposit>[]>(
		() => [
			{
				accessorKey: "status",
				header: "Status",
				Cell: renderStatusCell,
			},
			{
				accessorKey: "mainchain_id",
				header: "Mainchain ID",
				Cell: renderChainIdAndName,
			},
			{
				accessorKey: "deposit_id",
				header: "Deposit ID",
				Cell: renderBigNumberId,
			},
			{
				accessorKey: "token_quantity",
				header: "Amount",
				Cell: ({ row, renderedCellValue }) => {
					const networkId = Number(row.original.mainchain_id);
					// const tokenAddress = row.original.crossbell_token_address;
					const tokenAddress = CONTRACT_ADDRESS.MIRA[networkIdToNameMapping[networkId]]?.address;
					return renderAmount({
						renderedCellValue,
						networkId,
						tokenAddress,
					});
				},
			},
			{
				accessorKey: "transaction",
				header: "Request Tx",
				Cell: ({ row, renderedCellValue }) => {
					const networkId = Number(row.original.mainchain_id);
					const txHash = renderedCellValue?.toString() ?? "";
					return renderTxUrl({ networkId, txHash });
				},
			},
		],
		[]
	);

	const totalDBRowCount = data?.pages?.[0]?.total ?? 0;
	const totalFetched = list.length;

	//called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
	const fetchMoreOnBottomReached = useCallback(
		(containerRefElement?: HTMLDivElement | null) => {
			if (containerRefElement) {
				const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
				//once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
				if (
					scrollHeight - scrollTop - clientHeight < 400 &&
					!isFetching &&
					totalFetched < totalDBRowCount
				) {
					fetchNextPage();
				}
			}
		},
		[fetchNextPage, isFetching, totalFetched, totalDBRowCount]
	);

	//scroll to top of table when sorting or filters change
	useEffect(() => {
		if (rowVirtualizerInstanceRef.current) {
			// @ts-ignore FIXME: fix this type error
			rowVirtualizerInstanceRef.current.scrollToIndex(0);
		}
	}, [sorting, columnFilters, globalFilter]);

	//a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
	useEffect(() => {
		fetchMoreOnBottomReached(tableContainerRef.current);
	}, [fetchMoreOnBottomReached]);

	const RowActions = ({ row }: { row: MRT_Row<request_deposit> }) => {
		const o = row.original;
		const networkId = Number(o.mainchain_id);
		const amount = BigNumber.from(o.token_quantity);
		// const tokenAddress = row.original.crossbell_token_address;
		const tokenAddress = CONTRACT_ADDRESS.MIRA[networkIdToNameMapping[networkId]]?.address;
		const tokenName = getTokenName(networkId, tokenAddress);
		const decimals = getTokenDecimals(networkId, tokenName);
		const formattedTokenAmount = formatTokenAmount(amount, decimals);
		const { open } = useDepositModal({
			state: {
				formAmount: formattedTokenAmount,
				requestDepositInfo: {
					transactionHash: o.transaction,
					blockNumber: Number.POSITIVE_INFINITY, // this is only used to calculate confirmation; if a data is in history, it's already confirmed
					networkId: Number(o.mainchain_id),
					depositId: Number(o.deposit_id),
					amount: BigNumber.from(o.token_quantity),
					recipient: o.recipient_address,
				},
			},
		});

		const depositedInLocal = isRequestDepositDepositedButNotIndexed(
			o.transaction
		);

		const isDepositing = depositedInLocal && o.status === "pending";

		return (
			<Button
				size="xs"
				variant={o.status === "pending" ? "outline" : "default"}
				onClick={(e) => {
					e.stopPropagation();
					open();
				}}
				disabled={isDepositing}
			>
				{isDepositing
					? "Processing"
					: "View"}
			</Button>
		);
	};

	return (
		<MantineReactTable
			columns={columns}
			data={list}
			getRowId={(row) => row?.id?.toString()}
			enablePagination={false}
			enableColumnOrdering
			enableRowVirtualization
			manualFiltering
			manualPagination
			manualSorting
			/// TODO: advanced filtering
			enableFilters={false}
			enableGlobalFilter={false}
			enableColumnFilters={false}
			enableSorting={false}
			///
			enableRowActions
			displayColumnDefOptions={{
				"mrt-row-actions": {
					header: "Actions", //change header text
					size: 100, //make actions column wider
				},
			}}
			renderRowActions={({ row }) => <RowActions row={row} />}
			mantineTableContainerProps={{
				ref: tableContainerRef, //get access to the table container element
				sx: { maxHeight: "80vh" }, //give the table a max height
				onScroll: (
					event //add an event listener to the table container element
				) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
			}}
			mantineToolbarAlertBannerProps={
				isError
					? {
							color: "error",
							children: "Error loading data",
					  }
					: undefined
			}
			renderBottomToolbarCustomActions={() => (
				<Text>
					Fetched {totalFetched} of {totalDBRowCount} total rows.
				</Text>
			)}
			onColumnFiltersChange={setColumnFilters}
			onGlobalFilterChange={setGlobalFilter}
			onSortingChange={setSorting}
			state={{
				columnFilters,
				globalFilter,
				isLoading,
				showAlertBanner: isError,
				showProgressBars: isFetching,
				sorting,
			}}
			rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
			rowVirtualizerProps={{ overscan: 10 }}
		/>
	);
}
