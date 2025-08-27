import React from "react";
import { ButtonBase } from "./Button";
import Label from "./Label";
import { useUIState } from "../uiState";

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
