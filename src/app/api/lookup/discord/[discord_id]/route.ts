import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, slug: { params: Promise<{ discord_id: string }> }) {
    const discord_id = (await slug.params).discord_id;
    const response = await fetch(`https://discord.com/api/v10/users/${discord_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        },
        next: {
            revalidate: 60 * 60 * 24 * 7 // 1 week, we dont need to update this often.
        }
    })

    const data = await response.json();
    return NextResponse.json({
        id: data.id,
        global_name: data.global_name,
        username: data.username,
    }, {
        status: response.status,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });
}