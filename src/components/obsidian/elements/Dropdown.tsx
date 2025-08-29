"use client";

import { ChevronUp } from "lucide-react";
import { ButtonBase } from "./Button";
import Label from "./Label";
import React from "react";
import { cn } from "@/lib/utils";
import { IBMMono } from "../fonts";
import { useUIValue } from "../uiState";

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  onOutside: () => void
) {
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler, {
      passive: true,
    } as AddEventListenerOptions);
    return () =>
      document.removeEventListener("mousedown", handler as EventListener);
  }, [ref, onOutside]);
}

const NoAnimationClassName =
  "data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";

export default function Dropdown({
  text,
  value,
  options,
  multi,
  disabledValues = [],
  stateKey,
}: {
  text: string;
  value: string | string[] | { [key: string]: boolean };
  options: string[];
  multi: boolean | undefined;
  disabledValues?: string[];
  stateKey?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [externalSelected, setExternalSelected] = useUIValue<
    string | { [key: string]: boolean }
  >(stateKey, undefined);

  const initial = React.useMemo(() => externalSelected, [externalSelected]);
  const normalizeInitial = React.useCallback(():
    | string
    | { [key: string]: boolean } => {
    if (multi) {
      if (initial !== undefined) {
        if (
          initial !== null &&
          typeof initial === "object" &&
          !Array.isArray(initial)
        )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return initial as any;

        if (Array.isArray(initial))
          return (initial as string[]).reduce(
            (acc, k) => ({ ...acc, [k]: true }),
            {} as Record<string, boolean>
          );

        if (typeof initial === "string") return { [initial]: true };
      }

      if (Array.isArray(value))
        return (value as string[]).reduce(
          (acc, k) => ({ ...acc, [k]: true }),
          {} as Record<string, boolean>
        );

      if (typeof value === "object" && value !== null && !Array.isArray(value))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return value as any;

      if (typeof value === "string") return { [value]: true };

      return {};
    }
    if (initial !== undefined) {
      if (typeof initial === "string") return initial as string;

      if (Array.isArray(initial)) return (initial as string[])[0] ?? "";

      if (typeof initial === "object" && initial !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const k = Object.keys(initial as any).find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (kk) => (initial as any)[kk]
        );
        return k ?? "";
      }
    }

    if (typeof value === "string") return value as string;

    if (Array.isArray(value)) return (value as string[])[0] ?? "";

    if (typeof value === "object" && value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const k = Object.keys(value as any).find((kk) => (value as any)[kk]);
      return k ?? "";
    }

    return "";
  }, [initial, multi, value]);

  const [local, setLocal] = React.useState<string | { [key: string]: boolean }>(
    normalizeInitial
  );

  React.useEffect(() => {
    if (stateKey && externalSelected !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setLocal(externalSelected as any);
    }
  }, [externalSelected, stateKey]);

  const selected = local;
  const updateSelected = React.useCallback(
    (newVal: string | { [key: string]: boolean }) => {
      setLocal(newVal);
      if (stateKey) {
        setExternalSelected(newVal);
      }
    },
    [setExternalSelected, stateKey]
  );

  const ITEM_HEIGHT = 24;
  const MAX_PANEL_HEIGHT = 168;
  const OVERSCAN = 6;

  const [scrollTop, setScrollTop] = React.useState(0);
  const { visibleOptions, startIndex, topSpacer, bottomSpacer } =
    React.useMemo(() => {
      const visibleCount = Math.ceil(MAX_PANEL_HEIGHT / ITEM_HEIGHT) + OVERSCAN;
      const startIdx = Math.max(
        0,
        Math.floor(scrollTop / ITEM_HEIGHT) - Math.floor(OVERSCAN / 2)
      );
      const endIdx = Math.min(options.length, startIdx + visibleCount);
      return {
        visibleOptions: options.slice(startIdx, endIdx),
        startIndex: startIdx,
        topSpacer: startIdx * ITEM_HEIGHT,
        bottomSpacer: (options.length - endIdx) * ITEM_HEIGHT,
      };
    }, [scrollTop, options]);

  // close on outside click
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  useClickOutside(rootRef as unknown as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  );

  const displayText = React.useMemo(() => {
    if (multi) {
      if (
        selected &&
        typeof selected === "object" &&
        !Array.isArray(selected)
      ) {
        const keys = Object.keys(selected).filter(
          (k) => (selected as Record<string, boolean>)[k]
        );
        return keys.length ? keys.join(", ") : "---";
      }
      return "---";
    }
    const s =
      typeof selected === "string" && selected.trim().length ? selected : "---";
    return s;
  }, [multi, selected]);

  const onScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const t = (e.currentTarget as HTMLDivElement).scrollTop;
    setScrollTop(t);
  }, []);

  const onSelectOption = React.useCallback(
    (option: string) => {
      if (disabledValues.includes(option)) return;
      if (multi) {
        const selMap: Record<string, boolean> =
          typeof selected === "object" && !Array.isArray(selected)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (selected as any)
            : {};
        const isSelected = !!selMap[option];
        updateSelected({ ...selMap, [option]: !isSelected });
      } else {
        updateSelected(option);
        setIsOpen(false);
      }
    },
    [disabledValues, multi, selected, updateSelected]
  );

  const listboxId = React.useId();
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-white opacity-100">{text}</Label>

      <div
        className="relative"
        ref={rootRef as unknown as React.RefObject<HTMLDivElement>}
      >
        <ButtonBase
          text={displayText}
          className="absolute w-[calc(100%-35px)] text-left text-white opacity-100 m-1 text-xs"
          containerClassName="justify-start flex relative"
          onClick={() => setIsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
        >
          <div className="absolute right-0 top-0 h-full opacity-50">
            <ChevronUp
              className={cn("w-[20px] mr-1", { "-rotate-180": isOpen })}
            />
          </div>
        </ButtonBase>

        {isOpen && (
          <div
            role="listbox"
            id={listboxId}
            aria-multiselectable={!!multi}
            className={cn(
              NoAnimationClassName,
              "absolute left-0 right-0 z-50 max-h-[168px]",
              "rounded-[1px] bg-[rgb(15,15,15)] border-[rgb(40,40,40)] border",
              "overflow-scroll",
              "no-scrollbar"
            )}
            onScroll={onScroll}
          >
            {topSpacer > 0 && <div style={{ height: `${topSpacer}px` }} />}
            {visibleOptions.map((option, i) => (
              <div
                key={startIndex + i}
                className={cn(
                  "py-0 gap-1 px-1 flex items-center cursor-pointer",
                  (() => {
                    const isSelected = multi
                      ? typeof selected === "object" &&
                        selected !== null &&
                        !Array.isArray(selected) &&
                        (selected as Record<string, boolean>)[option] === true
                      : selected === option;
                    return isSelected && "bg-[rgb(40,40,40)]";
                  })(),
                  disabledValues.includes(option) &&
                    "bg-[rgb(0,0,0)] opacity-40 cursor-not-allowed",
                  IBMMono.className
                )}
                role="option"
                aria-selected={
                  multi
                    ? !!(
                        typeof selected === "object" &&
                        selected &&
                        !Array.isArray(selected) &&
                        (selected as Record<string, boolean>)[option]
                      )
                    : selected === option
                }
                onClick={() => onSelectOption(option)}
                style={{ height: `${ITEM_HEIGHT}px` }}
              >
                <div className="px-0 py-0.75 text-xs">{option}</div>
              </div>
            ))}

            {bottomSpacer > 0 && (
              <div style={{ height: `${bottomSpacer}px` }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
