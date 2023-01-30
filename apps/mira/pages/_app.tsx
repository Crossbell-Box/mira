import { AppProps } from "next/app";
import Head from "next/head";
import Providers from "@/components/Providers";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import "@/styles/globals.css";
import { api } from "@/utils/api";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
	P,
	IP
> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const App = (props: AppPropsWithLayout) => {
	const { Component, pageProps } = props;

	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<>
			<Head>
				<title>$MIRA</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>

			<Providers>{getLayout(<Component {...pageProps} />)}</Providers>
		</>
	);
};

export default api.withTRPC(App);
