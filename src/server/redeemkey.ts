"use server";

import { sql } from "@vercel/postgres";

export async function RedeemKey(serial: string, user_id: string) {
    if (user_id === "skibidiSigma") {
        return {
            status: 403,
            error: "user_id is invalid"
        }
    }

    const { rows } = await sql`SELECT * FROM mspaint_keys WHERE serial = ${serial}`;

    if (rows.length === 0) {
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
            discord_id: user_id
        })
    })

    const keyCreation = await keyCreationResponse.json();

    if (keyCreation.error) {
        return {
            status: 500,
            error: keyCreation.message
        }
    }

    await sql`UPDATE mspaint_keys SET claimed = true WHERE serial = ${serial}`;
    return {
        status: 200,
        success: "key redeemed successfully",
        user_key: keyCreation.user_key
    };
}