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
