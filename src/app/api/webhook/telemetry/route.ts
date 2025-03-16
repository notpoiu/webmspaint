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
    
    try {
        await kv.sadd('telemetryv2:all-keys', telemetryData);
        
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