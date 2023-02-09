import { Accordion } from "@mantine/core";
import Link from "next/link";

export default function FaqAccordion() {
	return (
		<Accordion>
			<Accordion.Item value="intro">
				<Accordion.Control>What is $MIRA</Accordion.Control>
				<Accordion.Panel>
					$MIRA is a cryptocurrency that is backed by{" "}
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

			<Accordion.Item value="problem">
				<Accordion.Control>I&apos;m encountering problems</Accordion.Control>
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
