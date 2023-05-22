import { getNetworkNameById } from "@/utils/ethers";
import { Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useDepositModal } from ".";
import { formMainchainNetworkIdAtom } from "../../store";
import StepSwitchNetwork from "../common/StepSwitchNetwork";

export default function StepSwitchMainchainNetwork() {
	const [networkId] = useAtom(formMainchainNetworkIdAtom);
	const NetworkName = (
		<Text fw="bold" inline span>
			{getNetworkNameById(networkId)}
		</Text>
	);

	const { nextStep } = useDepositModal();

	return (
		<StepSwitchNetwork
			targetNetworkId={networkId}
			onClickNext={nextStep}
			description={
				<>
					To swap in $MIRA from the {NetworkName} network, you need to approve
					the token for the deposit contract.
				</>
			}
		/>
	);
}
