import { cn } from "@/lib/utils";
import Label from "../Label";
import { useEffect, useState } from "react";

export default function KeyPicker({
	defaultValue,
	className,
}: {
	defaultValue: string;
	className?: string;
}) {
	const [value, setValue] = useState<string>(defaultValue);
	const [isListening, setIsListening] = useState<boolean>(false);

	useEffect(() => {
		if (!isListening) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const key = e.key;
			const cleaned = key.length === 1 ? key.toUpperCase() : key;
			setValue(cleaned);
			setIsListening(false);
		};

		window.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => {
			window.removeEventListener("keydown", handleKeyDown, true);
		};
	}, [isListening]);

	return (
		<div
			className={cn(
				"flex justify-center items-center h-[22px] bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border",
				className
			)}
			onClick={(e) => {
				e.preventDefault();
				setIsListening(true);
			}}
			title={isListening ? "Press a key..." : undefined}
		>
			<Label className="m-1 text-[12px] text-white">{isListening ? "..." : value}</Label>
		</div>
	);
}