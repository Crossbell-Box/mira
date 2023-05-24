import { getContractAddress } from "@crossbell/bridge-sdk";
import { DepositTokenName } from "@crossbell/bridge-sdk/src/contract/type";
import {
	useContractWrite,
	usePrepareContractWrite,
} from "wagmi";
import { getMainchainGatewayContractConfig } from "../config";
import { BigNumber } from "ethers";
import { handleContractError } from "../base";
import { crossbellChain } from "@/components/Providers/WalletProvider/chains";

/**
 * Get the daily deposit quota of the token.
 *
 * You can still withdraw more than this value, but the deposit will not be able
 * to be claimed until the next day or the admins manually unlock it.
 */
export function useRequestDeposit(
	targetNetworkId: number,
	recipient: `0x${string}`,
	originalTokenName: DepositTokenName,
	amount: BigNumber
) {
	const { config, error: prepareError } = usePrepareContractWrite({
		...getMainchainGatewayContractConfig(targetNetworkId),
		functionName: "requestDeposit",
		args: [
			recipient,
			getContractAddress(targetNetworkId, originalTokenName),
			amount,
		],
		chainId: targetNetworkId,
		onError: handleContractError,
	});

	const contract = useContractWrite(config);

	return { ...contract, prepareError };
}
