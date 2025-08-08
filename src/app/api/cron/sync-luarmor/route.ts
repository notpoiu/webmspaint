import { NextResponse } from "next/server";
import { SyncExpirationsFromLuarmor } from "@/server/dashutils";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";
const FriendyCronName = "Cronjob sync-luarmor users:";

export async function GET(request: Request) {
  // Verify authentication
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.LRM_PROXY_API_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  console.log(FriendyCronName, " API called!");
  try {
    // Get current step from database
    const { rows } = await sql`
      SELECT last_step FROM mspaint_cron_state
      WHERE job_id = 'luarmor_sync'
    `;
    let currentStep = rows[0]?.last_step || 0;
    let totalProcessed = 0;

    // Process batches until sync is complete
    while (true) {
      const result = await SyncExpirationsFromLuarmor(currentStep, authHeader);

      if (result.status === 206) {
        // Update step and continue
        currentStep++;
        totalProcessed += result.total_users || 0;
        await sql`UPDATE mspaint_cron_state SET last_step = ${currentStep} WHERE job_id = 'luarmor_sync'`;

        console.log(FriendyCronName, `Partial update step ${currentStep}`);
        // Wait 30 seconds before next batch
        await new Promise((resolve) => setTimeout(resolve, 30000));
        continue;
      }

      if (result.status === 200) {
        // Reset step counter after full sync
        await sql`UPDATE mspaint_cron_state SET last_step = 0 WHERE job_id = 'luarmor_sync'`;
        console.log(
          FriendyCronName,
          `completed -> updated ${result.total_updated}, syncrozined ${totalProcessed} users.`
        );
        return NextResponse.json({
          status: "completed",
          totalProcessed,
          message: "Sync completed successfully",
        });
      }

      throw new Error(result.error || "Sync failed");
    }
  } catch (error) {
    const failMessage = `Sync failed: ${(error as Error).message}`;
    console.log(FriendyCronName, failMessage);

    return NextResponse.json({ error: failMessage }, { status: 500 });
  }
}
