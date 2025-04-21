"use client";

import CopyButton from "@/components/copy-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenerateSerial } from "@/server/redeemkey";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface error_props {
  status: number;
  error: string;
}

export default function CreateSerialKey() {
  const [new_key, setNewKey] = useState<string[] | null>(null);
  const [is_open, setIsOpen] = useState<boolean>(false);

  const [amount, setAmount] = useState<number>(1);
  const [order_id, setOrderID] = useState<string | null>(null);

  return (
    <AlertDialog open={is_open}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            if (!is_open) {
              setIsOpen(true);
            }
          }}
        >
          Create Key
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {new_key ? (
            <>
              <AlertDialogTitle>
                Serial Generated Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Woah so cool :content: with order id:{" "}
                {order_id ?? "REPLACEMENT"}
              </AlertDialogDescription>

              {new_key.map((key, index) => (
                <div key={index} className="flex flex-row gap-2">
                  <Input
                    readOnly
                    value={`https://www.mspaint.cc/purchase/completed?serial=${encodeURIComponent(
                      key
                    )}`}
                  />
                  <CopyButton
                    text={`https://www.mspaint.cc/purchase/completed?serial=${encodeURIComponent(
                      key
                    )}`}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              <AlertDialogTitle>Serial Creation</AlertDialogTitle>
              <AlertDialogDescription>
                You sure you want to create a new serial key lil bro?
              </AlertDialogDescription>

              <div className="flex flex-row gap-2">
                <Input
                  type="text"
                  placeholder="Order ID (optional)"
                  value={order_id ?? ""}
                  onChange={(e) => setOrderID(e.target.value)}
                  className="min-w-[75%] text-[16px]"
                />

                <Input
                  type="number"
                  placeholder="Amount"
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  value={amount}
                  className="max-w-[25%] text-[16px]"
                />
              </div>
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {new_key ? (
            <>
              <Button
                onClick={() => {
                  let serial = "";

                  for (let i = 0; i < new_key.length; i++) {
                    serial += `https://www.mspaint.cc/purchase/completed?serial=${new_key[i]}\n`;
                  }

                  const blob = new Blob([serial], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "serials.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Serial key downloaded!");
                }}
                className="mb-2"
                variant={"secondary"}
              >
                Download Serials <DownloadIcon />
              </Button>
              <AlertDialogCancel
                onClick={() => {
                  setIsOpen(false);
                  setNewKey(null);
                  setOrderID(null);
                }}
              >
                Dismiss
              </AlertDialogCancel>
            </>
          ) : (
            <>
              <Select
                defaultValue="none"
                onValueChange={(
                  selected:
                    | "none"
                    | "bloxproducts"
                    | "robloxcheatz"
                    | "giveaway"
                    | "replacement"
                ) => {
                  if (selected === "none") {
                    setOrderID(null);
                    return;
                  }

                  if (selected === "giveaway") {
                    setOrderID(`Giveaway`);
                  }

                  if (selected === "bloxproducts") {
                    setOrderID(`Bloxproducts - {UUID}`);
                  }

                  if (selected === "robloxcheatz") {
                    setOrderID(`RobloxCheatz - {UUID}`);
                  }

                  if (selected === "replacement") {
                    setOrderID(`REPLACEMENT`);
                  }
                }}
              >
                <SelectTrigger className="w-[180px] mr-auto">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Template</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>

                  <SelectGroup>
                    <SelectLabel>Reseller</SelectLabel>
                    <SelectItem value="bloxproducts">Bloxproducts</SelectItem>
                    <SelectItem value="robloxcheatz">Robloxcheatz</SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>Misc</SelectLabel>
                    <SelectItem value="giveaway">Discord Giveaway</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <AlertDialogCancel
                onClick={() => {
                  setIsOpen(false);
                  setNewKey(null);
                  setOrderID(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (amount < 1) {
                    return toast.error("Amount must be greater than 0.");
                  }

                  if (amount > 50) {
                    return toast.error("Amount must be less than 50.");
                  }

                  toast.promise(GenerateSerial(order_id, amount), {
                    loading: "Generating serial key...",
                    success: (serial) => {
                      if ((serial as error_props).error) {
                        throw new Error(
                          "Failed to generate serial key: " +
                            (serial as error_props).error
                        );
                      }

                      setNewKey(serial as string[]);
                      return "Serial key generated!";
                    },
                    error: "Failed to generate serial key.",
                  });
                }}
              >
                Continue
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
