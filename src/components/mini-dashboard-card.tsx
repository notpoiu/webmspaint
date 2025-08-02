"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { BoxIcon, ChevronDown, PackageIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { RainbowButton } from "./magicui/rainbow-button";
import { TimeUpdater } from "./time-updater";
import { QueryResultRow } from "@vercel/postgres";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [showHistory, setShowHistory] = useState(false);

  if (!session || !session.user) {
    router.push("/sign-in");
    return null;
  }

  // Determine subscription status
  const isLifetime = subscription?.expires_at == -1;
  const expirationDate = subscription?.expires_at ?? 0;
  const isExpired = expirationDate - Date.now() <= 0;

  const isActive =
    (subscription?.expires_at != null && !isExpired) || isLifetime;

  const timeLeftMs = expirationDate - Date.now();

  return (
    <div className="w-full max-w-md mx-auto sm:mx-0 mt-6">
      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="Discord Avatar"
                width={80}
                height={80}
                className="rounded-full border-2 border-indigo-100"
              />
            )}
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider ">
                Discord Account
              </h3>
              <p className="text-lg sm:text-xl font-semibold text-white">
                {session.user.name}
              </p>
            </div>

            <div className="mb-4">
              {/*<h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider  mt-4 sm:mt-0">
                Current Subscription
              </h3>

              <div className="flex flex-row items-center gap-2">
                <p className="text-lg sm:text-xl font-medium text-indigo-200">
                  mspaint
                </p>
                <Badge
                  className="font-bold"
                  variant={isExpired ? "destructive" : "default"}
                >
                  {isExpired == null
                    ? "Unknown"
                    : isExpired
                    ? "Inactive"
                    : "Active"}
                </Badge>
              </div> */}

              <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider  mt-2">
                subscription Status
              </h3>

              <div>
                {isActive &&
                  !isLifetime &&
                  (!isExpired ? (
                    <TimeUpdater
                      initialTimeLeft={timeLeftMs}
                      freezeAfterTimeout={true}
                    />
                  ) : (
                    <p className="text-base text-red-400 mt-2">
                      Expired - Renew Now!
                    </p>
                  ))}
                {isLifetime && (
                  <p className="text-base text-green-400 mt-2">
                    Lifetime access ★
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {/* honestly, idc... */}
              {!!isLifetime ? (
                <RainbowButton disabled={true} className="w-full">
                  {isExpired ? "Buy" : "Extend"} Subscription
                </RainbowButton>
              ) : (
                <Link href="/shop">
                  <RainbowButton className="w-full">
                    {isExpired ? "Buy" : "Extend"} Subscription
                  </RainbowButton>
                </Link>
              )}

              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={signout}
              >
                Sign Out
              </Button>
            </div>

            {purchaseHistory.length > 0 && (
              <div className="mt-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-center py-2"
                    >
                      <PackageIcon />
                      <span className="text-xs sm:text-sm">
                        Subscription History
                      </span>
                    </Button>
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
