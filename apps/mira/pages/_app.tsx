import NextApp, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import Providers from "@/components/Providers";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { ReactElement, ReactNode } from "react";
import { api } from "@/utils/api";
import { getColorSchemeInServer } from "@/components/Providers/ThemeProvider";
import { ColorScheme } from "@mantine/core";
import "@/styles/globals.css";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
	P,
	IP
> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{
	colorScheme: ColorScheme;
}> & {
	Component: NextPageWithLayout;
};

const App = (props: AppPropsWithLayout) => {
	const { Component, pageProps } = props;
	const { colorScheme } = pageProps;

	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<>
			<Head>
				<title>$MIRA</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<meta
					name="description"
					content="$MIRA is an ERC20 token on Crossbell chain."
				/>
				<link rel="shortcut icon" href="/favicon.ico" />

				<DefaultSeo
					openGraph={{
						type: "website",
						url: "https://mira.crossbell.io/",
						siteName: "$MIRA",
						description: "$MIRA is an ERC20 token on Crossbell chain.",
						images: [
							{
								url: "https://mira.crossbell.io/og.jpg",
								height: 630,
								width: 1200,
								alt: "$MIRA",
							},
						],
					}}
					twitter={{
						handle: "@_Crossbell",
						site: "@_Crossbell",
						cardType: "summary_large_image",
					}}
				/>
			</Head>

			<Providers colorScheme={colorScheme}>
				{getLayout(<Component {...pageProps} />)}
			</Providers>
		</>
	);
};

App.getInitialProps = async (appContext: AppContext) => {
	const appProps = await NextApp.getInitialProps(appContext);
	return {
		...appProps,
		pageProps: {
			...appProps?.pageProps,
			colorScheme: getColorSchemeInServer(appContext),
		},
	};
};

export default api.withTRPC(App);
