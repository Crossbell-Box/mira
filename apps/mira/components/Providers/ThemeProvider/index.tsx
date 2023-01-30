import {
	MantineProvider,
	createEmotionCache,
	ColorScheme,
	ColorSchemeProvider,
	DefaultMantineColor,
	Tuple,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import React, { PropsWithChildren } from "react";

export const emotionCache = createEmotionCache({
	key: "mantine",
	prepend: true, // https://github.com/mantinedev/mantine/issues/823#issuecomment-1065833889
});

export default function ThemeProvider({ children }: PropsWithChildren) {
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: "mantine-color-scheme",
		defaultValue: preferredColorScheme,
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

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
				{children}
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
