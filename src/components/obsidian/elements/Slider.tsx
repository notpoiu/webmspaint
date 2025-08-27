"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ButtonBase } from "./Button";
import Label from "./Label";
import { useUIValue } from "../uiState";

export default function Slider({
	text,
	value,
	defaultValue,
	min = 0,
	max = 100,
	step = 1,
	compact,
	rounding,
	prefix,
	suffix,
	className,
	onValueChange,
	stateKey,
}: {
	text: string;
	value?: number;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
	compact?: boolean;
	rounding?: number;
	prefix?: string;
	suffix?: string;
	className?: string;
	onValueChange?: (value: number) => void;
	stateKey?: string;
}) {
	const [stateValue, setStateValue] = useUIValue<number | undefined>(stateKey, undefined);
	const [internalValue, setInternalValue] = React.useState(
		stateValue ?? (value ?? defaultValue ?? min)
	);

	const isControlled = value !== undefined && onValueChange !== undefined;
	const currentValue = isControlled ? (value as number) : internalValue;

	React.useEffect(() => {
		if (!isControlled && stateValue !== undefined) {
			setInternalValue(stateValue);
		}
	}, [stateValue, isControlled]);

	const roundValue = (num: number) => {
		if (rounding !== undefined && rounding >= 0) {
			const multiplier = Math.pow(10, rounding);
			return Math.round(num * multiplier) / multiplier;
		}
		return num;
	};

	const trackRef = React.useRef<HTMLDivElement | null>(null);
	const draggingRef = React.useRef(false);

	const quantizeToStep = (n: number) => {
		const range = max - min;
		if (step <= 0 || !Number.isFinite(step) || range === 0) return n;

		const roundingStep = rounding !== undefined && rounding >= 0 ? Math.pow(10, -rounding) : null;
		const effectiveStep = roundingStep ? Math.min(step, roundingStep) : step;
		const steps = Math.round((n - min) / effectiveStep);
		const snapped = min + steps * effectiveStep;

		return Math.min(max, Math.max(min, snapped));
	};

	const setFromClientX = (clientX: number) => {
		const el = trackRef.current;
		if (!el) return;

		const rect = el.getBoundingClientRect();
		const pct = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
		const clampedPct = Math.min(1, Math.max(0, pct));
		const raw = min + clampedPct * (max - min);
		const stepped = quantizeToStep(raw);
		const roundedValue = roundValue(stepped);
		
		if (!isControlled) setInternalValue(roundedValue);
		if (stateKey) setStateValue(roundedValue);
		if (onValueChange) onValueChange(roundedValue);
	};

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault();
		draggingRef.current = true;
		try {
			(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
		} catch { }
		setFromClientX(e.clientX);

		const move = (ev: PointerEvent) => {
			if (!draggingRef.current) return;
			setFromClientX(ev.clientX);
		};

		const up = () => {
			draggingRef.current = false;
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
		};

		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", up);
	};

	const displayValue = roundValue(currentValue);
	const displayMax = roundValue(max);
	const formatValue = (num: number) => rounding !== undefined && rounding >= 0 ? Number(num).toFixed(rounding) : String(num);

	const fraction = max > min ? (currentValue - min) / (max - min) : 0;
	const percent = Math.min(100, Math.max(0, fraction * 100));

	if (compact) {
		const sliderText = `${prefix || ""}${text}${suffix || ""}: ${formatValue(
			displayValue as number
		)}`;
		
		return (
			<ButtonBase
				text=""
				replacedText={true}
				containerClassName={cn(className, "h-[20px]")}
			>
				<div className="relative w-full h-full flex items-center justify-center">
					<div
						ref={trackRef}
						role="slider"
						aria-valuemin={min}
						aria-valuemax={max}
						aria-valuenow={displayValue}
						className="absolute inset-0 z-10 cursor-pointer overflow-hidden rounded-[1px] select-none touch-none pointer-events-auto"
						onPointerDown={onPointerDown}
						onPointerMove={(e) => {
							if (!draggingRef.current) return;
							setFromClientX(e.clientX);
						}}
					>
						<div
							className="absolute left-0 top-0 h-full bg-[rgb(125,85,255)]"
							style={{ width: `${percent}%` }}
						/>
					</div>
					<span
						className={cn(
							`text-center text-white text-sm truncate z-30 pointer-events-none`,
							"select-none"
						)}
						style={{
							WebkitTextStroke: "0.1px #000",
							WebkitTextFillColor: "white",
							textShadow:
								"0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000",
						}}
					>
						{sliderText}
					</span>
				</div>
			</ButtonBase>
		);
	}

	return (
		<div className={cn("flex flex-col gap-1", className)}>
			<Label className="text-white opacity-100">{text}</Label>
			<div className="relative w-full h-[20px] rounded-[1px] bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border">
				<div
					ref={trackRef}
					role="slider"
					aria-valuemin={min}
					aria-valuemax={max}
					aria-valuenow={displayValue}
					className="absolute inset-0 cursor-pointer overflow-hidden rounded-[1px] select-none touch-none"
					onPointerDown={onPointerDown}
					onPointerMove={(e) => {
						if (!draggingRef.current) return;
						setFromClientX(e.clientX);
					}}
				>
					<div className="absolute inset-0" />
					<div
						className="absolute left-0 top-0 h-full bg-[rgb(125,85,255)]"
						style={{ width: `${percent}%` }}
					/>
				</div>
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<span
						className="text-center text-white text-sm select-none"
						style={{
							WebkitTextStroke: "0.1px #000",
							WebkitTextFillColor: "white",
							textShadow:
								"0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000",
						}}
					>
						{formatValue(displayValue as number)}/
						{formatValue(displayMax as number)}
					</span>
				</div>
			</div>
		</div>
	);
}
