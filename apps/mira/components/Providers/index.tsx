import { ColorScheme } from "@mantine/core";
import JotaiProvider from "./JotaiProvider";
import ModalProvider from "./ModalProvider";
import MotionProvider from "./MotionProvider";
import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";
import WalletProvider from "./WalletProvider";

export default function Providers({
  children,
  colorScheme,
}: React.PropsWithChildren<{
  colorScheme: ColorScheme;
}>) {
  return (
    <ThemeProvider colorScheme={colorScheme}>
      <WalletProvider>
        <JotaiProvider>
          <MotionProvider>
            <ModalProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </ModalProvider>
          </MotionProvider>
        </JotaiProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}
