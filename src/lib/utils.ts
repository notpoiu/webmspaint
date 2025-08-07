import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE"
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
  return twMerge(clsx(inputs))
}

export function parseIntervalToMs(interval: string): number {
  const m: { [k: string]: number } = {
    year: 365 * 24 * 60 * 60 * 1000,
    day:  24  * 60 * 60 * 1000,
    hour: 60  * 60 * 1000,
    minute: 60 * 1000
  };

  return [...interval.matchAll(/(\d+)\s*(years?|days?|hours?|minutes?)/gi)]
    .reduce((tot, [, n, u]) => {
      const unit = u.toLowerCase().replace(/s$/, '');
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

    const strYears   = years   == 0 ? '' : `${years} year${years > 1 ? 's' : ''}`
    const strDays    = days    == 0 ? '' : `${days} day${days > 1 ? 's' : ''}`
    const strHours   = hours   == 0 ? '' : `${hours} hour${hours > 1 ? 's' : ''}`
    const strMinutes = minutes == 0 ? '' : `${minutes} minute${minutes > 1 ? 's' : ''}`

    inverval = `${strYears} ${strDays} ${strHours} ${strMinutes}`;
  }

  return inverval;
}

export function calculateTimeStringRemaining(claimedDate: string | number, durationMs: number): [string | null, boolean | null] {
  try {

    const expirationTime = new Date(new Date(claimedDate).getTime() + durationMs);
    const timeLeftMs = expirationTime.getTime() - Date.now();
    
    if (timeLeftMs > 0) {

      const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minsLeft = Math.ceil((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

      let timeRemaining = '';
      if (daysLeft > 0) {
        timeRemaining += `${daysLeft} day${daysLeft > 1 ? 's' : ''}`
      } else {
        if (hoursLeft > 0) {
          timeRemaining += `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`
        } else {
          timeRemaining += `${minsLeft} minute${minsLeft > 1 ? 's' : ''}`
        }
      }
      timeRemaining += ' remaining';

      return [timeRemaining, false];
    }
    return ["Expired", true];
  } catch {
    return ["- -", null];
  }
}

export function calculateTimeStringRemainingFormated(timeLeftMs: number): [string, string] {

  const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minsLeft = Math.ceil((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  
  // Determine time left text and color
  let timeLeftText  = '';
  let timeLeftColor = '';
  
  if (timeLeftMs > 0) {
    timeLeftText = `${daysLeft > 0 ? `${daysLeft}d ` : ''}${hoursLeft}h ${minsLeft}m remaining`;
    
    if (daysLeft > 7) {
      timeLeftColor = 'text-green-500';
    } else if (daysLeft > 1) {
      timeLeftColor = 'text-blue-500';
    } else if (daysLeft > 0) {
      timeLeftColor = 'text-yellow-500';
    } else {
      timeLeftColor = 'text-orange-500';
    }
  } else {
    timeLeftText = 'Expired';
    timeLeftColor = 'text-red-500';
  }  

  return [timeLeftText, timeLeftColor];
}