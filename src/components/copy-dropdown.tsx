"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";
interface ItemInterface {
  name: string;
  value: string;
  icon?: ReactNode;
}

export default function CopyDropdown({items, size, className}: { items: ItemInterface[], size?: "default" | "sm" | "lg" | "icon", className?: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size={size ?? "icon"} variant={"outline"} className={cn("relative rounded-md px-2", className)} aria-label={copied ? "Copied" : "Copy to clipboard"} >
          <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
          <Copy
            className={`h-4 w-4 transition-all duration-300 ${
              copied ? "scale-0" : "scale-100"
            }`}
          />
          <Check
            className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-300 text-green-500 ${
              copied ? "scale-100" : "scale-0"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={() => {
            navigator.clipboard.writeText(item.value);
            setCopied(true);
            setOpen(false);
            setTimeout(() => setCopied(false), 2000);
          }} className="py-0 gap-1 flex flex-row items-center">
            {item.icon}
            <DropdownMenuLabel>
              {item.name}
            </DropdownMenuLabel>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}