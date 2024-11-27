import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, slug: { params: { discord_id: string } }) {
    const discord_id = slug.params.discord_id;
    const response = await fetch(`https://discord.com/api/v10/users/${discord_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        },
        next: {
            revalidate: 60
        }
    })

    const data = await response.json();
    return NextResponse.json(data, {
        status: response.status,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });
}