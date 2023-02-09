import { closeModal, openModal } from "@mantine/modals";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { formAmountAtom } from "../../store";
import { requestWithdrawalInfo, step, withdrawalInfo } from "./store";
import ModalWithdraw from "./ModalWithdraw";
import ModalApprove from "./ModalApprove";

export function useWithdrawModal({
	state = {},
	checkAllowance,
}: {
	state?: {
		step?: ReturnType<(typeof step)["read"]>;
		formAmount?: ReturnType<(typeof formAmountAtom)["read"]>;
		requestWithdrawalInfo?: ReturnType<(typeof requestWithdrawalInfo)["read"]>;
		withdrawalInfo?: ReturnType<(typeof withdrawalInfo)["read"]>;
	};
	checkAllowance?: boolean;
} = {}) {
	const [_, setStep] = useAtom(step);
	const [__, setRequestWithdrawalInfo] = useAtom(requestWithdrawalInfo);
	const [___, setWithdrawalInfo] = useAtom(withdrawalInfo);
	const [____, setFormAmount] = useAtom(formAmountAtom);
	const resetStep = useResetAtom(step);
	const resetRequestWithdrawalInfo = useResetAtom(requestWithdrawalInfo);
	const resetWithdrawalInfo = useResetAtom(withdrawalInfo);

	const resetState = () => {
		resetStep();
		resetRequestWithdrawalInfo();
		resetWithdrawalInfo();
	};

	const initState = () => {
		if (state.formAmount) {
			setFormAmount(state.formAmount);
			setStep(0);
		}
		if (state.requestWithdrawalInfo?.transactionHash) {
			setRequestWithdrawalInfo(state.requestWithdrawalInfo);
			setStep(3);
		}
		if (state.withdrawalInfo?.transactionHash) {
			setWithdrawalInfo(state.withdrawalInfo);
			setStep(5);
		}
		if (state.step) {
			setStep(state.step);
		}
	};

	const withdrawModalId = "withdraw-modal";
	const openWithdrawModal = () => {
		openModal({
			modalId: withdrawModalId,
			centered: true,
			closeOnClickOutside: false,
			title: "Swap Out",
			size: "xl",
			children: <ModalWithdraw />,
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

		openWithdrawModal();
	};

	const close = () => {
		resetState();
		closeModal(withdrawModalId);
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
