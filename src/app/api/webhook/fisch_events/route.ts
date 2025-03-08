import { NextRequest, NextResponse } from "next/server";
import { kv } from '@vercel/kv';
import z from "zod";

const placeid = "16732694052";
const RATE_LIMIT = 5; // 5 requests per minute
const WINDOW_TIME = 60; // 60 seconds (1 minute)

const roleids = {
    "Whales Pool": "1343405201570136175",
    "Forsaken Veil - Scylla": "1347957434752307231",
    "Lovestorm Eel": "1347957836411305994",
    "Lovestorm Eel Supercharged": "1347957836411305994",
    "Orcas Pool": "1347957895156727892",
    "Ancient Orcas Pool": "1347957895156727892",
    "Megalodon Default": "1347957933220302918",
    "Megalodon Ancient": "1347957933220302918",
    "Whale Shark": "1347957991177060473",
    "Great White Shark": "1347957991177060473",
    "Great Hammerhead Shark": "1347958071175151616",
    "The Kraken Pool": "1347958142927110234",
    "Ancient Kraken Pool": "1347958142927110234",
    "Golden Tide": "1347958220215287938"
}

const schema = z.object({
    event: z.enum([
        "Whales Pool",
        "Forsaken Veil - Scylla",
        "Lovestorm Eel",
        "Lovestorm Eel Supercharged",
        "Orcas Pool",
        "Ancient Orcas Pool",
        "Megalodon Default",
        "Megalodon Ancient",
        "Whale Shark",
        "Great Hammerhead Shark",
        "Great White Shark",
        "The Kraken Pool",
        "Ancient Kraken Pool",
        "Golden Tide"
    ]),
    cycle: z.enum([
        "Day",
        "Night"
    ]),
    uptime: z.number(),
    jobid: z.string().uuid()
})

function serverUptime(uptime: number) {
    const seconds = Math.floor(uptime);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

async function checkRateLimit(ip: string): Promise<boolean> {
    const key = `ratelimit:${ip}`;
    
    // Get current count and TTL
    const count = await kv.get<number>(key) || 0;
    const ttl = await kv.ttl(key);

    console.log("ok checking rate limit");
    console.log(count, ttl, key);
    
    if (count === 0) {
      await kv.set(key, 1, { ex: WINDOW_TIME });
      return true;
    } else if (count < RATE_LIMIT) {
      await kv.incr(key);
      // Reset expiry time if it wasn't set or is about to expire
      if (ttl < 0 || ttl < WINDOW_TIME / 2) {
        await kv.expire(key, WINDOW_TIME);
      }
      return true;
    } else {
      return false;
    }
}

async function getIp(headersList: Headers, request?: NextRequest) {
    const cloudflareIP = headersList.get("cf-connecting-ip");
    if (cloudflareIP) return cloudflareIP;

    if (request) {
      if (request.ip) return request.ip;
    }

    const forwarded = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");

    if (forwarded) return forwarded.split(",")[0].trim();
    if (realIp) return realIp.trim();
    
    return undefined;
}

function getHWID(headers: Headers) {
    let fingerprint = "not found";
  
    if (headers !== undefined && headers instanceof Headers) {
      headers.forEach((value: string, name: string) => {
          const val_name = name.toLocaleLowerCase();
  
          const is_fingerprint = val_name.includes("fingerprint") || val_name.includes("hwid");
          const value_exists = value != undefined && value != null && value != "";
  
          if (is_fingerprint && value_exists) {
              fingerprint = value;
          }
      });
    }

    if (headers !== undefined && headers instanceof Headers && fingerprint === "not found") {
        headers.forEach((value: string, name: string) => {
            const val_name = name.toLocaleLowerCase();

            const is_identifier = val_name.includes("identifier");
            const value_exists = value != undefined && value != null && value != "";

            if (is_identifier && value_exists) {
                fingerprint = value;
            }
        });
    }
    
    return fingerprint;
}

export async function POST(req: NextRequest) {
    const fingerprint = getHWID(req.headers);

    if (fingerprint === "not found") {
        return NextResponse.json({ status: "error", error: "Failed" });
    }

    const ip = await getIp(req.headers, req);

    if (!ip) {
        return NextResponse.json({ status: "error", error: "Could not determine client IP" });
    }

    const allowed = await checkRateLimit(ip);
    if (!allowed)
        return NextResponse.json({
            status: "error",
            error: "Rate limit exceeded. Try again in later."
        });
    

    const rawData = await req.json();
    const { success, error, data } = schema.safeParse(rawData);

    if (!success) {
        return NextResponse.json({ status: "error", error: error.issues });
    }

    const response = await fetch(process.env.FISCH_EVENTS_WEBHOOK_URL!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `<@&${roleids[data.event]}>`,
            embeds: [
                {
                    title: "Event Tracker | <:mspaint:1299074827583230085> mspaint",
                    description: `**[Event]**: ${data.event}\n**[Time]**: <t:${Math.floor(Date.now() / 1000)}:R>\n**[Current Cycle]**\n<:reply:1335730071889117255>${data.cycle}\n\n**[Server]**\n<:connect:1335730096694362163>${serverUptime(data.uptime)}\n<:reply:1335730071889117255>[Join Server](https://externalrobloxjoiner.glitch.me/join?placeId=${placeid}&jobId=${data.jobid})`,
                }
            ]
        })
    })

    if (!response.ok) {
        return NextResponse.json({ status: "error", error: "Failed to send webhook" });
    }

    return NextResponse.json({ status: "ok" });
}