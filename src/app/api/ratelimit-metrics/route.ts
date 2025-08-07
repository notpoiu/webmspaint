import { rateLimitService } from "@/server/ratelimit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const results = await rateLimitService.getMetrics();
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch rate limit metrics" },
      { status: 500 }
    );
  }
}
