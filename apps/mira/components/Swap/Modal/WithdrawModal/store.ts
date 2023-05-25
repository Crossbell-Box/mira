import { BigNumber } from "ethers";
import { atomWithReset } from "jotai/utils";

export const step = atomWithReset(0);

export const requestWithdrawalInfo = atomWithReset({
  withdrawalId: 0,
  networkId: 0,
  transactionHash: "",
  blockNumber: 0,
  recipient: "",
  amount: BigNumber.from(0),
  fee: BigNumber.from(0),
});

export const withdrawalInfo = atomWithReset({
  transactionHash: "",
});

/// used to prevent duplicate withdrawal

const WITHDRAWAL_TX_HASH_KEY = "request-withdrawal-tx-hash";
export function isRequestWithdrawalWithdrawnButNotIndexed(
  requestWithdrawalTxHash: string
) {
  const txHashes = JSON.parse(
    globalThis.localStorage?.getItem(WITHDRAWAL_TX_HASH_KEY) || "[]"
  );
  return txHashes.includes(requestWithdrawalTxHash);
}
export function saveRequestWithdrawalTxHashInLocalStorage(
  requestWithdrawalTxHash: string
) {
  const txHashes = JSON.parse(
    globalThis.localStorage?.getItem(WITHDRAWAL_TX_HASH_KEY) || "[]"
  );
  txHashes.push(requestWithdrawalTxHash);
  globalThis.localStorage?.setItem(
    WITHDRAWAL_TX_HASH_KEY,
    JSON.stringify(txHashes)
  );
}
