import { Stepper } from "@mantine/core";
import { useAtom } from "jotai";
import StepClaim from "./StepClaim";
import StepComplete from "./StepComplete";
import StepErc20Approval from "./StepErc20Approval";
import StepRequestDeposit from "./StepRequestDeposit";
import StepSwitchMainchainNetwork from "./StepSwitchMainchainNetwork";
import StepSwitchSidechainNetwork from "./StepSwitchSidechainNetwork";
import { step } from "./store";

export default function ModalDeposit() {
  const [currentStep] = useAtom(step);

  return (
    <div>
      <Stepper active={currentStep} breakpoint="sm">
        <Stepper.Step label="First step" description="Switch network">
          <StepSwitchMainchainNetwork />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Approve token">
          <StepErc20Approval />
        </Stepper.Step>
        <Stepper.Step label="Third step" description="Request swaps">
          <StepRequestDeposit />
        </Stepper.Step>
        <Stepper.Step label="Fifth step" description="Switch network">
          <StepSwitchSidechainNetwork />
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
