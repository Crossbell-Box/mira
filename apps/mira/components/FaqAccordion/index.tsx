import { Accordion, Code } from "@mantine/core";
import Link from "next/link";

export default function FaqAccordion() {
  return (
    <Accordion>
      <Accordion.Item value="intro">
        <Accordion.Control>What is $MIRA?</Accordion.Control>
        <Accordion.Panel>
          $MIRA is an ERC20 token on{" "}
          <Link
            href="https://crossbell.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Crossbell chain
          </Link>
          .
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="deposit">
        <Accordion.Control>
          How do I exchange other cryptocurrencies like $USDC for $MIRA?
        </Accordion.Control>
        <Accordion.Panel>
          $MIRA is not listed on any exchanges yet, but you can freely swap it
          on{" "}
          <Link href="https://app.uniswap.org/#/swap?outputCurrency=0x27e56fc93a7c9f7ad220c1206ef03ed303bd648b&chain=polygon">
            Uniswap
          </Link>{" "}
          (currently only on the Polygon network with token address{" "}
          <Code>0x27e56fc93a7c9f7ad220c1206ef03ed303bd648b</Code>).
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="exchange">
        <Accordion.Control>
          How do I exchange $MIRA for other cryptocurrencies like $USDC?
        </Accordion.Control>
        <Accordion.Panel>
          $MIRA is not listed on any exchanges yet, but you can freely swap it
          on{" "}
          <Link href="https://app.uniswap.org/#/swap?inputCurrency=0x27e56fc93a7c9f7ad220c1206ef03ed303bd648b&chain=polygon">
            Uniswap
          </Link>{" "}
          (currently only on the Polygon network with token address{" "}
          <Code>0x27e56fc93a7c9f7ad220c1206ef03ed303bd648b</Code>).
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="problem">
        <Accordion.Control>I&apos;m encountering problems.</Accordion.Control>
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
          or{" "}
          <Link href="mailto:contact@crossbell.io">contact@crossbell.io</Link>.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
