"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { SyncExpirationsFromLuarmor } from "@/server/dashutils";

export default function SyncLuarmorComponent() {
  const [open, setOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [syncStep, setSyncStep] = useState(0);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setProgress(0);
    let step = 1;
    let totalUpdated = 0;
    let totalUsers = 0;
    let warningMsg = null;
    
    try {
      while (true) {
        const result = await SyncExpirationsFromLuarmor(step);
        
        if (result.status === 206) {
          // Partial content, update progress and continue
          setSyncStep(step);
          step++;

          totalUpdated += result.total_updated ?? 0;
          totalUsers += result.total_users ?? 0;

          const progressValue = Math.min((step / 5) * 100, 99); // Estimate progress
          setProgress(Math.round(progressValue));
        } else if (result.status === 200) {
          warningMsg = result.warning;
          // Final batch, show success
          setProgress(100);
          setTimeout(() => {
            setIsSyncing(false);
            setProgress(0);
          }, 1000);
          break;
        } else {
          // Error case
          setIsSyncing(false);
          throw new Error(result.error || "Sync failed (Generic)")
        }
      }

      setNotification({
        type: 'success',
        message: `Updated ${totalUpdated} out of ${totalUsers} Users! ${warningMsg ?? "Sync status updated."}`
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsSyncing(false);
      setNotification({
        type: 'error',
        message: `Unexpected error during sync: ${error.message}`
      });
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sync?</AlertDialogTitle>
            {/* Warning notification */}
            <AlertDialogDescription>
              Sync all the users from Luarmor to mspaint database.
              <br />
              <br />
              This should only be used if there was a major compensation/change
              in luarmor user subscription.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isSyncing && (
            <div className="py-4">
              <Progress value={progress} className="h-2" />
              <p className="text-center mt-2">
                Syncing... {progress}% - Step: {syncStep}
              </p>
            </div>
          )}

          {/* Result notification */}
          {notification && (
            <div
              className={`p-3 rounded-md flex justify-between items-center ${
                notification.type === "success"
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <div>
                <p
                  className={
                    notification.type === "success"
                      ? "text-green-300"
                      : "text-red-300"
                  }
                >
                  {notification.message}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSyncing}
            >
              Cancel
            </Button>
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? "Syncing..." : "Continue"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button variant="outline" onClick={() => setOpen(true)}>
        Sync from Luarmor
      </Button>
    </>
  );
}
