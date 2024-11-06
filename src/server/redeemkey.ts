"use server";

import { sql } from "@vercel/postgres";
import { isUserAllowedOnDashboard } from "./authutils";

export async function RedeemKey(serial: string, user_id: string) {
    if (user_id === "skibidiSigma") {
        return {
            status: 403,
            error: "user_id is invalid"
        }
    }

    const { rows } = await sql`SELECT * FROM mspaint_keys WHERE serial = ${serial}`;

    if (rows.length === 0 || rows[0].claimed === true) {
        return {
            status: 404,
            error: "key not found"
        }
    }

    const LRM_Headers = {
        "Authorization": `Bearer ${process.env.LRM_PROXY_API_KEY}`,
        "Content-Type": "application/json"
    }

    const checkpointKeyResponse = await fetch(`${process.env.LRM_PROXY_URL}/v3/projects/${process.env.LRM_PROJECT_ID}/users?discord_id=${user_id}`, {
        method: "GET",
        headers: LRM_Headers
    })

    const checkpointKey = await checkpointKeyResponse.json();
    let does_user_have_checkpoint_key = false;
    if (checkpointKey.users.length !== 0) {
        if (checkpointKey.users[0].note === "Ad Reward") {
            does_user_have_checkpoint_key = true;
        }

        if (!does_user_have_checkpoint_key) {
            return {
                status: 403,
                error: "user already has a permanent key"
            }
        }
    }

    if (does_user_have_checkpoint_key) {
        await fetch(`${process.env.LRM_PROXY_URL}/v3/projects/${process.env.LRM_PROJECT_ID}/users?user_key=${checkpointKey.users[0].user_key}`, {
            method: "DELETE",
            headers: LRM_Headers
        })
    }

    const keyCreationResponse = await fetch(`${process.env.LRM_PROXY_URL}/v3/projects/${process.env.LRM_PROJECT_ID}/users`, {
        method: "POST",
        headers: LRM_Headers,
        body: JSON.stringify({
            discord_id: user_id,
            note: "Lifetime key sellapp - " + serial,
        })
    })

    const keyCreation = await keyCreationResponse.json();

    if (keyCreation.error) {
        return {
            status: 500,
            error: keyCreation.message
        }
    }

    await sql`UPDATE mspaint_keys SET claimed = true, claimed_discord_id = ${user_id}, lrm_serial = ${keyCreation.user_key} WHERE serial = ${serial}`;
    return {
        status: 200,
        success: "key redeemed successfully",
        user_key: keyCreation.user_key
    };
}

function _internal_create_serial() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let serial = "";

    for (let i = 0; i < 16; i++) {
        serial += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return serial;
}

export async function GenerateSerial(invoiceID: string | null, amount: number) {
    const allowed = await isUserAllowedOnDashboard();

    if (!allowed) {
        return {
            status: 403,
            error: "nah"
        }
    }

    let actualInvoiceId = invoiceID;

    if (typeof invoiceID === "string") {
        if (actualInvoiceId?.trim() === "") { actualInvoiceId = "REPLACEMENT" }
    } else if (invoiceID === null) {
        actualInvoiceId = "REPLACEMENT";
    }

    if (amount < 1) {
        return {
            status: 400,
            error: "amount must be greater than 0"
        }
    }

    if (amount > 50) {
        return {
            status: 400,
            error: "amount must be less than 50"
        }
    }

    const serials = [];
    for (let i = 0; i < amount; i++) {
        const serial = _internal_create_serial();
        await sql`INSERT INTO mspaint_keys (serial, order_id, claimed) VALUES (${serial}, ${actualInvoiceId}, false);`;
        serials.push(serial);
    }

    return serials;
}

export async function DeleteSerial(serial: string) {
    const allowed = await isUserAllowedOnDashboard();

    if (!allowed) {
        return {
            status: 403,
            error: "nah"
        }
    }

    const { rows } = await sql`SELECT * FROM mspaint_keys WHERE serial = ${serial}`;

    if (rows.length === 0) {
        return {
            status: 404,
            error: "key not found"
        }
    }

    await sql`DELETE FROM mspaint_keys WHERE serial = ${serial}`;
    return {
        status: 200,
        success: "key deleted successfully"
    }
}

export async function GetAllSerialData() {
    const allowed = await isUserAllowedOnDashboard();

    if (!allowed) {
        return {
            status: 403,
            error: "nah"
        }
    }

    const { rows } = await sql`SELECT * FROM mspaint_keys`;
    return rows;
}