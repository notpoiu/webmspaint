import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";
import z from "zod";

const schema = z.object({
    exec: z.string(),
    placeid: z.number(),
    gameid: z.number()
})

export async function POST(req: NextRequest) {
    const { success, data, error } = schema.safeParse(await req.json());

    if (!success) {
        return new Response(error.message, {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const timestamp = Date.now();
    const telemetryData = {
      ...data,
      timestamp
    };
    
    const uniqueKey = `telemetry:${timestamp}:${data.placeid}:${data.gameid}`;
    
    try {
        await kv.set(uniqueKey, telemetryData, {
            ex: 30 * 24 * 60 * 60
        });

        await kv.sadd('telemetry:all-keys', uniqueKey);
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error("Failed to store telemetry data:", err);
        return new Response(JSON.stringify({ success: false, error: "Failed to store data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}