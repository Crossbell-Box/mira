import JotaiProvider from "./JotaiProvider";
import ModalProvider from "./ModalProvider";
import MotionProvider from "./MotionProvider";
import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";
import WalletProvider from "./WalletProvider";

export default function Providers({ children }: React.PropsWithChildren) {
	return (
		<ThemeProvider>
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
