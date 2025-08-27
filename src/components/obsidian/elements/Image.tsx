import { cn } from "@/lib/utils";

/**
 * Renders an Obsidian-styled image placeholder.
 *
 * This component renders a full-width, rounded dark container with a border and a centered
 * "Image Unavailable" message. Only the `height` prop is used to set the container height;
 * the other props (`image`, `transparency`, `scaleType`, `color`, `rectOffset`, `rectSize`)
 * are currently accepted but not used in rendering.
 *
 * @param height - Container height in pixels (used to generate the Tailwind arbitrary height class).
 * @returns A JSX element containing the placeholder UI.
 */
export default function ObsidianImage({
	image,
	transparency,
	scaleType,
	color,
	rectOffset,
	height,
	rectSize,
}: {
	image: string;
	transparency: number;
	scaleType: string;
	color: { b: number; g: number; r: number };
	rectOffset: { y: number; x: number };
	height: number;
	rectSize: { y: number; x: number };
}) {
	return (
		<div
			className={cn(
				"w-full rounded-[1px] bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border flex items-center justify-center",
				`h-[${height}px]`
			)}
		>
			<p className="text-center text-muted-foreground text-sm select-none">
				Image Unavailable
			</p>
		</div>
	);
}