"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function CopyButton({text}: {text: string}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button size={"icon"} variant={"outline"} className="relative rounded-md px-2" onClick={() => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }} aria-label={copied ? "Copied" : "Copy to clipboard"} >
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
  )
}