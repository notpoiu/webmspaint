import { cn } from "@/lib/utils";
import * as React from "react";

export const ButtonBase = React.forwardRef<
	HTMLButtonElement,
	{
		text: string | React.ReactNode;
		containerClassName?: string;
		className?: string;
		children?: React.ReactNode;
		replacedText?: boolean;
	} & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({
	text,
	containerClassName,
	className,
	children,
	replacedText = false,
	...props
}, ref) => {
	return (
		<button
			ref={ref}
			type="button"
			className={cn(
				"w-full h-[26px] justify-center rounded-[1px] bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border cursor-pointer inline-flex items-center",
				containerClassName
			)}
			{...props}
		>
			{!replacedText ? (
				<span className={cn("text-center text-white text-sm opacity-50 truncate", className)}>
					{text}
				</span>
			) : (text)}
			{children}
		</button>
	);
});

ButtonBase.displayName = "ButtonBase";

/**
 * Renders a primary button or a pair of buttons.
 *
 * If `subButton` is provided, renders two ButtonBase components side-by-side with a small gap:
 * the primary button showing `text` and the secondary showing `subButton.text`. Otherwise renders a single ButtonBase.
 *
 * @param text - Label for the primary button.
 * @param subButton - Optional object with a `text` property to render a secondary button.
 * @returns A React element containing one or two ButtonBase components.
 */
export default function Button({
	text,
	subButton,
}: {
	text: string;
	subButton?: { text: string };
}) {
	if (subButton != undefined) {
		return (
			<div className="flex flex-row gap-2">
				<ButtonBase text={text} />
				<ButtonBase text={subButton.text} />
			</div>
		);
	}

	return <ButtonBase text={text} />;
}