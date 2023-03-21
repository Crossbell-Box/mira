import {
	MantineProvider,
	createEmotionCache,
	ColorScheme,
	ColorSchemeProvider,
	DefaultMantineColor,
	Tuple,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { getCookie, setCookie } from "cookies-next";
import { AppContext } from "next/app";
import React, { PropsWithChildren, useState } from "react";

export const emotionCache = createEmotionCache({
	key: "mantine",
	prepend: false, // https://github.com/mantinedev/mantine/issues/823#issuecomment-1065833889
});

export const getColorSchemeInServer = (appContext: AppContext) => {
	return (
		(getCookie("mantine-color-scheme", appContext.ctx) as string | undefined) ||
		"light"
	);
};

export default function ThemeProvider(
	props: PropsWithChildren<{
		colorScheme: ColorScheme;
	}>
) {
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useState<ColorScheme>(
		props.colorScheme ?? preferredColorScheme
	);

	const toggleColorScheme = (value?: ColorScheme) => {
		const nextColorScheme =
			value || (colorScheme === "dark" ? "light" : "dark");
		setColorScheme(nextColorScheme);
		// when color scheme is updated save it to cookie
		setCookie("mantine-color-scheme", nextColorScheme, {
			maxAge: 60 * 60 * 24 * 30,
		});
	};

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				withCSSVariables
				withGlobalStyles
				withNormalizeCSS
				emotionCache={emotionCache}
				theme={{
					/** Put your mantine theme override here */
					colorScheme,
					fontFamily: `"Roboto", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
					fontFamilyMonospace: "Monaco, Courier, monospace",
					headings: { fontFamily: "Lexend Deca" },
					white: "#fff",
					black: "#0f1419",
					colors: {
						brand: [
							"#FFF9E9",
							"#FFF0CA",
							"#FFE9B0",
							"#FFE093",
							"#FFD773",
							"#FFCF55", // <-
							"#E2B542",
							"#C09526",
							"#A67E18",
							"#7C5D0C",
						],
					},
					primaryColor: "brand",
				}}
			>
				{props.children}
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

type ExtendedCustomColors = "brand" | DefaultMantineColor;

declare module "@mantine/core" {
	export interface MantineThemeColorsOverride {
		colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
	}
}
