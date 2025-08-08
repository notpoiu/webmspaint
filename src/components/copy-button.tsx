"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMemo } from "react";

export default function CopyButton({text}: {text: string}) {
  const [copied, setCopied] = useState(false);

  return useMemo(() => (
    <Button
      size={"icon"}
      variant={"outline"}
      className="relative rounded-md px-2"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      <Copy
        className={`h-4 w-4 transition-all duration-300 ${
          copied ? "scale-0" : "scale-100"
        }`}
      />
      <Check
        className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-300 ${
          copied ? "scale-100" : "scale-0"
        }`}
      />
    </Button>
  ), [copied, text]);
}

export function CopyButtonWithText({text, customOnClick}: {text: string, customOnClick?: () => void}) {
  const [copied, setCopied] = useState(false);

  return useMemo(() => (
    <div className="flex justify-center w-full mt-2">
      <Button
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer"
        onClick={() => {
          if (customOnClick) customOnClick();
          
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        aria-label={copied ? "Copied to clipboard" : "Copy"}
      >
        <span className="text-sm">
          {copied ? "Copied to clipboard" : "Copy"}
        </span>

        <div className="relative w-4 h-4">
          <Copy
            className={`absolute inset-0 transition-transform duration-300 ${
              copied ? "scale-0" : "scale-100"
            }`}
          />
          <Check
            className={`absolute inset-0 transition-transform duration-300 ${
              copied ? "scale-100" : "scale-0"
            }`}
          />
        </div>
      </Button>
    </div>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [copied, text]);
}