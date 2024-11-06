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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenerateSerial } from "@/server/redeemkey";
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
                <Button variant="outline" onClick={() => {
                    if (!is_open) {
                        setIsOpen(true);
                    }
                }}>Create Key</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                {new_key ? (
                    <>
                        <AlertDialogTitle>Serial Generated Successfully!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Woah so cool :content: with order id: {order_id ?? "REPLACEMENT"}
                        </AlertDialogDescription>

                        {new_key.map((key, index) => (
                            <div key={index} className="flex flex-row gap-2">
                                <Input readOnly value={`https://mspaint.upio.dev/purchase/completed?serial=${encodeURIComponent(key)}`}/>
                                <CopyButton text={`https://mspaint.upio.dev/purchase/completed?serial=${encodeURIComponent(key)}`} />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You sure you want to create a new serial key lil bro?
                        </AlertDialogDescription>

                        <div className="flex flex-row gap-2">

                            <Input
                                type="text"
                                placeholder="Order ID (optional)"
                                onChange={(e) => setOrderID(e.target.value)}
                                className="min-w-[75%]"
                            />

                            <Input
                                type="number"
                                placeholder="Amount"
                                onChange={(e) => setAmount(parseInt(e.target.value))}
                                value={amount}
                                className="max-w-[25%]"
                            />
                        </div>
                    </>
                )}
            </AlertDialogHeader>
            <AlertDialogFooter>
                {new_key ? (
                    <>
                        <AlertDialogCancel onClick={() => {
                            setIsOpen(false);
                            setNewKey(null);
                            setOrderID(null);
                        }}>Dismiss</AlertDialogCancel>
                    </>
                ) : (
                    <>
                        <AlertDialogCancel onClick={() => {
                            setIsOpen(false);
                            setNewKey(null);
                            setOrderID(null);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
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
                                        throw new Error("Failed to generate serial key: " + (serial as error_props).error);
                                    }

                                    setNewKey(serial as string[]);
                                    return "Serial key generated!";
                                },
                                error: "Failed to generate serial key."
                            })
                        }}>Continue</AlertDialogAction>
                    </>
                )}
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}