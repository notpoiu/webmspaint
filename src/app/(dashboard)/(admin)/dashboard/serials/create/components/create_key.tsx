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
import { DownloadIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { calculateTimeStringRemainingFormated } from "@/lib/utils";
import { GenerateSerial } from "@/server/dashutils";

interface error_props {
  status: number;
  error: string;
}

export default function CreateSerialKey() {
  const [new_key, setNewKey] = useState<string[] | null>(null);
  const [is_open, setIsOpen] = useState<boolean>(false);

  const [amount, setAmount] = useState<number>(1);
  const [order_id, setOrderID] = useState<string | null>(null);
  enum ExpirationType {
    LIFETIME = "LIFETIME",
    THIRTY_DAYS = "THIRTY_DAYS",
    ONE_SECOND = "ONE_SECOND_KEY",
    CUSTOM = "CUSTOM"
  }
  const [expirationType, setExpirationType] = useState<ExpirationType>(ExpirationType.LIFETIME);
  const [expireDays, setExpireDays] = useState<number>(0);
  const [expireHours, setExpireHours] = useState<number>(0);
  const [expireMinutes, setExpireMinutes] = useState<number>(1);
  const [time, setTime] = useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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

              <div className="space-y-2 mt-2">
                <p className="text-sm font-medium">Expiration Settings:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="lifetime"
                    name="expiration"
                  checked={expirationType === ExpirationType.LIFETIME}
                  onChange={() => {
                      setExpirationType(ExpirationType.LIFETIME);
                    }}
                    className="h-4 w-4"
                  />
                  <label htmlFor="lifetime" className="text-sm">
                    Lifetime
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                  type="radio"
                  id="30days"
                  name="expiration"
                  checked={expirationType === ExpirationType.THIRTY_DAYS}
                  onChange={() => {
                    setExpirationType(ExpirationType.THIRTY_DAYS);
                    setExpireDays(30);
                    setExpireHours(0);
                    setExpireMinutes(0);
                  }}
                  className="h-4 w-4"
                  />
                  <label htmlFor="30days" className="text-sm">
                    30 Days
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="onesecond"
                    name="expiration"
                    checked={expirationType === ExpirationType.ONE_SECOND}
                    onChange={() => {
                      setExpirationType(ExpirationType.ONE_SECOND);
                      setExpireDays(0);
                      setExpireHours(0);
                      setExpireMinutes(0);
                    }}
                    className="h-4 w-4"
                  />
                  <label htmlFor="onesecond" className="text-sm">
                    1 Second
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="custom"
                    name="expiration"
                    checked={expirationType === ExpirationType.CUSTOM}
                    onChange={() => {
                      setExpirationType(ExpirationType.CUSTOM);
                      setExpireDays(1);
                      setExpireHours(0);
                      setExpireMinutes(0);
                    }}
                    className="h-4 w-4"
                  />
                  <label htmlFor="custom" className="text-sm">
                    Custom
                  </label>
                </div>

                {(expirationType === ExpirationType.THIRTY_DAYS || expirationType === ExpirationType.CUSTOM) && (
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        //if (expirationType === ExpirationType.LIFETIME) return null;
                        
                        const now = new Date();
                        const expirationDate = new Date(now);
                        expirationDate.setDate(now.getDate() + expireDays);
                        expirationDate.setHours(now.getHours() + expireHours);
                        expirationDate.setMinutes(now.getMinutes() + expireMinutes);
                        
                        const timeLeft = expirationDate.getTime() - now.getTime();
                        const [timeLeftText, timeLeftColor] = calculateTimeStringRemainingFormated(timeLeft);

                        return (
                          <div>
                            <p>Will expire on: {expirationDate.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')} when claimed.</p>
                            <p className={timeLeftColor}>
                              {timeLeftText}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {expirationType === ExpirationType.CUSTOM && (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex flex-row gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Days</p>
                        <Input
                          type="number"
                          value={expireDays}
                          onChange={(e) => setExpireDays(Number(e.target.value))}
                          min="0"
                          className="w-full text-[16px]"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Hours</p>
                        <Input
                          type="number"
                          value={expireHours}
                          onChange={(e) => setExpireHours(Number(e.target.value))}
                          min="0"
                          max="23"
                          className="w-full text-[16px]"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Minutes</p>
                        <Input
                          type="number"
                          value={expireMinutes}
                          onChange={(e) => setExpireMinutes(Number(e.target.value))}
                          min="0"
                          max="59"
                          className="w-full text-[16px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground italic">Timestamps are provided in UTC (Coordinated Universal Time).</p>
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

                  let durationMinutes = null; // Lifetime case
                  if (expirationType === ExpirationType.THIRTY_DAYS) {
                    durationMinutes = 31 * 24 * 60; // 30 + 1 days in minutes
                  } else if (expirationType === ExpirationType.ONE_SECOND) {
                    durationMinutes = 0; //moneybag
                  } else if (expirationType === ExpirationType.CUSTOM) {
                    durationMinutes = (expireDays * 24 * 60) + (expireHours * 60) + expireMinutes;
                  }

                  toast.promise(GenerateSerial(order_id, amount, durationMinutes), {
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
