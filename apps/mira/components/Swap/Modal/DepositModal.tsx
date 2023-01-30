import { openModal } from "@mantine/modals";
import Link from "next/link";

export function useDepositModal() {
	const open = () =>
		openModal({
			centered: true,
			title: "Deposit",
			closeOnClickOutside: false,
			size: "xl",
			children: (
				<>
					Great that you are interested in $MIRA. Deposit is invite-only for
					now. Reach out to us on{" "}
					<Link
						href="https://discord.gg/4GCwDsruyj"
						target="_blank"
						rel="noreferrer"
					>
						Discord
					</Link>{" "}
					or <Link href="mailto:crossbell.io">contact@crossbell.io</Link> to get
					an invite.
				</>
			),
		});

	return {
		open,
	};
}
