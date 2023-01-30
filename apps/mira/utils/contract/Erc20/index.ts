import { DepositTokenName } from "@crossbell/bridge-sdk/src/contract/type";
import { BigNumber } from "ethers";
import {
	usePrepareContractWrite,
	useContractWrite,
	useContractRead,
} from "wagmi";
import { handleContractError } from "../base";
import {
	getErc20ContractConfig,
	getCrossbellGatewayContractConfig,
} from "../config";

/**
 * Approve the token on this network to MainchainGateway to withdraw the amount.
 */
export function useTokenApprove(
	tokenNetworkId: number,
	tokenName: DepositTokenName,
	amount: BigNumber
) {
	const { config, error: prepareError } = usePrepareContractWrite({
		...getErc20ContractConfig(tokenNetworkId, tokenName),
		functionName: "approve",
		args: [getCrossbellGatewayContractConfig().address, amount],
		chainId: tokenNetworkId,
		onError: handleContractError,
	});

	const contract = useContractWrite(config);

	return { ...contract, prepareError };
}

/**
 * Get the allowance of the token on this network to MainchainGateway.
 */
export function useTokenAllowance(
	tokenNetworkId: number,
	tokenName: DepositTokenName,
	owner: `0x${string}`
) {
	const contract = useContractRead({
		...getErc20ContractConfig(tokenNetworkId, tokenName),
		functionName: "allowance",
		args: [owner, getCrossbellGatewayContractConfig().address],
		chainId: tokenNetworkId,
		cacheOnBlock: true,
	});

	return contract;
}

/**
 * Get the balance of the token on this network.
 */
export function useTokenBalance(
	tokenNetworkId: number,
	tokenName: DepositTokenName,
	owner: `0x${string}`
) {
	const contract = useContractRead({
		...getErc20ContractConfig(tokenNetworkId, tokenName),
		functionName: "balanceOf",
		args: [owner],
		chainId: tokenNetworkId,
		cacheOnBlock: true,
	});

	return contract;
}
