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

export default function CreateSerialKey() {
    const [new_key, setNewKey] = useState<string | null>(null);
    const [is_open, setIsOpen] = useState<boolean>(false);

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
                            Woah so cool :content:
                        </AlertDialogDescription>

                        <div className="flex flex-row justify-center">
                            <Input readOnly value={`https://mspaint.upio.dev/purchase/completed?serial=${encodeURIComponent(new_key)}`}/>
                            <CopyButton text={`https://mspaint.upio.dev/purchase/completed?serial=${encodeURIComponent(new_key)}`} />
                        </div>
                    </>
                ) : (
                    <>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You sure you want to create a new serial key lil bro?
                        </AlertDialogDescription>
                    </>
                )}
            </AlertDialogHeader>
            <AlertDialogFooter>
                {new_key ? (
                    <>
                        <AlertDialogCancel onClick={() => {
                            setNewKey(null);
                            setIsOpen(false);
                        }}>Dismiss</AlertDialogCancel>
                    </>
                ) : (
                    <>
                        <AlertDialogCancel onClick={() => {
                            setNewKey(null);
                            setIsOpen(false);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            toast.promise(GenerateSerial(), {
                                loading: "Generating serial key...",
                                success: (serial) => {
                                    setNewKey(serial);
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