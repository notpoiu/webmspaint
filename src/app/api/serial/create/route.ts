import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const serialSchema = z.object({
    order_id: z.string(),
});

function _internal_create_serial() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let serial = "";

    for (let i = 0; i < 16; i++) {
        serial += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return serial;
}

export async function POST(request: NextRequest) {
    const data = await request.json();

    const serialData = serialSchema.safeParse(data);

    if (!serialData.success) {
        return NextResponse.json({
            success: false,
            key: null,
        });
    }

    if (request.headers.get("Authorization") !== `Bearer ${process.env.API_KEY}`) {
        return NextResponse.json({
            success: false,
            key: null,
        });
    }

    const generatedSerial = _internal_create_serial();
    await sql`INSERT INTO mspaint_keys (serial, order_id, claimed) VALUES (${generatedSerial}, ${serialData.data.order_id}, false);`;

    return NextResponse.json({
        success: true,
        key: generatedSerial,
    });
}