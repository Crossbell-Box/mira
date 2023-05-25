import { Stepper } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect } from "react";
import StepErc20Approval, { useIsAllowanceEnough } from "./StepErc20Approval";
import StepSwitchSidechainNetwork from "./StepSwitchSidechainNetwork";
import { step } from "./store";

export default function ModalApprove({ onDone }: { onDone?: () => void }) {
  const [currentStep, setStep] = useAtom(step);

  const { isLoading: isLoadingAllowance, data: isAllowanceEnough } =
    useIsAllowanceEnough();

  const handleClickNext = () => {
    onDone?.();
  };

  useEffect(() => {
    if (!isLoadingAllowance && currentStep === 0) {
      if (isAllowanceEnough) {
        handleClickNext();
      } else {
        setStep(1);
      }
    }
  }, [currentStep, isLoadingAllowance, isAllowanceEnough]);

  return (
    <div>
      <Stepper active={currentStep} breakpoint="sm">
        <Stepper.Step label="First step" description="Switch network">
          {isLoadingAllowance && <>Checking your allowance...</>}
        </Stepper.Step>
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
