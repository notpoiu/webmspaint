"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronUp } from "lucide-react";
import { ButtonBase } from "./Button";
import Label from "./Label";
import React from "react";
import { cn } from "@/lib/utils";
import { IBMMono } from "../fonts";
import { useUIState } from "../uiState";

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
  const { state, setState } = useUIState();

  const initial = React.useMemo(() => stateKey && state[stateKey], [stateKey, state]);

  const normalizeInitial = React.useCallback((): string | { [key: string]: boolean } => {
    if (multi) {
      if (initial !== undefined) {
        if (typeof initial === "object" && !Array.isArray(initial)) return initial as any;
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
      if (typeof value === "object" && value !== null && !Array.isArray(value)) return value as any;
      if (typeof value === "string") return { [value]: true };
      return {};
    }
    if (initial !== undefined) {
      if (typeof initial === "string") return initial as string;
      if (Array.isArray(initial)) return (initial as string[])[0] ?? "";
      if (typeof initial === "object" && initial !== null) {
        const k = Object.keys(initial as any).find((kk) => (initial as any)[kk]);
        return k ?? "";
      }
    }
    if (typeof value === "string") return value as string;
    if (Array.isArray(value)) return (value as string[])[0] ?? "";
    if (typeof value === "object" && value !== null) {
      const k = Object.keys(value as any).find((kk) => (value as any)[kk]);
      return k ?? "";
    }
    return "";
  }, [initial, multi, value]);

  const [local, setLocal] = React.useState<string | { [key: string]: boolean }>(normalizeInitial);

  React.useEffect(() => {
    if (stateKey) {
      const cur = state[stateKey];
      if (cur !== undefined) setLocal(cur as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  const selected = local;
  const updateSelected = (newVal: string | { [key: string]: boolean }) => {
    setLocal(newVal);
    if (stateKey) setState(stateKey, newVal);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-white opacity-100">{text}</Label>

      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <ButtonBase
            text={(() => {
              if (multi) {
                if (
                  selected &&
                  typeof selected === "object" &&
                  !Array.isArray(selected)
                ) {
                  const keys = Object.keys(selected).filter(
                    (k) => (selected as any)[k]
                  );
                  return keys.length ? keys.join(", ") : "---";
                }
                return "---";
              }
              const s =
                typeof selected === "string" && selected.trim().length
                  ? selected
                  : "---";
              return s;
            })()}
            className="text-left text-white opacity-100 m-1 text-xs"
            containerClassName="justify-start flex relative"
          >
            <div className="absolute right-0 top-0 h-full opacity-50">
              <ChevronUp
                className={cn({
                  "-rotate-180": isOpen,
                })}
              />
            </div>
          </ButtonBase>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onOpenAutoFocus={(e) => {
            // Prevent auto-focus from scrolling the page to the top/left
            e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            // Prevent returning focus from causing scroll jumps
            e.preventDefault();
          }}
          className={cn(
            NoAnimationClassName,
            "w-[var(--radix-dropdown-menu-trigger-width)] max-h-[168px]",
            "rounded-[1px] bg-[rgb(25,25,25)] border-[rgb(40,40,40)] border",
            "overflow-scroll"
          )}
        >
          {options.map((option, index) => (
            <DropdownMenuItem
              key={index}
              className={cn(
                "py-0 gap-1 px-1",
                IBMMono.className,
                disabledValues.includes(option) && "opacity-40 cursor-not-allowed"
              )}
              onClick={(e) => {
                if (disabledValues.includes(option)) return;
                if (multi) {
                  const selMap: Record<string, boolean> =
                    typeof selected === "object" && !Array.isArray(selected)
                      ? (selected as any)
                      : {};
                  const isSelected = !!selMap[option];
                  updateSelected({ ...selMap, [option]: !isSelected });
                } else {
                  updateSelected(option);
                }
              }}
            >
              <DropdownMenuLabel className="px-0 py-0.75 text-xs">
                {option}
              </DropdownMenuLabel>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
