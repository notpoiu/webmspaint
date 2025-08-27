import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useUIValue } from "../uiState";

/**
 * A clickable on/off toggle with a label that can be bound to global UI state.
 *
 * Renders a 22×22 square indicator and a text label. The control maintains internal checked state but, if `stateKey` is provided, will initialize from and synchronize changes to the external UI state obtained via `useUIValue`. Clicking the control toggles the checked state and, when bound, updates the external state.
 *
 * @param text - Label text displayed to the right of the indicator.
 * @param checked - Fallback initial checked value used when `stateKey` is not provided or external state is undefined.
 * @param stateKey - Optional key used to bind the toggle to external/global UI state; when present, only boolean external values are synced into the component and updates are written back on user interaction.
 * @returns A JSX element representing the labeled toggle.
 */
export default function Toggle({
	text,
	checked,
	stateKey,
}: {
	text: string;
	checked: boolean;
	stateKey?: string;
}) {
	const [externalChecked, setExternalChecked] = useUIValue<boolean | undefined>(
		stateKey,
		undefined
	);
	const [isChecked, setChecked] = useState<boolean>(
		(externalChecked as boolean | undefined) ?? checked
	);

	useEffect(() => {
		if (!stateKey) return;
		const v = externalChecked;
		if (typeof v === "boolean") setChecked(v);
	}, [externalChecked, stateKey]);

	return (
		<div
			className="relative gap-2"
			onClick={(e) => {
				e.preventDefault();
				const next = !isChecked;
				setChecked(next);
				if (stateKey) setExternalChecked(next);
			}}
		>
			<div className="absolute w-[22px] h-[22px] rounded-[3px] bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border">
				<CheckIcon
					className={`w-[16px] h-[16px] m-[2px] transition-opacity`}
					style={{ opacity: isChecked == true ? 100 : 0 }}
				/>
			</div>

			<span
				className={`ml-[28px] text-left block text-white text-sm select-none opacity-${isChecked == true ? "80" : "60"
					} transition-opacity`}
			>
				{text}
			</span>
		</div>
	);
}
