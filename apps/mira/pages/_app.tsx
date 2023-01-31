import { AppProps } from "next/app";
import Head from "next/head";
import Providers from "@/components/Providers";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { ReactElement, ReactNode } from "react";
import { api } from "@/utils/api";
import "@/styles/globals.css";

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
				<meta
					name="description"
					content="$MIRA is a cryptocurrency, a decentralized stablecoin that is backed by Crossbell."
				/>
				<link rel="shortcut icon" href="/favicon.ico" />

				<DefaultSeo
					openGraph={{
						type: "website",
						url: "https://mira.crossbell.io/",
						siteName: "$MIRA",
						description:
							"$MIRA is a cryptocurrency, a decentralized stablecoin that is backed by Crossbell.",
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

			<Providers>{getLayout(<Component {...pageProps} />)}</Providers>
		</>
	);
};

export default api.withTRPC(App);
