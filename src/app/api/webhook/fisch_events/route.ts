import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const placeid = "16732694052";

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

export async function POST(req: NextRequest) {
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