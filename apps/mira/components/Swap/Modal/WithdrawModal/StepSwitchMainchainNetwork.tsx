import { getNetworkNameById } from "@/utils/ethers";
import { Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useWithdrawModal } from ".";
import { formMainchainNetworkIdAtom } from "../../store";
import StepSwitchNetwork from "../common/StepSwitchNetwork";

export default function StepSwitchMainchainNetwork() {
	const [networkId] = useAtom(formMainchainNetworkIdAtom);
	const NetworkName = (
		<Text fw="bold" inline span>
			{getNetworkNameById(networkId)}
		</Text>
	);

	const { nextStep } = useWithdrawModal();

	return (
		<StepSwitchNetwork
			targetNetworkId={networkId}
			onClickNext={nextStep}
			description={
				<>
					To withdraw $USDC on the {NetworkName} network, you need to claim it.
				</>
			}
		/>
	);
}
