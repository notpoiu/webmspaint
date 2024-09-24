"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function CopyButton({text}: {text: string}) {
  return (
    <Button size={"icon"} variant={"outline"} className="px-2" onClick={() => {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }}>
      <CopyIcon className="h-5 w-5" />
    </Button>
  )
}