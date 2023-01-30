import { getNetworkNameById } from "@/utils/ethers";
import { Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useWithdrawModal } from ".";
import { formSidechainNetworkIdAtom } from "../../store";
import StepSwitchNetwork from "../common/StepSwitchNetwork";

export default function StepSwitchSidechainNetwork() {
	const [networkId] = useAtom(formSidechainNetworkIdAtom);
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
					To sell $MIRA on the {NetworkName} network, you need to approve the
					$MIRA token for the withdraw contract.
				</>
			}
		/>
	);
}
