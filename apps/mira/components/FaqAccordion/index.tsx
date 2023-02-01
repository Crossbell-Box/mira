import { Accordion } from "@mantine/core";
import Link from "next/link";

export default function FaqAccordion() {
	return (
		<Accordion>
			<Accordion.Item value="intro">
				<Accordion.Control>What is $MIRA</Accordion.Control>
				<Accordion.Panel>
					$MIRA is a cryptocurrency, a decentralized stablecoin that is backed
					by{" "}
					<Link
						href="https://crossbell.io"
						target="_blank"
						rel="noopener noreferrer"
					>
						Crossbell
					</Link>
					.
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="buy">
				<Accordion.Control>How to buy $MIRA</Accordion.Control>
				<Accordion.Panel>
					$MIRA Deposit is not available yet. We are inviting a few users to
					test the deposit feature. If you are interested, please contact us on{" "}
					<Link
						href="https://discord.gg/4GCwDsruyj"
						target="_blank"
						rel="noreferrer"
					>
						Discord
					</Link>{" "}
					or <Link href="mailto:crossbell.io">contact@crossbell.io</Link>
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="sell">
				<Accordion.Control>How to sell $MIRA</Accordion.Control>
				<Accordion.Panel>
					$MIRA is a stablecoin, so you can sell it at any time at this website.
				</Accordion.Panel>
			</Accordion.Item>

			<Accordion.Item value="problem">
				<Accordion.Control>I'm encountering problems</Accordion.Control>
				<Accordion.Panel>
					If you have any problems while operating the website, please contact
					us on{" "}
					<Link
						href="https://discord.gg/4GCwDsruyj"
						target="_blank"
						rel="noreferrer"
					>
						Discord
					</Link>{" "}
					or <Link href="mailto:crossbell.io">contact@crossbell.io</Link>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	);
}
