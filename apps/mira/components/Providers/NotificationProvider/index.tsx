import { NotificationsProvider } from "@mantine/notifications";

export default function NotificationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <NotificationsProvider>{children}</NotificationsProvider>;
}
