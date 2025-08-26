import { cn } from "@/lib/utils";

// text={element.text} value={element.value} min={element.properties.min} max={element.properties.max} compact={element.properties.compact} rounding={element.properties.rounding} prefix={element.properties.prefix} suffix={element.properties.suffix}
export default function Image({
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
