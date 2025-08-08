import { NextResponse } from "next/server";

export const dynamic = "force-static";

type CronJob = {
  id: string;
  path: string;
  schedule: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description?: string;
};

const jobs: CronJob[] = [
  {
    id: "sync-luarmor",
    path: "/api/cron/sync-luarmor",
    schedule: "*/30 * * * *",
    method: "GET",
    description:
      "Sync expirations from Luarmor users in batches until completion",
  },
];

export async function GET() {
  return NextResponse.json({ jobs });
}
