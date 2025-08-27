import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useUIValue } from "../uiState";

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
					style={{ opacity: isChecked == true ? 1 : 0 }}
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
