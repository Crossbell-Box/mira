import { BigNumber, BigNumberish, ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./address";
import { networkIdToNameMapping } from "./network";
import { TokenName } from "./type";

export function getTokenDecimals(
  networkId: number,
  tokenNameOrAddress: string
): number;
export function getTokenDecimals(
  networkId: number,
  tokenNameOrAddress: TokenName
): number;
export function getTokenDecimals(
  networkId: number,
  tokenNameOrAddress: TokenName | string
): number {
  let tokenName: TokenName | null;
  if (tokenNameOrAddress.startsWith("0x")) {
    tokenName = getTokenName(networkId, tokenNameOrAddress);
  } else {
    tokenName = tokenNameOrAddress as TokenName;
  }

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
  try {
    return ethers.utils.formatUnits(amount, decimals);
  } catch (e) {
    return "0";
  }
}

/**
 * Parse the token amount to a BigNumber.
 * @param amount The amount (human readable unit) to parse. (e.g. "1.0")
 * @param decimals The number of decimals of the token.
 * @returns The parsed amount.
 * @example parseTokenAmount("1.0", 18) => BigNumber(1000000000000000000)
 */
export function parseTokenAmount(amount: string, decimals: number): BigNumber {
  try {
    return ethers.utils.parseUnits(amount, decimals);
  } catch (e) {
    return BigNumber.from(0);
  }
}

export function getTokenName(
  networkId: number,
  tokenAddress: string
): TokenName {
  const networkName = networkIdToNameMapping[networkId];
  if (!networkName) {
    throw new Error(`Unknown network id: ${networkId}`);
  }

  for (const tokenName in CONTRACT_ADDRESS) {
    // @ts-ignore
    const token = CONTRACT_ADDRESS[tokenName];
    if (networkName in token) {
      // @ts-ignore
      if (token[networkName]?.address === tokenAddress) {
        return tokenName as TokenName;
      }
    }
  }

  throw new Error(`Unknown token address: ${tokenAddress}`);
}
