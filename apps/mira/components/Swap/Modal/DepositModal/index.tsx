import { closeModal, openModal } from "@mantine/modals";
import { step, requestDepositInfo } from "./store";
import { formAmountAtom } from "@/components/Swap/store";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import ModalDeposit from "./ModalDeposit";
import ModalApprove from "./ModalApprove";

export function useDepositModal({
  state = {},
  checkAllowance,
}: {
  state?: {
    step?: ReturnType<(typeof step)["read"]>;
    formAmount?: ReturnType<(typeof formAmountAtom)["read"]>;
    requestDepositInfo?: ReturnType<(typeof requestDepositInfo)["read"]>;
  };
  checkAllowance?: boolean;
} = {}) {
  const [_, setStep] = useAtom(step);
  const [__, setRequestDepositInfo] = useAtom(requestDepositInfo);
  const [____, setFormAmount] = useAtom(formAmountAtom);
  const resetStep = useResetAtom(step);
  const resetRequestDepositInfo = useResetAtom(requestDepositInfo);

  const resetState = () => {
    resetStep();
    resetRequestDepositInfo();
  };

  const initState = () => {
    if (state.formAmount) {
      setFormAmount(state.formAmount);
      setStep(0);
    }
    if (state.requestDepositInfo?.transactionHash) {
      setRequestDepositInfo(state.requestDepositInfo);
      setStep(3);
    }
    if (state.step) {
      setStep(state.step);
    }
  };

  const depositModalId = "deposit-modal";
  const openDepositModal = () => {
    openModal({
      modalId: depositModalId,
      centered: true,
      closeOnClickOutside: false,
      title: "Swap In",
      size: "xl",
      children: <ModalDeposit />,
      onClose: () => {
        setTimeout(() => {
          resetState();
        }, 100);
      },
    });
  };

  const approveModalId = "approve-modal";
  const openApproveModal = () => {
    let shouldResetState = true;
    openModal({
      modalId: approveModalId,
      centered: true,
      closeOnClickOutside: false,
      title: "Approve",
      size: "xl",
      children: (
        <ModalApprove
          onDone={() => {
            checkAllowance = false;
            shouldResetState = false;
            closeApproveModal();
            open();
          }}
        />
      ),
      onClose: () => {
        if (shouldResetState) {
          setTimeout(() => {
            resetState();
          }, 100);
        }
      },
    });
  };

  const open = () => {
    initState();

    if (checkAllowance) {
      setStep(0);
      openApproveModal();
      return;
    }

    openDepositModal();
  };

  const close = () => {
    resetState();
    closeModal(depositModalId);
  };

  const closeApproveModal = () => {
    closeModal(approveModalId);
  };

  const nextStep = () => {
    setStep((v) => v + 1);
  };

  return {
    open,
    close,
    nextStep,
    closeApproveModal,
  };
}
