import { cn } from "@/lib/utils";
import React from "react";
import { createPortal } from "react-dom";
import { Color3 } from "../../element.types";
import { useUIState } from "../../uiState";
import Input from "../Input";
import Label from "../Label";

export default function ColorPicker({ title, defaultValue, className }: {
    title: string | null;
    defaultValue: Color3 | null;
    className?: string;
}) {
    const toHex = (value: number): string => {
        const clampedValue = Math.max(0, Math.min(255, value));
        return clampedValue.toString(16).padStart(2, "0");
    };

    const rgbToHsv = React.useCallback((color: Color3) => {
        const red = color.r / 255;
        const green = color.g / 255;
        const blue = color.b / 255;

        const maxValue = Math.max(red, green, blue);
        const minValue = Math.min(red, green, blue);
        const delta = maxValue - minValue;

        let hue = 0;
        if (delta !== 0) {
            if (maxValue === red) {
                hue = ((green - blue) / delta + (green < blue ? 6 : 0)) / 6;
            } else if (maxValue === green) {
                hue = ((blue - red) / delta + 2) / 6;
            } else {
                hue = ((red - green) / delta + 4) / 6;
            }
        }

        const saturation = maxValue === 0 ? 0 : delta / maxValue;
        const value = maxValue;
        return {
            h: hue * 360,
            s: saturation,
            v: value
        };
    }, []);

    const hsvToRgb = React.useCallback((hue: number, saturation: number, value: number): Color3 => {
        const normalizedHue = (hue % 360 + 360) % 360;
        const chroma = value * saturation;
        const hueSector = normalizedHue / 60;
        const intermediateValue = chroma * (1 - Math.abs((hueSector % 2) - 1));
        const matchValue = value - chroma;

        let red = 0;
        let green = 0;
        let blue = 0;

        if (normalizedHue < 60) {
            red = chroma;
            green = intermediateValue;
            blue = 0;
        } else if (normalizedHue < 120) {
            red = intermediateValue;
            green = chroma;
            blue = 0;
        } else if (normalizedHue < 180) {
            red = 0;
            green = chroma;
            blue = intermediateValue;
        } else if (normalizedHue < 240) {
            red = 0;
            green = intermediateValue;
            blue = chroma;
        } else if (normalizedHue < 300) {
            red = intermediateValue;
            green = 0;
            blue = chroma;
        } else {
            red = chroma;
            green = 0;
            blue = intermediateValue;
        }

        return {
            r: Math.round((red + matchValue) * 255),
            g: Math.round((green + matchValue) * 255),
            b: Math.round((blue + matchValue) * 255),
        };
    }, []);

    // popover states //
    const [isOpen, setIsOpen] = React.useState(false);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);

    const [panelPosition, setPanelPosition] = React.useState({ left: 0, top: 0 });

    const { state, setState } = useUIState();
    const localId = React.useId();
    const openId = state["colorPicker:openPopover"] as string | undefined;
    const isActive = isOpen && openId === localId;

    // color picker //
    const svRef = React.useRef<HTMLDivElement>(null);
    const hueRef = React.useRef<HTMLDivElement>(null);

    // value state //
    const [value, setValue] = React.useState<Color3 | null>(defaultValue);
    const [hsv, setHsv] = React.useState<{ h: number; s: number; v: number }>(() => rgbToHsv(value || { r: 255, g: 255, b: 255 }));

    const hexString = React.useMemo(() => {
        const colorValue = value || { r: 255, g: 255, b: 255 };
        return `#${toHex(colorValue.r)}${toHex(colorValue.g)}${toHex(colorValue.b)}`;
    }, [value]);

    const rgbString = React.useMemo(() => {
        const colorValue = value || { r: 255, g: 255, b: 255 };
        return `${colorValue.r}, ${colorValue.g}, ${colorValue.b}`;
    }, [value]);

    // position handler //
    const gap = 4;
    const padding = 8;
    const positionPanel = React.useCallback(() => {
        if (!anchorRef.current) return;
        const anchorRect = anchorRef.current.getBoundingClientRect();

        let left = Math.round(anchorRect.left + window.scrollX);
        let top = Math.round(anchorRect.bottom + window.scrollY + gap);
        left = Math.max(padding, Math.min(left, window.scrollX + window.innerWidth - padding));
        top = Math.max(padding, Math.min(top, window.scrollY + window.innerHeight - padding));

        setPanelPosition({ left, top });
    }, []);

    React.useEffect(() => {
        if (!isActive) return;

        window.addEventListener("resize", positionPanel);
        window.addEventListener("scroll", positionPanel, true);

        return () => {
            window.removeEventListener("resize", positionPanel);
            window.removeEventListener("scroll", positionPanel, true);
        };
    }, [isActive, positionPanel]);

    // popover handler //
    const closePopover = React.useCallback(() => {
        setIsOpen(false);
        if (openId === localId) setState("colorPicker:openPopover", "");
    }, [localId, openId, setState]);

    const openPopover = React.useCallback(() => {
        setIsOpen(true);
        setState("colorPicker:openPopover", localId);
        setTimeout(positionPanel, 0);
    }, [localId, positionPanel, setState]);

    // outside click handler //
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) closePopover();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closePopover]);

    // rgb & hex handlers //
    const onHexChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const text = e.target.value.trim();
        const hexValue = /^#?([0-9a-fA-F]{6})$/.exec(text);
        if (!hexValue) return;

        const hex = parseInt(hexValue[1], 16);
        const next = { r: (hex >> 16) & 0xff, g: (hex >> 8) & 0xff, b: hex & 0xff } as Color3;
        setValue(next);
        setHsv((prev) => {
            const converted = rgbToHsv(next);
            return converted.s === 0 ? { ...converted, h: prev.h } : converted;
        });
    };

    const onRgbChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const text = e.target.value.trim();
        const rgbValues = /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/.exec(text);
        if (!rgbValues) return;

        const r = Math.max(0, Math.min(255, parseInt(rgbValues[1], 10)));
        const g = Math.max(0, Math.min(255, parseInt(rgbValues[2], 10)));
        const b = Math.max(0, Math.min(255, parseInt(rgbValues[3], 10)));

        const next = { r, g, b } as Color3;
        setValue(next);
        setHsv((prev) => {
            const converted = rgbToHsv(next);
            return converted.s === 0 ? { ...converted, h: prev.h } : converted;
        });
    };

    React.useEffect(() => {
        if (!value) return;
        setHsv((prev) => {
            const converted = rgbToHsv(value);
            return converted.s === 0 ? { ...converted, h: prev.h } : converted;
        });
    }, [value, rgbToHsv]);

    // SV & Hue handlers //
    const handleSv = (clientX: number, clientY: number) => {
        const el = svRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();

        let s = (clientX - rect.left) / rect.width;
        let v = 1 - (clientY - rect.top) / rect.height;
        s = Math.max(0, Math.min(1, s));
        v = Math.max(0, Math.min(1, v));

        const next = { h: hsv.h, s, v };
        setHsv(next);
        setValue(hsvToRgb(next.h, next.s, next.v));
    };

    const handleHue = (clientY: number) => {
        const el = hueRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();

        let y = (clientY - rect.top) / rect.height;
        y = Math.max(0, Math.min(1, y));

        const h = (1 - y) * 360;
        const next = { h, s: hsv.s, v: hsv.v };
        setHsv(next);
        setValue(hsvToRgb(next.h, next.s, next.v));
    };

    const startDrag = (onMove: (x: number, y: number) => void) => (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();

        const move = (ev: MouseEvent | TouchEvent) => {
            if (ev instanceof TouchEvent) {
                const t = ev.touches[0] || ev.changedTouches[0];
                onMove(t.clientX, t.clientY);
            } else {
                onMove((ev as MouseEvent).clientX, (ev as MouseEvent).clientY);
            }
        };

        const up = () => {
            document.removeEventListener("mousemove", move as EventListener);
            document.removeEventListener("mouseup", up);
            document.removeEventListener("touchmove", move as EventListener);
            document.removeEventListener("touchend", up);
        };

        document.addEventListener("mousemove", move as EventListener);
        document.addEventListener("mouseup", up);
        document.addEventListener("touchmove", move as EventListener, { passive: false });
        document.addEventListener("touchend", up, { passive: true });

        if ("changedTouches" in e && e.changedTouches && e.changedTouches[0]) {
            onMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        } else if ("clientX" in e) {
            onMove((e as React.MouseEvent).clientX, (e as React.MouseEvent).clientY);
        }
    };

    return (
        <div ref={rootRef} className="relative pointer-events-auto">
            <div
                ref={anchorRef}
                className={cn("relative flex justify-center items-center w-[24px] h-[22px] border border-[rgb(40,40,40)] cursor-pointer", className)}
                style={{ backgroundColor: `rgb(${rgbString})` }}
                onClick={(e) => {
                    e.preventDefault();
                    if (isOpen) { closePopover() } else { openPopover(); }
                }}
            />

            {isActive && typeof window !== "undefined" && createPortal(
                <div onMouseDown={closePopover}>
                    <div
                        ref={panelRef}
                        className="absolute w-[240px] p-[6px] pt-[2px] bg-[rgb(15,15,15)] border border-[rgb(40,40,40)]"
                        style={{ left: panelPosition.left, top: panelPosition.top, height: title ? "243px" : "223px" }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {title && <Label>{title}</Label>}

                        <div className="mt-1 mb-1 h-[180px] flex items-stretch gap-1 select-none" onMouseDown={(e) => e.stopPropagation()}>
                            {/* SV panel */}
                            <div
                                ref={svRef}
                                className="relative w-[240px] border border-[rgb(50,50,50)]"
                                style={{
                                    background: `linear-gradient(to top, black, rgba(0,0,0,0)), linear-gradient(to right, white, hsl(${Math.round(hsv.h)}, 100%, 50%))`,
                                }}
                                onMouseDown={startDrag((x, y) => handleSv(x, y))}
                                onTouchStart={startDrag((x, y) => handleSv(x, y))}
                            >
                                {/* SV cursor */}
                                <div
                                    className="absolute w-[6px] h-[7px] border border-black rounded-full bg-white box-content"
                                    style={{
                                        left: `${hsv.s * 100}%`,
                                        top: `${(1 - hsv.v) * 100}%`,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                            </div>

                            {/* Hue slider */}
                            <div
                                ref={hueRef}
                                className="relative w-[16px] border border-[rgb(50,50,50)]"
                                style={{ background: "linear-gradient(to top, red, yellow, lime, cyan, blue, magenta, red)" }}
                                onMouseDown={startDrag((_x, y) => handleHue(y))}
                                onTouchStart={startDrag((_x, y) => handleHue(y))}
                            >
                                {/* Hue cursor */}
                                <div
                                    className="absolute left-[-3px] right-0 w-[18px] h-[3px] border border-black bg-white"
                                    style={{ top: `${(1 - hsv.h / 360) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-row gap-[7px] h-[26px]" onMouseDown={(e) => e.stopPropagation()}>
                            <Input inputClassName="text-center text-[12px]" text={""} value={hexString} placeholder={"#rrggbb"} onChanged={onHexChange} />
                            <Input inputClassName="text-center text-[12px]" text={""} value={rgbString} placeholder={"r, g, b"} onChanged={onRgbChange} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}