import { ResetHardwareIDWithLuarmor, SyncSingleLuarmorUserByDiscord, SyncSingleLuarmorUserByLRMSerial } from "@/server/dashutils";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitService } from "@/server/ratelimit";
import { isUserAllowedOnDashboard } from "@/server/authutils";

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
    const limiter = rateLimitService.getLimiter("hwidreset");
    const { success } = await limiter.limit(discordId);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit reached: You can only try to reset your HWID once every 6 hours." },
        { status: 429 }
      );
    }
  }

  try {
    const { lrm_serial } = await request.json();
    if (!lrm_serial) {
      return NextResponse.json({ error: "Missing lrm_serial" }, { status: 400 });
    }
    await rateLimitService.trackRequest("hwidreset", discordId);

    const result = await ResetHardwareIDWithLuarmor(lrm_serial, isAdmin);
    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    try {
      const resultSync = await SyncSingleLuarmorUserByLRMSerial(lrm_serial);
      if (resultSync.status === 200) {
        return NextResponse.json({ success: result.success });
      } else {
        const resultSync = await SyncSingleLuarmorUserByDiscord(discordId);
        if (resultSync.status === 200) {
          return NextResponse.json({ success: result.success });
        }
        throw Error(result.error || "Sync failed")
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed";
      result.success += `\nWarning: ${message}`;
    }

    return NextResponse.json({ success: result.success });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error (reset-hwid)" },
      { status: 500 }
    );
  }
}
