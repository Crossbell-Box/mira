import { Stepper } from "@mantine/core";
import { useAtom } from "jotai";
import StepErc20Approval from "./StepErc20Approval";
import StepSwitchSidechainNetwork from "./StepSwitchSidechainNetwork";
import { step } from "./store";

export default function ModalApprove({ onDone }: { onDone?: () => void }) {
	const [currentStep] = useAtom(step);

	const handleClickNext = () => {
		onDone?.();
	};

	return (
		<div>
			<Stepper active={currentStep} breakpoint="sm">
				<Stepper.Step label="First step" description="Switch network">
					<StepSwitchSidechainNetwork />
				</Stepper.Step>
				<Stepper.Step label="Second step" description="Approve token">
					<StepErc20Approval onClickNext={handleClickNext} />
				</Stepper.Step>
			</Stepper>
		</div>
	);
}
