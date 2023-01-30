import { BigNumber, BigNumberish, ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./address";
import { networkIdToNameMapping } from "./network";
import { TokenName } from "./type";

export function getTokenDecimals(
	networkId: number,
	tokenName: TokenName
): number {
	const networkName = networkIdToNameMapping[networkId];
	if (!networkName) {
		throw new Error(`Unknown network id: ${networkId}`);
	}

	const token = CONTRACT_ADDRESS[tokenName];

	if (!token) {
		throw new Error(`Unknown token name: ${tokenName}`);
	}

	if (networkName in token) {
		// @ts-ignore
		return token[networkName]?.decimals;
	} else {
		throw new Error(
			`Token ${tokenName} is not deployed on network ${networkName}`
		);
	}
}

/**
 * Format the token amount to a human readable string.
 * @param amount The amount (minimal unit) to format.
 * @param decimals The number of decimals of the token.
 * @returns The formatted amount.
 * @example formatTokenAmount(1000000000000000000, 18) => "1.0"
 */
export function formatTokenAmount(
	amount: BigNumberish,
	decimals: number
): string {
	return ethers.utils.formatUnits(amount, decimals);
}

/**
 * Parse the token amount to a BigNumber.
 * @param amount The amount (human readable unit) to parse. (e.g. "1.0")
 * @param decimals The number of decimals of the token.
 * @returns The parsed amount.
 * @example parseTokenAmount("1.0", 18) => BigNumber(1000000000000000000)
 */
export function parseTokenAmount(amount: string, decimals: number): BigNumber {
	return ethers.utils.parseUnits(amount, decimals);
}
