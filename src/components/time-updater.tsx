"use client"

import React, { useState, useEffect, useRef } from 'react';
import { calculateTimeStringRemaining, calculateTimeStringRemainingFormated } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';

interface TimeUpdaterProps {
  initialTimeLeft: number;
  freezeAfterTimeout?: boolean;
}

export function TimeUpdater({ initialTimeLeft, freezeAfterTimeout = false }: TimeUpdaterProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeftText, setTimeLeftText] = useState("");
  const [timeLeftColor, setTimeLeftColor] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle updates when initialTimeLeft changes
  useEffect(() => {
    setIsLoading(true);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const updatedTimeLeft = initialTimeLeft - 1200;
      
      // Calculate time display
      const [_, color] = calculateTimeStringRemainingFormated(updatedTimeLeft);
      const [formattedText] = calculateTimeStringRemaining(Date.now(), updatedTimeLeft);
      
      setTimeLeftText(formattedText ?? "Unknown");
      setTimeLeftColor(color);
      setIsLoading(false);
    }, 1200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, freezeAfterTimeout ? [] : [initialTimeLeft]);

  if (isLoading) {
    return (
      <div className="flex items-center">
        <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <span className={timeLeftColor}>
      {timeLeftText}
    </span>
  );
}
