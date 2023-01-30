import { Stepper } from "@mantine/core";
import { closeModal, openModal } from "@mantine/modals";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import StepClaim from "./StepClaim";
import StepComplete from "./StepComplete";
import StepErc20Approval from "./StepErc20Approval";
import StepRequestWithdrawal from "./StepRequestWithdrawal";
import StepSwitchMainchainNetwork from "./StepSwitchMainchainNetwork";
import StepSwitchSidechainNetwork from "./StepSwitchSidechainNetwork";
import { requestWithdrawalInfo, step } from "./store";

export function useWithdrawModal() {
	const id = "withdraw-modal";

	const [_, setStep] = useAtom(step);
	const resetStep = useResetAtom(step);
	const resetRequestWithdrawalInfo = useResetAtom(requestWithdrawalInfo);

	const reset = () => {
		resetStep();
		resetRequestWithdrawalInfo();
	};

	const open = () =>
		openModal({
			modalId: id,
			centered: true,
			closeOnClickOutside: false,
			title: "Withdraw",
			size: "xl",
			children: <WithdrawModalContent />,
			onClose: () => {
				setTimeout(() => {
					reset();
				}, 100);
			},
		});

	const close = () => {
		reset();
		closeModal(id);
	};

	const nextStep = () => {
		setStep((v) => v + 1);
	};

	return {
		open,
		close,
		nextStep,
	};
}

function WithdrawModalContent() {
	const [currentStep] = useAtom(step);

	return (
		<div>
			<Stepper active={currentStep} breakpoint="sm">
				<Stepper.Step label="First step" description="Switch network">
					<StepSwitchSidechainNetwork />
				</Stepper.Step>
				<Stepper.Step label="Second step" description="Approve token">
					<StepErc20Approval />
				</Stepper.Step>
				<Stepper.Step label="Third step" description="Request withdrawal">
					<StepRequestWithdrawal />
				</Stepper.Step>
				<Stepper.Step label="Fifth step" description="Switch network">
					<StepSwitchMainchainNetwork />
				</Stepper.Step>
				<Stepper.Step label="Final step" description="Claim">
					<StepClaim />
				</Stepper.Step>
				<Stepper.Completed>
					<StepComplete />
				</Stepper.Completed>
			</Stepper>
		</div>
	);
}
