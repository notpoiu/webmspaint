import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export function _internal_create_serial() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let serial = "";

  for (let i = 0; i < 16; i++) {
    serial += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return serial;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseIntervalToSec(interval: string | null): number {
  if (!interval) return -1;
  
  const m: { [k: string]: number } = {
    year: 365 * 24 * 60 * 60,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
  };

  return [
    ...interval.matchAll(/(\d+)\s*(years?|days?|hours?|minutes?)/gi),
  ].reduce((tot, [, n, u]) => {
    const unit = u.toLowerCase().replace(/s$/, "");
    return tot + +n * (m[unit] || 0);
  }, 0);
}
/**
 * This will create an Interval used for the database and to show in the redeem key page.
 * @param durationInMinutes If this is null, the interval will also be null, indicating that the key is lifetime.
 * @returns
 */
export function createInterval(durationInMinutes: number | null) {
  let inverval = null;
  if (durationInMinutes !== null) {
    const years = Math.floor(durationInMinutes / (365 * 24 * 60));
    const remainingAfterYears = durationInMinutes % (365 * 24 * 60);
    const days = Math.floor(remainingAfterYears / (24 * 60));
    const remainingMinutes = remainingAfterYears % (24 * 60);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    const strYears = years == 0 ? "" : `${years} year${years > 1 ? "s" : ""}`;
    const strDays = days == 0 ? "" : `${days} day${days > 1 ? "s" : ""}`;
    const strHours = hours == 0 ? "" : `${hours} hour${hours > 1 ? "s" : ""}`;
    const strMinutes =
      minutes == 0 ? "" : `${minutes} minute${minutes > 1 ? "s" : ""}`;

    inverval = `${strYears} ${strDays} ${strHours} ${strMinutes}`.trim();
  }

  return inverval;
}

export function calculateTimeStringRemaining(
  claimedDate: string | number,
  durationMs: number
): [string | null, boolean | null] {
  try {
    const expirationTime = new Date(
      new Date(claimedDate).getTime() + durationMs
    );
    const timeLeftMs = expirationTime.getTime() - Date.now();

    if (timeLeftMs > 0) {
      const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor(
        (timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minsLeft = Math.ceil((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

      let timeRemaining = "";
      if (daysLeft > 0) {
        timeRemaining += `${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
      } else {
        if (hoursLeft > 0) {
          timeRemaining += `${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}`;
        } else {
          timeRemaining += `${minsLeft} minute${minsLeft > 1 ? "s" : ""}`;
        }
      }
      timeRemaining += " remaining";

      return [timeRemaining, false];
    }
    return ["Expired", true];
  } catch {
    return ["- -", null];
  }
}

export function calculateTimeStringRemainingFormated(
  timeLeftMs: number
): [string, string] {
  const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minsLeft = Math.ceil((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

  // Determine time left text and color
  let timeLeftText = "";
  let timeLeftColor = "";

  if (timeLeftMs > 0) {
    timeLeftText = `${
      daysLeft > 0 ? `${daysLeft}d ` : ""
    }${hoursLeft}h ${minsLeft}m remaining`;

    if (daysLeft >= 14) {
      timeLeftColor = "text-green-500";
    } else if (daysLeft >= 7) {
      timeLeftColor = "text-blue-500";
    } else if (daysLeft >= 4) {
      timeLeftColor = "text-yellow-500";
    } else {
      timeLeftColor = "text-orange-500";
    }
  } else {
    timeLeftText = "Expired";
    timeLeftColor = "text-red-500";
  }

  return [timeLeftText, timeLeftColor];
}

export function getTimeAgoFromUnix(unixTimestampMs: number): string {
  try {
    const now = Date.now();
    const timeDiffMs = now - unixTimestampMs;
    if (timeDiffMs <= 60000) {
      //1 minute in ms
      return "Just now";
    }

    const days = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
    const minutes = Math.max(1, Math.floor(timeDiffMs / (1000 * 60)));

    if (days >= 1) {
      if (days > 1200) return "Never";
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
  } catch {
    return "- -";
  }
}

/**
 * Normalize an epoch value to milliseconds.
 * Accepts seconds or milliseconds; returns milliseconds.
 * - If value is -1 (lifetime), returns -1 unchanged.
 * - If value appears to be in seconds (0 < n < 1e11), multiplies by 1000.
 * - If value is already in ms, returns as-is.
 */
export function normalizeEpochMs(
  epoch: number | string | null | undefined
): number | null {
  if (epoch == null) return null;
  const n = typeof epoch === "string" ? Number(epoch) : epoch;
  if (!Number.isFinite(n)) return null;
  if (n === -1) return -1;
  // Heuristic: any positive value smaller than ~Sat Mar 03 1973 in ms is likely seconds
  if (n > 0 && n < 1e11) return n * 1000;
  return n;
}
