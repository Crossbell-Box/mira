import FaqAccordion from "@/components/FaqAccordion";
import { getRootLayout } from "@/components/Layout/RootLayout";
import PendingAlert from "@/components/PendingAlert";
import Swap from "@/components/Swap";
import { Stack } from "@mantine/core";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
	return (
		<Stack className="container mx-auto">
			<Swap />

			<PendingAlert />

			<FaqAccordion />
		</Stack>
	);
};

Page.getLayout = getRootLayout;

export default Page;
