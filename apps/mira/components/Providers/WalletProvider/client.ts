import { createClient } from "wagmi";
import { chains, provider } from "./chains";
import { getDefaultClient } from "connectkit";

export const client = createClient(
  getDefaultClient({
    appName: "$MIRA",
    autoConnect: true,
    chains,
    provider,
  })
);
