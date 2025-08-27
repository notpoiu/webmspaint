import React from "react";
import { ButtonBase } from "./Button";
import Label from "./Label";
import { useUIState } from "../uiState";

/**
 * Labeled text input component that can optionally sync with a global UI state.
 *
 * Renders a label and a controlled text input wrapped in ButtonBase. If `stateKey` is provided,
 * the input initializes from and keeps synchronized with `state[stateKey]` (string). User edits
 * update local state and, when `stateKey` is set, propagate to the global UI state via `setState`.
 *
 * @param text - Label text shown above the input
 * @param value - Fallback initial value used when no `stateKey` or when the referenced state is undefined
 * @param placeholder - Placeholder text displayed inside the input
 * @param stateKey - Optional key into the global UI state; when provided the component reads/writes the value at this key
 * @returns The Input component JSX
 */
export default function Input({
	text,
	value,
	placeholder,
	stateKey,
}: {
	text: string;
	value: string;
	placeholder: string;
	stateKey?: string;
}) {
	const { state, setState } = useUIState();
	const [local, setLocal] = React.useState<string>(
		(stateKey ? (state[stateKey] as string | undefined) : undefined) ?? value
	);

	React.useEffect(() => {
		if (!stateKey) return;
		const v = state[stateKey];
		if (typeof v === "string") setLocal(v);
	}, [state, stateKey]);

	return (
		<div className="flex flex-col gap-1">
			<Label className="text-white opacity-100">{text}</Label>

			<ButtonBase
				text={
					<input
						name="input"
						type="text"
						className="w-full h-full text-white opacity-100 ml-1 text-xs select-none bg-transparent outline-none"
						value={local}
						placeholder={placeholder}
						onChange={(e) => {
							const next = e.target.value;
							setLocal(next);
							if (stateKey) setState(stateKey, next);
						}}
					/>
				}
				className="text-left text-white opacity-100 m-1 text-xs"
				containerClassName="justify-start flex relative"
				replacedText={true}
			/>
		</div>
	);
}
