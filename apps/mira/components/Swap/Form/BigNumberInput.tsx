import { TextInput, TextInputProps } from "@mantine/core";
import TokenSelector, { TokenSelectorProps } from "./TokenSelector";

export default function BigNumberInput({
	value,
	onChange,
	mode,
	...props
}: Omit<TextInputProps, "value" | "onChange"> & {
	value: string | undefined;
	onChange: (value: string) => void;
	mode: TokenSelectorProps["mode"];
}) {
	const valueStr = value?.toString();

	const formatNum = (val: string | undefined): string => {
		if (!val) return "";

		const [int, decimals] = val.split(".");

		let ret = "";
		ret += int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		if (val.indexOf(".") === val.length - 1) {
			ret += ".";
		}
		if (decimals) {
			ret += "." + decimals;
		}

		return ret;
	};

	const isValidNumber = (val: string | undefined): boolean => {
		if (!val) return true;

		const parsed = parseNum(val);

		const [int, decimals] = val.split(".");
		if (decimals && decimals.length > 2) {
			return false;
		}

		return val.trim() !== "" && new RegExp(/^\d*\.?\d*$/).test(parsed);
	};

	const parseNum = (val: string | undefined): string => {
		if (!val) {
			return "";
		}

		try {
			val = val.replace(/\$\s?|(,*)/g, "");
			return val;
		} catch (e) {
			return "";
		}
	};

	const handleValueChange = (val: string) => {
		onChange?.(val);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const evt = event.nativeEvent as InputEvent;
		if (evt.isComposing) {
			return;
		}

		const val = event.target.value;
		const parsed = parseNum(val);

		if (val === "" || val === "-") {
			handleValueChange("");
		} else {
			if (isValidNumber(val)) {
				handleValueChange(parsed);
			}
		}
	};

	const labelTexMapping: Record<typeof mode, string> = {
		depositFrom: "You pay",
		depositTo: "You receive",
		withdrawFrom: "You sell",
		withdrawTo: "You receive",
	};
	const label = labelTexMapping[mode];

	return (
		<TextInput
			classNames={{
				input: "text-2xl font-bold py-6",
				label: "mb-2",
			}}
			label={label}
			inputMode="decimal"
			type="text"
			size="md"
			min={0}
			max={9007199254740991}
			autoCapitalize="off"
			autoComplete="off"
			autoCorrect="off"
			placeholder="0.00"
			value={formatNum(valueStr)}
			onChange={handleChange}
			rightSection={<TokenSelector mode={mode} />}
			rightSectionWidth={130}
			{...props}
		/>
	);
}
