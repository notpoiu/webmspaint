import { cn } from "@/lib/utils";

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
			className={"w-full rounded-[1px] bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border flex items-center justify-center"}
			style={{ height: `${height}px` }}
		>
			<p className="text-center text-muted-foreground text-sm select-none">
				Image Unavailable
			</p>
		</div>
	);
}