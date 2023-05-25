import { useContractRead } from "wagmi";
import { getValidatorContractConfig } from "../config";

/**
 * Get the number of required validators
 */
export function useGetRequiredValidatorNumber(networkId: number) {
  return useContractRead({
    ...getValidatorContractConfig(networkId),
    functionName: "getRequiredNumber",
    chainId: networkId,
  });
}
