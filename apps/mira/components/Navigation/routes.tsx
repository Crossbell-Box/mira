import { IconHistory, IconHome } from "@tabler/icons-react";
import { useIsMounted } from "@/utils/ssr";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type Route = {
	path: string;
	name: string;
	icon: React.ReactElement;
};

export const routes: Record<string, Route> = {
	home: { path: "/", name: "Home", icon: <IconHome /> },
	history: { path: "/history", name: "History", icon: <IconHistory /> },
};

export function useRoutes() {
	const [routeArr, setRouteArr] = useState<Route[]>([]);

	const { address } = useAccount();

	const isMounted = useIsMounted();

	useEffect(() => {
		// home
		setRouteArr((prev) => [...prev, routes.home]);

		// history
		if (address) {
			setRouteArr((prev) => [...prev, routes.history]);
		}

		return () => {
			setRouteArr([]);
		};
	}, [address]);

	const { route } = useRouter();

	return { routes: routeArr, currentRoutePath: route };
}
