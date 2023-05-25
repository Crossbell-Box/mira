import dynamic from "next/dynamic";
const ConnectKitButton = dynamic(
  () => import("connectkit").then((mod) => mod.ConnectKitButton),
  { ssr: false }
);

export default function ConnectButton() {
  return <ConnectKitButton />;
}
