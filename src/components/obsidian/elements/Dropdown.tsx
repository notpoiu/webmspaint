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
import { IBMMono } from "../obsidian";
import { useUIState } from "../uiState";

const NoAnimationClassName =
  "data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";

export default function Dropdown({
  text,
  value,
  options,
  multi,
  stateKey,
}: {
  text: string;
  value: string | { [key: string]: boolean };
  options: string[];
  multi: boolean | undefined;
  stateKey?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { state, setState } = useUIState();

  const initial = React.useMemo(() => stateKey && state[stateKey], [stateKey, state]);
  const [local, setLocal] = React.useState<string | { [key: string]: boolean }>(
    (initial as any) ?? value
  );

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
        <DropdownMenuTrigger>
          <ButtonBase
            text={
              selected !== undefined
                ? typeof selected === "string"
                  ? selected
                  : Object.keys(selected).filter((k) => (selected as any)[k]).join(", ")
                : "---"
            }
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
              className={cn("py-0 gap-1 px-1", IBMMono.className)}
              onClick={() => {
                if (multi && typeof selected === "object") {
                  // if multi is true, we need to toggle the selected value
                  const isSelected = !!(selected as any)[option];
                  updateSelected({ ...selected, [option]: !isSelected });
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
