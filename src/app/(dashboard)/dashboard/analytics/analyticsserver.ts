"use server";

import { kv } from "@vercel/kv";

export type TelemetryData = {
  exec: string;
  placeid: number;
  gameid: number;
  timestamp: number;
};

/**
 * Retrieves telemetry data with pagination and filtering options
 */
export async function getTelemetryData({
  startDate,
  endDate,
  placeId,
  gameId
}: {
  limit?: number;
  offset?: number;
  startDate?: number;
  endDate?: number;
  placeId?: number;
  gameId?: number;
} = {}): Promise<{
  data: TelemetryData[];
  totalCount: number;
}> {
  try {
    // Get all keys from the set
    let allKeys = await kv.smembers('telemetry:all-keys') as string[];
    
    // Sort keys in descending order (newest first)
    allKeys = allKeys.sort().reverse();
    
    // Filter keys if needed
    if (startDate || endDate || placeId || gameId) {
      const filteredKeys: string[] = [];
      
      for (const key of allKeys) {
        const data = await kv.get(key) as TelemetryData | null;
        if (data) {
          // No need to JSON.parse - KV already returns the deserialized object
          let includeItem = true;
          
          if (startDate && data.timestamp < startDate) includeItem = false;
          if (endDate && data.timestamp > endDate) includeItem = false;
          if (placeId !== undefined && data.placeid !== placeId) includeItem = false;
          if (gameId !== undefined && data.gameid !== gameId) includeItem = false;
          
          if (includeItem) {
            filteredKeys.push(key);
          }
        }
      }
      
      allKeys = filteredKeys;
    }
    
    // Retrieve all telemetry data for these keys
    const telemetryData = await Promise.all(
      allKeys.map(async (key) => {
        const data = await kv.get(key) as TelemetryData | null;
        
        if (!data) {
          await kv.srem('telemetry:all-keys', key);
          return null;
        }

        return data;
      })
    );
    
    // Filter out any null values (in case keys expired)
    const validData = telemetryData.filter((item): item is TelemetryData => item !== null);
    
    return {
      data: validData,
      totalCount: validData.length
    };
  } catch (err) {
    console.error("Failed to retrieve telemetry data:", err);
    throw new Error("Failed to retrieve telemetry data");
  }
}

/**
 * Gets telemetry statistics
 */
export async function getTelemetryStats(): Promise<{
  totalCount: number;
  uniquePlaceIds: number;
  uniqueGameIds: number;
  mostRecentTimestamp: number | null;
}> {
  try {
    // Get all keys and fetch data
    const allKeys = await kv.smembers('telemetry:all-keys') as string[];
    
    if (allKeys.length === 0) {
      return {
        totalCount: 0,
        uniquePlaceIds: 0,
        uniqueGameIds: 0,
        mostRecentTimestamp: null
      };
    }
    
    const telemetryData = await Promise.all(
      allKeys.map(async (key) => {
        // No need to JSON.parse - KV already returns the deserialized object
        return await kv.get(key) as TelemetryData | null;
      })
    );
    
    const validData = telemetryData.filter((item): item is TelemetryData => item !== null);
    
    const placeIds = new Set(validData.map(item => item.placeid));
    const gameIds = new Set(validData.map(item => item.gameid));
    const timestamps = validData.map(item => item.timestamp);
    
    return {
      totalCount: validData.length,
      uniquePlaceIds: placeIds.size,
      uniqueGameIds: gameIds.size,
      mostRecentTimestamp: timestamps.length > 0 ? Math.max(...timestamps) : null
    };
  } catch (err) {
    console.error("Failed to retrieve telemetry stats:", err);
    throw new Error("Failed to retrieve telemetry statistics");
  }
}