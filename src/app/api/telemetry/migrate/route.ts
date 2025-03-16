import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { TelemetryData } from "@/app/(dashboard)/dashboard/analytics/analyticsserver";

export async function GET() {
  try {
    // Get all v1 keys
    const allKeys = await kv.smembers('telemetry:all-keys') as string[];
    
    if (allKeys.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No data to migrate",
        migrated: 0
      });
    }
    
    // Fetch all telemetry data from v1
    const telemetryData = await Promise.all(
      allKeys.map(async (key) => {
        return await kv.get(key) as TelemetryData | null;
      })
    );
    
    // Filter out any null values
    const validData = telemetryData.filter((item): item is TelemetryData => item !== null);
    
    // Check if we already have data in v2
    const existingV2Count = (await kv.smembers('telemetryv2:all-keys')).length;
    
    // Migrate data to v2
    if (validData.length > 0) {
      for (const data of validData) {
        await kv.sadd('telemetryv2:all-keys', data);
      }
    }
    
    // Get new count to verify
    const newV2Count = (await kv.smembers('telemetryv2:all-keys')).length;
    const actuallyMigrated = newV2Count - existingV2Count;
    
    return NextResponse.json({
      success: true,
      message: "Migration completed successfully",
      stats: {
        v1DataCount: validData.length,
        previousV2Count: existingV2Count,
        newV2Count: newV2Count,
        migrated: actuallyMigrated
      }
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Migration failed", 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
