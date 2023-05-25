import { BigNumber } from "ethers";
import { atomWithReset } from "jotai/utils";

export const step = atomWithReset(0);

export const requestDepositInfo = atomWithReset({
  depositId: 0,
  networkId: 0,
  transactionHash: "",
  blockNumber: 0,
  recipient: "",
  amount: BigNumber.from(0),
});

/// used to prevent duplicate deposit

const DEPOSIT_TX_HASH_KEY = "request-deposit-tx-hash";
export function isRequestDepositDepositedButNotIndexed(
  requestDepositTxHash: string
) {
  const txHashes = JSON.parse(
    globalThis.localStorage?.getItem(DEPOSIT_TX_HASH_KEY) || "[]"
  );
  return txHashes.includes(requestDepositTxHash);
}
