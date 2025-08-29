import React from "react";
import { ButtonBase } from "./Button";
import Label from "./Label";
import { useUIState } from "../uiState";
import { cn } from "@/lib/utils";

export default function Input({
	text,
	value,
	placeholder,
	stateKey,
	className,
	containerClassName,
	inputClassName,
	onChanged
}: {
	text: string;
	value: string;
	placeholder: string;
	stateKey?: string;
	className?: string;
	containerClassName?: string;
	inputClassName?: string;
	onChanged?: React.ChangeEventHandler<HTMLInputElement>
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

	// sync with external value when uncontrolled //
	React.useEffect(() => {
		if (stateKey) return;
		setLocal(value);
	}, [value, stateKey]);

	return (
		<div className="flex flex-col gap-1">
			<Label className="text-white opacity-100">{text}</Label>

			<ButtonBase
				text={
					<input
						name="input"
						type="text"
                        className={cn(
                          "w-full h-full text-white opacity-100 ml-1 text-xs bg-transparent outline-none",
                          inputClassName
                        )}
						value={local}
						placeholder={placeholder}
						onChange={(e) => {
							const next = e.target.value;
							setLocal(next);
							if (stateKey) setState(stateKey, next);
							if (onChanged) onChanged(e);
						}}
					/>
				}
				className={cn("text-left text-white opacity-100 m-1 text-xs", className)}
				containerClassName={cn("justify-start flex relative", containerClassName)}
				replacedText={true}
			/>
		</div>
	);
}
