import { crossbellChain } from "@/components/Providers/WalletProvider/chains";
import {
  CrossbellGatewayAbiFactory,
  getContractAddress,
  MainchainGatewayAbiFactory,
  ValidatorAbiFactory,
} from "@crossbell/bridge-sdk";
import { TokenName } from "@crossbell/bridge-sdk/src/contract/type";
import { erc20ABI } from "wagmi";

export function getMainchainGatewayContractConfig(networkId: number) {
  return {
    address: getContractAddress(networkId, "MainchainGateway"),
    abi: MainchainGatewayAbiFactory.abi,
  };
}

export function getCrossbellGatewayContractConfig() {
  return {
    address: getContractAddress(crossbellChain.id, "CrossbellGateway"),
    abi: CrossbellGatewayAbiFactory.abi,
  };
}

export function getErc20ContractConfig(
  networkId: number,
  tokenName: TokenName
) {
  return {
    address: getContractAddress(networkId, tokenName),
    abi: erc20ABI,
  };
}

export function getValidatorContractConfig(networkId: number) {
  return {
    address: getContractAddress(networkId, "Validator"),
    abi: ValidatorAbiFactory.abi,
  };
}
