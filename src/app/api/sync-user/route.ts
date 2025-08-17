import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitService } from "@/server/ratelimit";
import { isUserAllowedOnDashboard } from "@/server/authutils";
import { SyncSingleLuarmorUserByDiscord } from "@/server/dashutils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const discordId = session.user.id;
  if (!discordId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 400 });
  }

  const isAdmin = await isUserAllowedOnDashboard();
  if (!isAdmin) {
    const limiter = rateLimitService.getLimiter("syncuser");
    const { success } = await limiter.limit(discordId);
    
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit reached: You can only sync once every 5 minutes." },
        { status: 429 }
      );
    }
  }

  try {

    await rateLimitService.trackRequest("syncuser", discordId);

    const result = await SyncSingleLuarmorUserByDiscord(discordId);

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error (Sync-user)" },
      { status: 500 }
    );
  }
}
