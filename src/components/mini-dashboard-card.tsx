"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LockKeyholeIcon, LockKeyholeOpenIcon, PackageIcon } from "lucide-react";
import { RainbowButton } from "./magicui/rainbow-button";
import { TimeUpdater } from "./time-updater";
import { QueryResultRow } from "@vercel/postgres";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { cn, getTimeAgoFromUnix } from "@/lib/utils";
import React from "react";
import { Badge } from "./ui/badge";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ShineBorder } from "./magicui/shine-border";
import { Separator } from "@radix-ui/react-separator";
import { ClientCodeBlock, getScriptCode } from "./codeblock";
import { CopyButtonWithText } from "./copy-button";

interface MiniDashboardCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  subscription: QueryResultRow | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  purchaseHistory: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signout: any;
}

export default function MiniDashboardCard({
  session,
  subscription,
  purchaseHistory,
  signout,
}: MiniDashboardCardProps) {
  const router = useRouter();
  const [hardwareIdDialog, setHardwareIdDialog] = React.useState(false);
  const [getScriptDialog, setGetScriptDialog] = React.useState(false);

  if (!session || !session.user) {
    router.push("/sign-in");
    return null;
  }

  const expirationDate = subscription?.expires_at ?? 0;
  const userStatus: string = subscription ? subscription.user_status : 'unknown'
  const userLuarmorKey = subscription?.lrm_serial ?? 'unknown'

  // Determine subscription status
  const isMember = subscription != null;
  const isLifetime = subscription?.expires_at == -1;
  const isExpired = expirationDate - Date.now() <= 0;
  const isActive = (subscription?.expires_at != null && !isExpired) || isLifetime;
  const isResetState = userStatus === 'reset';
  const isBanned = userStatus === 'banned' || subscription?.is_banned;
  
  const lastSyncTime = getTimeAgoFromUnix(subscription?.last_sync);
  const timeLeftMs = expirationDate - Date.now();

  return (
    <div className="w-full max-w-md mx-auto sm:mx-0 mt-6">
      <Card className="relative rounded-lg z-10 border-transparent">
        {(isMember && !isBanned && isActive) && (
          <ShineBorder
            shineColor={["#0f87ff", "#001933", "#1aafff"]}
            className="absolute inset-0  pointer-events-none z-20"
          />
        )}
        <div className="relative -top-3 right-3 z-30">
          <Badge 
            variant={"secondary"} 
            className="px-2 py-1 text-xs outline-2 outline-accent-background cursor-pointer" 
            onClick={() => toast.info("This dashboard still in development and issues may occur.\nIf you find any issues contact https://mspaint.cc/support")}
          >
          <InfoCircledIcon className="stroke-[2] mr-1"/>
            BETA
          </Badge>
        </div>        
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              {session.user.image && (
                <div className="relative w-[80px] h-[80px]">
                  <div className="absolute -inset-1 bg-white/10 rounded-full z-0" />

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user.image}
                    alt="Discord Avatar"
                    width={80}
                    height={80}
                    className="rounded-full border-3 border-neutral-50/80 relative z-10"
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-center sm:text-left">
                  Discord Account
                </h3>
                <p className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
                  {session.user.name}
                </p>
              </div>

              <div className="mb-5">
                {isMember ? (
                  <>
                    <div className="w-full flex justify-center sm:justify-start mt-2">
                      <div className="flex items-center space-x-2 text-center sm:text-left">
                        <Badge
                          className="font-bold pointer-events-none"
                          variant={isBanned ? "destructive" : "default"}
                        >
                          {userStatus.toUpperCase()}
                        </Badge>
                        <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider">
                          Subscription Status
                        </h3>
                      </div>
                    </div>
                    <div className="w-full flex justify-center sm:justify-start mt-2">
                      <div className="w-full text-center sm:text-left">
                        {isBanned ? (
                          <p className="text-base text-red-400 mt-2">
                            User is banned, access restricted.
                          </p>
                        ) : (
                          !isExpired ? (
                            <div className="flex items-center justify-between w-full -mb-2">

                              {isLifetime ? (
                                <p className="text-base text-green-400 mt-2">
                                  Lifetime access ★
                                </p>
                              ): (
                                <TimeUpdater
                                  initialTimeLeft={timeLeftMs}
                                  freezeAfterTimeout={true}
                                />
                              )}

                              <Button
                                variant={"outline"}
                                className="w-20 h-8 p-0 text-xs font-bold flex items-center justify-left"
                                onClick={() => setGetScriptDialog(true)}
                              >
                                Get Script 
                              </Button>

                              <AlertDialog open={getScriptDialog} onOpenChange={setGetScriptDialog}>
                                <AlertDialogContent className="max-w-xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Here is your mspaint script</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Just click the copy button and paste it in your script executor.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <div className="overflow-y-auto max-h-[400px] -mb-">
                                    <ClientCodeBlock
                                      serial={userLuarmorKey}
                                      disableCopyButton={true}
                                      classNameBlock="flex flex-col max-h-full border-[5px] border-border/40 rounded-md"
                                    />
                                  </div>
                                  <CopyButtonWithText 
                                    text={getScriptCode(userLuarmorKey)}
                                    customOnClick={() => {
                                      toast.success("Script copied to clipboard.")
                                      setGetScriptDialog(false);
                                    }}
                                  />

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Done</AlertDialogCancel>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                            </div>
                          ) : (
                            <p className="text-base text-red-400 mt-2">
                              Expired - Renew Now!
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    <Separator orientation="horizontal" className="bg-border mx-full h-[2px] mt-4" />

                    {!isBanned ? (
                      <>
                        <Button
                          className={cn(
                            "border shadow-xs hover:bg-accent",
                            isResetState ? "text-white/40 hover:text-accent-foreground dark:bg-input/60 dark:border-input" :
                            "text-white/80 hover:text-accent-foreground dark:bg-red-200/20 dark:border-input dark:hover:bg-red-400/50 cursor-pointer",
                            "w-full flex items-center justify-center py-2 mt-2"
                          )} onClick={() => setHardwareIdDialog(true)}
                          disabled={isResetState}
                        >
                          {isResetState ? <LockKeyholeOpenIcon /> : <LockKeyholeIcon />}
                          <span className={"text-xs sm:text-sm"}>
                            {isResetState ? "HWID already reset" : "Reset Hardware ID"}
                          </span>
                        </Button>

                        <AlertDialog open={hardwareIdDialog} onOpenChange={setHardwareIdDialog}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm HWID reset?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Once you reset your HWID, you&apos;ll have to wait before doing it again. Make sure it&apos;s really an invalid HWID issue before proceeding.                      
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button
                                variant={"destructive"}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (isBanned) return;
                                  if (isResetState) {
                                    toast.error("Your HWID is already reset.");
                                    return;
                                  }

                                  toast.promise(
                                    (async () => {
                                      const response = await fetch("/api/reset-hwid", {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                          lrm_serial: subscription?.lrm_serial
                                        })
                                      });
                                    
                                      if (!response.ok) {
                                        const errorData = await response.json();
                                        throw new Error(errorData.error || "HWID reset failed.");
                                      }
                                      
                                      return await response.json();
                                    })(),
                                    {
                                      loading: "Resetting your HWID...",
                                      success: (data) => {
                                        setHardwareIdDialog(false);
                                        return data.success || "HWID reset successful!";
                                      },
                                      error: (error) => {
                                        setHardwareIdDialog(false);
                                        return error.message;
                                      }
                                    }
                                  );
                                }
                              }
                              >
                                Continue
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {purchaseHistory.length > 0 && (
                          <div className="mt-2">
                            <Sheet>
                              <SheetTrigger asChild>
                                {isMember && (
                                  <Button
                                    variant="secondary"
                                    className="w-full flex items-center justify-center py-2 cursor-pointer"
                                  >
                                    <PackageIcon />
                                    <span className="text-xs sm:text-sm">
                                      Subscription History
                                    </span>
                                  </Button>
                                )}
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Purchase History</SheetTitle>
                                  <SheetDescription>
                                    Here you can view your past purchases and subscription
                                    history.
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="flex flex-col space-y-2 px-2 w-full justify-center">
                                  {purchaseHistory.map((purchase, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-row items-center gap-2"
                                    >
                                      <PackageIcon className="min-h-5 min-w-5 max-w-5 max-h-5 w-5 h-5 text-gray-400" />
                                      <div className="px-2 py-2">
                                        <p className="text-sm font-medium">
                                          {purchase.order_id}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Date:{" "}
                                          {new Date(
                                            purchase.claimed_at
                                          ).toLocaleDateString()}
                                        </p>

                                        {purchase.key_duration ? (
                                          <>
                                            <p className="text-xs">
                                              Duration: {purchase.key_duration}
                                            </p>
                                          </>
                                        ) : (
                                          <p className="text-xs">Duration: Lifetime</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </SheetContent>
                            </Sheet>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full flex justify-center mt-6">
                        <Button
                          variant="destructive"
                          className={cn("w-full max-w-xs bg-red-600 hover:bg-red-700 cursor-pointer")}
                          onClick={signout}
                        >
                          Sign Out
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {/* honestly, idc... */}

                      {!isBanned && (
                        <>
                          {isLifetime ? (
                            <RainbowButton disabled className="w-full">
                              {isExpired ? "Buy" : "Extend"} Subscription
                            </RainbowButton>
                          ) : (
                            <Link href="/shop" className="w-full">
                              <RainbowButton className="w-full">
                                {isExpired ? "Buy" : "Extend"} Subscription
                              </RainbowButton>
                            </Link>
                          )}
                        <Button
                          variant="destructive"
                          className="w-full bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={signout}
                        >
                          Sign Out
                        </Button>
                        </>
                      )}
                    </div>

                    <CardFooter className="w-full flex items-center justify-center text-muted-foreground text-xs font-medium mt-2 -mb-14">
                      User updated {lastSyncTime}
                    </CardFooter>                      
                  </>
                ) : (
                  <>
                    <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider mt-2">
                      You&apos;re not a registered member.                  
                    </h3>
                    <Link href="/shop" className="w-full">
                      <RainbowButton className="w-full font-bold mt-2">
                        Buy mspaint
                      </RainbowButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isExpired && (
        <p className="fixed left-0 bottom-0 mb-2 text-center w-full text-xs text-muted-foreground font-medium mt-1">
          Thank you for supporting mspaint ❤️
        </p>
      )}
    </div>
  );
}
