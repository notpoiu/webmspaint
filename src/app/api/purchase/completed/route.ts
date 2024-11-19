import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { ipAddress } from "@vercel/functions";
import crypto from "crypto";

const isDev = process.env.NODE_ENV === "development";

function createSerial() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let serial = "";

    for (let i = 0; i < 16; i++) {
        serial += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return serial;
}

async function getIp(headersList: Headers, request: NextRequest) {
    const cloudflareIP = headersList.get("cf-connecting-ip");
    if (cloudflareIP) return cloudflareIP;

    const mspaintIP = headersList.get("x-mspaint-ip");
    if (mspaintIP && mspaintIP !== "") return mspaintIP;

    const vercelIP = ipAddress(request);
    if (vercelIP) return vercelIP;

    if (request) {
        if (request.ip) return request.ip;
    }

    const forwarded = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");

    if (forwarded) return forwarded.split(",")[0].trim();
    if (realIp) return realIp.trim();
    
    return undefined;
}

export async function POST(request: NextRequest) {
    const payload = await request.text();
    const signature = request.headers.get("signature");
    const secret = process.env.SELLAPP_WEBHOOK_SECRET ?? "sigma";
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (hash === signature) {
        const data = JSON.parse(payload);
        
        const createdSerials = [];
    
        for (let i = 0; i < data.quantity; i++) {
            const serial = createSerial();
            await sql`INSERT INTO mspaint_keys (serial, order_id, claimed) VALUES (${serial}, ${data.invoice.id}, false);`;
            createdSerials.push(serial);
        }
        
        return new Response(`Thank you for purchasing ${data.quantity} mspaint key(s)!\nYou can redeem your serial(s) at https://www.mspaint.cc/purchase/completed?serial=${encodeURIComponent(createdSerials.join(","))}\n\nMake sure to keep this link safe, as it is the only way to redeem your key(s).`);
    } else {
        return new Response("Invalid signature");
    }
}

export async function GET(request: NextRequest) {
    const request_ip = await getIp(request.headers, request);
    
    if (isDev ? false : !request_ip) {
        return NextResponse.json({
            status: 400,
            error: "bad request (ip not found), please contact support (https://discord.gg/Q6gHakV36z)"
        })
    }

    const order_id = request.nextUrl.searchParams.get("order_id");
    const order_email = request.nextUrl.searchParams.get("email");

    if (!order_id || !order_email) {
        return NextResponse.json({
            status: 400,
            error: "bad request, please contact support (https://discord.gg/Q6gHakV36z)"
        })
    }

    const response = await fetch("https://sell.app/api/v2/invoices/" + order_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.SELLAPP_API_KEY,
        },
    })

    const deliverablesResponse = await fetch(`https://sell.app/api/v2/invoices/${order_id}/deliverables`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.SELLAPP_API_KEY
        }
    })

    if (!response.ok) {
        return NextResponse.json({
            status: 500,
            error: "internal server error, please contact support (https://discord.gg/Q6gHakV36z)"
        })
    }

    const invoice = await response.json();
    const deliverables = await deliverablesResponse.json();

    const invoiceData = invoice.data;
    if (invoiceData.customer_information.email !== order_email || invoiceData.status.status.status !== "COMPLETED" || (!isDev && invoiceData.customer_information.ip !== request_ip)) {
        return NextResponse.json({
            status: 400,
            error: "bad request (data mismatch), please contact support (https://discord.gg/Q6gHakV36z)"
        })
    }

    await sql`CREATE TABLE IF NOT EXISTS mspaint_keys ( serial TEXT PRIMARY KEY, order_id TEXT NOT NULL, claimed BOOL, claimed_discord_id TEXT, lrm_serial TEXT );`
    const { rows } = await sql`SELECT * FROM mspaint_keys WHERE order_id = ${order_id};`

    let claimedCount = 0;
    for (const row of rows) {
        if (row.claimed) { claimedCount++; }
    }

    const isAllClaimed = (claimedCount === deliverables.data[0].quantity);

    if (rows.length > 0 && !isAllClaimed) {
        return redirect("/purchase/completed?serial=" + encodeURIComponent(rows.map(row => row.serial).join(",")));
    }

    return NextResponse.json({
        status: 400,
        error: "bad request (all keys claimed), please contact support (https://discord.gg/Q6gHakV36z)"
    })
}