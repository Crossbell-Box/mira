import {
	getNetworkNameById,
	getTxScanUrl,
	truncateAddress,
} from "@/utils/ethers";
import {
	formatTokenAmount,
	getTokenDecimals,
	getTokenName,
} from "@crossbell/bridge-sdk";
import { Badge, Tooltip, Text } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

export function renderStatusCell({
	renderedCellValue,
}: {
	renderedCellValue: ReactNode;
}) {
	const status = renderedCellValue?.toString();
	return (
		<Badge color={status === "pending" ? "blue" : "green"}>{status}</Badge>
	);
}

export function renderChainIdAndName({
	renderedCellValue,
}: {
	renderedCellValue: ReactNode;
}) {
	const networkId = Number(renderedCellValue?.toString());
	const networkName = getNetworkNameById(networkId);
	return (
		<>
			{networkId} ({networkName})
		</>
	);
}

export function renderBigNumberId({
	renderedCellValue,
}: {
	renderedCellValue: ReactNode;
}) {
	return <>{renderedCellValue?.toString()}</>;
}

export function renderTxUrl({
	networkId,
	txHash,
}: {
	networkId: number;
	txHash: string;
}) {
	if (!txHash) {
		return <>N/A</>;
	}
	const url = getTxScanUrl(networkId, txHash);
	const TxText = (
		<Tooltip label={txHash} withinPortal>
			<Text>{truncateAddress(txHash)}</Text>
		</Tooltip>
	);
	if (!url) return TxText;
	return (
		<Link
			href={url}
			target="_blank"
			rel="noreferrer noopener"
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			{TxText}
		</Link>
	);
}

export function renderAmount({
	renderedCellValue,
	networkId,
	tokenAddress,
}: {
	renderedCellValue: ReactNode;
	networkId: number;
	tokenAddress: string;
}) {
	const amount = renderedCellValue?.toString() ?? "";
	const tokenName = getTokenName(networkId, tokenAddress);
	const decimals = getTokenDecimals(networkId, tokenName);
	return (
		<>
			{formatTokenAmount(amount, decimals)} {tokenName}
		</>
	);
}
