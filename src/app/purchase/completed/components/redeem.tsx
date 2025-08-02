"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import { RedeemKey } from "@/server/redeemkey";
import { toast } from "sonner";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Confetti } from "@/components/magicui/confetti";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback, useTransition } from 'react'

/**
 * Wrapper around `router.refresh()` from `next/navigation` `useRouter()` to return Promise, and resolve after refresh completed
 * src: https://github.com/vercel/next.js/discussions/58520
 * @returns Refresh function
 */
function useRouterRefresh() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const resolveRef = useRef<((value?: void) => void) | null>(null)

  useEffect(() => {
    if (!isPending && resolveRef.current) {
      resolveRef.current(undefined)
      resolveRef.current = null
    }
  }, [isPending])

  return useCallback(() => {
    return new Promise<void>(res => {
      resolveRef.current = res
      startTransition(() => {
        router.refresh()
      })
    })
  }, [router, startTransition])
}

export function RedeemComponent({serial, username, user_id}: {
    serial: null | string;
    username: string;
    user_id: string;
}) {
    const [open, setOpen] = useState(false);
    const [keyClaimed, setKeyClaimed] = useState(false);

    const refresh = useRouterRefresh()

    return (
        <>
            {keyClaimed && (
                <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
                    <Confetti 
                        options={{
                            spread: 360, 
                            origin: {x: 0.5, y: 0.5}, 
                            decay: 0.9, 
                            gravity: 0.5, 
                            startVelocity: 45, 
                            particleCount: 80
                        }} 
                        className="w-full h-full" 
                        style={{ pointerEvents: 'none' }}
                    />
                </div>
            )}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <RainbowButton variant={"default"} size={"lg"} disabled={keyClaimed || serial == null} style={{fontWeight: 'bold'}}>
                        {(keyClaimed || serial == null) ? "Successfully claimed!" : `Redeem mspaint for ${username}`}
                    </RainbowButton>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-black">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will redeem the mspaint key for {username}. We are not responsible for any lost keys.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button onClick={() => {
                            toast.promise(async () => {
                                const response = await RedeemKey(serial as string, user_id);
                                if (response.status !== 200) {
                                    throw new Error(response.error);
                                }

                                return response;
                            }, {
                                loading: "Redeeming lifetime mspaint key...",
                                success: () => {
                                    setOpen(false);
                                    refresh().then(() => {
                                        setKeyClaimed(true);
                                    })
                                    return "Key redeemed successfully for " + username + "! You can now access mspaint via #getscript in discord.";
                                },
                                error: (error_data) => {
                                    setOpen(false);
                                    return "Failed to redeem key: " + error_data.message;
                                },
                            });
                        }}>Continue</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
