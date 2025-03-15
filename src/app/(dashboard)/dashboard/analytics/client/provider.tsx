"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getTelemetryData, getTelemetryStats, TelemetryData } from "../analyticsserver";
import { toast } from "sonner";

interface AnalyticsContextType {
  telemetryData: TelemetryData[];
  totalCount: number;
  hasMore: boolean;
  isLoading: boolean;
  stats: {
    totalCount: number;
    uniquePlaceIds: number;
    uniqueGameIds: number;
    mostRecentTimestamp: number | null;
  } | null;
  fetchTelemetryData: (options?: {
    limit?: number;
    offset?: number;
    startDate?: number;
    endDate?: number;
    placeId?: number;
    gameId?: number;
    silent?: boolean;
  }) => Promise<void>;
  fetchStats: (silent?: boolean) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<AnalyticsContextType['stats']>(null);

  const fetchTelemetryData = useCallback(async (options?: {
    limit?: number;
    offset?: number;
    startDate?: number;
    endDate?: number;
    placeId?: number;
    gameId?: number;
    silent?: boolean;
  }) => {
    setIsLoading(true);
    
    const { silent = true, ...queryOptions } = options || {};
    
    if (silent) {
      try {
        const result = await getTelemetryData(queryOptions);
        setTelemetryData(result.data);
        setTotalCount(result.totalCount);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Error fetching telemetry data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.promise(
        async () => {
          try {
            const result = await getTelemetryData(queryOptions);
            setTelemetryData(result.data);
            setTotalCount(result.totalCount);
            setHasMore(result.hasMore);
            return result;
          } catch (error) {
            console.error("Error fetching telemetry data:", error);
            throw error;
          } finally {
            setIsLoading(false);
          }
        },
        {
          loading: 'Loading telemetry data...',
          success: 'Telemetry data loaded successfully!',
          error: 'Failed to load telemetry data.'
        }
      );
    }
  }, []);

  const fetchStats = useCallback(async (silent: boolean = true) => {
    setIsLoading(true);
    
    if (silent) {
      try {
        const result = await getTelemetryStats();
        setStats(result);
      } catch (error) {
        console.error("Error fetching telemetry stats:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.promise(
        async () => {
          try {
            const result = await getTelemetryStats();
            setStats(result);
            return result;
          } catch (error) {
            console.error("Error fetching telemetry stats:", error);
            throw error;
          } finally {
            setIsLoading(false);
          }
        },
        {
          loading: 'Loading analytics stats...',
          success: 'Analytics stats loaded successfully!',
          error: 'Failed to load analytics stats.'
        }
      );
    }
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        telemetryData,
        totalCount,
        hasMore,
        isLoading,
        stats,
        fetchTelemetryData,
        fetchStats
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  
  return context;
}