import { NIL_ADDRESS } from "@/utils/ethers/constants";
import { getContractAddress } from "@crossbell/bridge-sdk";
import { WithdrawTokenName } from "@crossbell/bridge-sdk/src/contract/type";
import { BigNumber } from "ethers";
import {
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
} from "wagmi";
import { handleContractError } from "../base";
import { getMainchainGatewayContractConfig } from "../config";

/**
 * Get the daily withdrawal quota of the token.
 *
 * You can still withdraw more than this value, but the withdrawal will not be able
 * to be claimed until the next day or the admins manually unlock it.
 */
export function useGetDailyWithdrawalMaxQuota(
	networkId: number,
	tokenName: WithdrawTokenName = "MIRA"
) {
	return useContractRead({
		...getMainchainGatewayContractConfig(networkId),
		functionName: "getDailyWithdrawalMaxQuota",
		args: [getContractAddress(networkId, tokenName)],
		chainId: networkId,
	});
}

/**
 * Get the remaining daily withdrawal quota of the token.
 */
export function useGetDailyWithdrawalRemainingQuota(
	networkId: number,
	tokenName: WithdrawTokenName = "MIRA"
) {
	return useContractRead({
		...getMainchainGatewayContractConfig(networkId),
		functionName: "getDailyWithdrawalRemainingQuota",
		args: [getContractAddress(networkId, tokenName)],
		chainId: networkId,
	});
}

/**
 * You can get the parameters from `useGetWithdrawalEntry` and `useGetWithdrawalSignature`.
 */
export function useWithdraw(
	targetNetworkId: number,
	withdrawalId: number,
	recipient: `0x${string}` = NIL_ADDRESS,
	tokenAddress: `0x${string}` = NIL_ADDRESS,
	amount: BigNumber = BigNumber.from(0),
	fee: BigNumber = BigNumber.from(0),
	signatures: {
		v: number;
		r: `0x${string}`;
		s: `0x${string}`;
	}[] = [],
	{
		enabled = true,
		onOldWithdrawal = () => {},
		onSuccess = () => {},
	}: {
		enabled?: boolean;
		onOldWithdrawal?: () => void;
		onSuccess?: () => void;
	} = {}
) {
	const { config, error: prepareError } = usePrepareContractWrite({
		...getMainchainGatewayContractConfig(targetNetworkId),
		functionName: "withdraw",
		args: [
			BigNumber.from(targetNetworkId),
			BigNumber.from(withdrawalId),
			recipient,
			tokenAddress,
			amount,
			BigNumber.from(fee),
			signatures,
		],
		chainId: targetNetworkId,
		onError: (e) => {
			if (
				// @ts-ignore
				e.error.data.originalError?.message ===
				"execution reverted: NotNewWithdrawal"
			) {
				onOldWithdrawal();
			} else {
				handleContractError(e);
			}
		},
		enabled: signatures.length > 0 && enabled,
	});

	const contract = useContractWrite({
		...config,
		onSuccess: () => {
			onSuccess?.();
		},
	});

	return { ...contract, prepareError };
}
