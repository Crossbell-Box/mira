import { getContractAddress } from "@crossbell/bridge-sdk";
import { DepositTokenName } from "@crossbell/bridge-sdk/src/contract/type";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { getCrossbellGatewayContractConfig } from "../config";
import { BigNumber } from "ethers";
import { handleContractError } from "../base";
import { crossbellChain } from "@/components/Providers/WalletProvider/chains";

/**
 * Get the daily withdrawal quota of the token.
 *
 * You can still withdraw more than this value, but the withdrawal will not be able
 * to be claimed until the next day or the admins manually unlock it.
 */
export function useRequestWithdrawal(
  targetNetworkId: number,
  recipient: `0x${string}`,
  originalTokenName: DepositTokenName,
  amount: BigNumber,
  fee: BigNumber
) {
  const { config, error: prepareError } = usePrepareContractWrite({
    ...getCrossbellGatewayContractConfig(),
    functionName: "requestWithdrawal",
    args: [
      BigNumber.from(targetNetworkId),
      recipient,
      getContractAddress(crossbellChain.id, originalTokenName),
      amount,
      BigNumber.from(fee),
    ],
    chainId: crossbellChain.id,
    onError: handleContractError,
  });

  const contract = useContractWrite(config);

  return { ...contract, prepareError };
}

/**
 * Get withdrawal entry used to claim the withdrawal on the mainchain.
 */
export function useGetWithdrawalEntry(
  targetNetworkId: number,
  withdrawalId: number
) {
  const contract = useContractRead({
    ...getCrossbellGatewayContractConfig(),
    functionName: "getWithdrawalEntry",
    args: [BigNumber.from(targetNetworkId), BigNumber.from(withdrawalId)],
    chainId: crossbellChain.id,
    onError: handleContractError,
  });

  return contract;
}

/**
 * Get withdrawal signature used to claim the withdrawal on the mainchain.
 */
export function useGetWithdrawalSignature(
  targetNetworkId: number,
  withdrawalId: number,
  requiredNumber: number
) {
  const contract = useContractRead({
    ...getCrossbellGatewayContractConfig(),
    functionName: "getWithdrawalSignatures",
    args: [BigNumber.from(targetNetworkId), BigNumber.from(withdrawalId)],
    chainId: crossbellChain.id,
    onError: handleContractError,
    // cacheOnBlock: true,
    watch: true,
    onSuccess: async (data) => {
      if (data.signers.length < requiredNumber) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds
        contract.refetch();
      }
    },
  });

  return contract;
}
