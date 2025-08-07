"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import React, { useState } from "react";
import { GetUserSubscription, ModifySubscription } from "@/server/dashutils";

export default function ModifySubscriptionComponent() {
  const [discordId, setDiscordId] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentExpiration, setCurrentExpiration] = useState<Date | null>(null);

  const [expireDays, setExpireDays] = useState(0);
  const [expireHours, setExpireHours] = useState(0);
  const [expireMinutes, setExpireMinutes] = useState(0);
  const [isAdding, setIsAdding] = useState<boolean | null>(true);
  const [isBanning, setIsBanning] = useState<boolean>(false);

  const loadSubscription = async () => {
    try {
      const response = await fetch(`/api/lookup/discord/${discordId}`);
      if (!response.ok) throw new Error("Failed to fetch subscription");

      const response_data = await response.json();
      setDiscordUsername(response_data.global_name);

      const data = await GetUserSubscription(discordId);
      if (data == null) throw new Error("User doesn't exist in the database.");
      if (data.key_duration != null)
        throw new Error("You can't change the duration of a lifetime user.");

      setCurrentExpiration(new Date(data.expires_at));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
      setDiscordUsername("");
      setCurrentExpiration(null);
    }
  };

  const handleSubmit = async () => {
    if (isAdding != null) {
      const duration = expireDays * 24 * 60 + expireHours * 60 + expireMinutes;
      const finalDuration = isAdding ? duration : -duration;

      const response = await ModifySubscription(discordId, finalDuration);

      if (response.status === 200) {
        toast.success(response.success);
        setIsOpen(false);
        setDiscordId("");
        setCurrentExpiration(null);
      } else {
        toast.error(response.error);
      }
    }
  };

  const newExpirationPreview = currentExpiration
    ? new Date(
        currentExpiration.getTime() +
          (isAdding ? 1 : -1) *
            (expireDays * 24 * 60 * 60 * 1000 +
              expireHours * 60 * 60 * 1000 +
              expireMinutes * 60 * 1000)
      )
    : null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Modify
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Modify Subscription</AlertDialogTitle>

          <div className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Discord ID"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
            />
            <Button onClick={loadSubscription}>Load</Button>
          </div>

          <div className="mb-2">
            {discordUsername.length != 0 && (
              <p className="text-lg font-bold">Username: {discordUsername}</p>
            )}

            {currentExpiration && (
              <>
                <p className="text-sm font-medium">Current Expiration:</p>
                <p>{currentExpiration.toLocaleString()}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm font-medium">Operation:</p>
            <Button
              variant={isAdding && !isBanning ? "default" : "outline"}
              onClick={() => {
                setIsAdding(true);
                setIsBanning(false);
              }}
              className="px-4 py-2"
            >
              Add Time
            </Button>
            <Button
              variant={!isAdding && !isBanning ? "default" : "outline"}
              onClick={() => {
                setIsAdding(false);
                setIsBanning(false);
              }}
              className="px-4 py-2"
            >
              Remove Time
            </Button>

            <Button
              variant={isBanning ? "destructive" : "outline"}
              onClick={() => {
                setIsAdding(null);
                setIsBanning(true);
              }}
              className="px-4 py-2"
            >
              Ban
            </Button>
          </div>
          {!isBanning ? (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm mb-1">Days</p>
                <Input
                  type="number"
                  value={expireDays}
                  onChange={(e) => setExpireDays(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Hours</p>
                <Input
                  type="number"
                  value={expireHours}
                  onChange={(e) => setExpireHours(Number(e.target.value))}
                  min="0"
                  max="23"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Minutes</p>
                <Input
                  type="number"
                  value={expireMinutes}
                  onChange={(e) => setExpireMinutes(Number(e.target.value))}
                  min="0"
                  max="59"
                />
              </div>
            </div>
          ) : (
            "Nah im too lazy to implement, just ban in the Luarmor panel lil bro"
          )}

          {newExpirationPreview && (
            <div className="mb-4">
              <p className="text-sm font-medium">New Expiration:</p>
              <p>{newExpirationPreview.toLocaleString()}</p>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsOpen(false);
              setDiscordId("");
              setCurrentExpiration(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={currentExpiration == null}
            onClick={handleSubmit}
          >
            Apply Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
