import { getRootLayout } from "@/components/Layout/RootLayout";
import Swap from "@/components/Swap";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
	return (
		<div className="container mx-auto">
			<Swap />
		</div>
	);
};

Page.getLayout = getRootLayout;

export default Page;
