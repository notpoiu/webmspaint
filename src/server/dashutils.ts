"use server";

import { sql } from "@vercel/postgres";
import { isUserAllowedOnDashboard } from "./authutils";
import { _internal_create_serial, createInterval, HTTP_METHOD } from "@/lib/utils";
import { rateLimitService } from "./ratelimit";

const LRM_Headers = {
  Authorization: `Bearer ${process.env.LRM_PROXY_API_KEY}`,
  "Content-Type": "application/json",
};


/**
 * A simple handler to do CRUD operations with luarmor users, decreasing code footprint.
 * @param method GET, POST, PATCH, DELETE
 * @param filters refer to https://docs.luarmor.net/#getting-users for more information
 * @param path extra manipulation in the same branch as the user, for now is only exclusive for "/resethwid" refer to https://docs.luarmor.net/#resetting-the-hwid-of-a-key
 * @returns
 */
export async function RequestLuarmorUsersEndpoint(
  method: HTTP_METHOD,
  filters: string = "",
  body: unknown = null,
  path: string = ""
) {
  const apiUrl = `${process.env.LRM_PROXY_URL}/v3/projects/${
    process.env.LRM_PROJECT_ID
  }/users${filters == "" ? "" : "?" + filters}${path}`;

  if (body) {
    const response = await fetch(apiUrl, {
      method,
      headers: LRM_Headers,
      body: JSON.stringify(body),
    });
    return response;
  }

  const response = await fetch(apiUrl, {
    method: method,
    headers: LRM_Headers,
  });
  return response;
}

export async function GenerateSerial(
  invoiceID: string | null,
  amount: number,
  durationMinutes: number | null = null
) {
  const allowed = await isUserAllowedOnDashboard();

  if (!allowed) {
    return {
      status: 403,
      error: "nah",
    };
  }

  let actualInvoiceId = invoiceID;

  if (typeof invoiceID === "string") {
    if (actualInvoiceId?.trim() === "") {
      actualInvoiceId = "REPLACEMENT";
    }
  } else if (invoiceID === null) {
    actualInvoiceId = "REPLACEMENT";
  } else if (invoiceID === undefined) {
    actualInvoiceId = "REPLACEMENT";
  }

  if (amount < 1) {
    return {
      status: 400,
      error: "amount must be greater than 0",
    };
  }

  if (amount > 50) {
    return {
      status: 400,
      error: "amount must be less than 50",
    };
  }

  const serials = [];
  for (let i = 0; i < amount; i++) {
    const serial = _internal_create_serial();

    const invoiceIDToInsert = actualInvoiceId?.replaceAll(
      "{UUID}",
      crypto.randomUUID()
    );

    const validFor = createInterval(durationMinutes);

    await sql`INSERT INTO mspaint_keys_new (serial, order_id, claimed_at, key_duration, linked_to) VALUES (${serial}, ${invoiceIDToInsert}, NULL, ${validFor}, NULL)`;
    serials.push(serial);
  }

  return serials;
}

export async function DeleteSerial(serial: string) {
  const allowed = await isUserAllowedOnDashboard();

  if (!allowed) {
    return {
      status: 403,
      error: "nah",
    };
  }

  const { rows } =
    await sql`SELECT * FROM mspaint_keys_new WHERE serial = ${serial}`;

  if (rows.length === 0) {
    return {
      status: 404,
      error: "key not found",
    };
  }

  await sql`DELETE FROM mspaint_keys_new WHERE serial = ${serial}`;
  return {
    status: 200,
    success: "key deleted successfully",
  };
}

export async function GetUserSubscription(discord_id: string) {
  const { rows } = await sql`SELECT * FROM mspaint_users 
    WHERE discord_id = ${discord_id}
  `;
  return rows[0] || null;
}

export async function GetUserPurchaseHistory(discord_id: string) {
  const { rows } = await sql`SELECT * FROM mspaint_keys_new 
    WHERE linked_to = ${discord_id}
    ORDER BY claimed_at DESC
  `;
  return rows;
}

// TODO: Implement Luarmor API update logic
export async function ModifySubscription(
  discord_id: string,
  durationMinutes: number
) {
  // Check admin permissions
  const allowed = await isUserAllowedOnDashboard();
  if (!allowed) return { status: 403, error: "Permission denied" };

  // Find user's active subscription
  const userSub = await GetUserSubscription(discord_id);
  if (!userSub) return { status: 404, error: "User subscription not found" };

  // Calculate new expiration
  const currentExpiration = userSub.expires_at
    ? new Date(userSub.expires_at)
    : new Date();
  const newExpiration = new Date(
    currentExpiration.getTime() + durationMinutes * 60 * 1000
  );

  // Update auth_expire in luarmor, then syncronize later
  // Luarmor API integration placeholder

  return { status: 200, success: "Subscription updated" };
}

export async function GetAllSerialData() {
  const allowed = await isUserAllowedOnDashboard();

  if (!allowed) {
    return {
      status: 403,
      error: "nah",
    };
  }

  const { rows } = await sql`
    SELECT *
    FROM public.mspaint_keys_new AS k
    LEFT JOIN public.mspaint_users AS u
    ON k.linked_to = u.discord_id;`;

  return rows;
}

export async function GetAllUserData() {
  const allowed = await isUserAllowedOnDashboard();

  if (!allowed) {
    return {
      status: 403,
      error: "nah",
    };
  }

  const { rows } = await sql`SELECT * FROM mspaint_users`;
  return rows;
}

export async function SyncSingleLuarmorUser(discord_id: string) {
  const allowed = await isUserAllowedOnDashboard();
  if (!allowed) return { status: 403, error: "Permission denied" };

  const response = await RequestLuarmorUsersEndpoint(
    HTTP_METHOD.GET,
    `discord_id=${discord_id}`
  );

  if (!response.ok) {
    return {
      status: 500,
      error: `Luarmor API error: ${response.status}`,
    };
  }

  const data = await response.json();
  const user = data.users?.[0];

  if (!user) {
    return { status: 404, error: "User not found in Luarmor" };
  }

  const timestamp_expire = parseInt(user.auth_expire, 10);
  const expireTime =
    timestamp_expire == -1 ? -1 : new Date(timestamp_expire * 1000).getTime();
  try {
    await sql`UPDATE mspaint_users
      SET expires_at = ${expireTime}, 
      is_banned = ${Boolean(user.banned)}, 
      user_status = ${user.status}, 
      last_sync = ${Date.now()}
      WHERE discord_id = ${discord_id}
    `;
    return { status: 200, success: "User synced successfully" };
  } catch (error) {
    return { status: 500, error: `Unable to sync: ${error}` };
  }
}

export async function SyncExpirationsFromLuarmor(step: number, authbypass?: string) {

  if (!authbypass || authbypass !== `Bearer ${process.env.CRON_SECRET}`) {
    const allowed = await isUserAllowedOnDashboard();
    if (!allowed) return { status: 403, error: "Permission denied" };
  }

  const batchSize = 1500;
  let totalUpdated = 0;

  const minRange = (step - 1) * batchSize
  const maxRange = minRange + batchSize - 1

  // 1. Fetch the batch
  await rateLimitService.trackRequest("syncuser");
  const response = await RequestLuarmorUsersEndpoint(
    HTTP_METHOD.GET,
    `from=${minRange}&until=${maxRange}`
  );

  if (!response.ok) {
    return {
      status: 500,
      error: `Luarmor API error: ${response.status}`,
    };
  }

  const data = await response.json();
  const users = data.users || [];
  
  //need to get before filtering to avoid step issues
  const totalUsers = users.length;

  // 2. Normalize & filter out any without user_key
  const filteredRows = users
    .filter((u: { discord_id: string; note?: string }) => u.discord_id != "" && u.note != "Ad Reward")
    .map((u: {
      user_key: string; discord_id: string; auth_expire: string; banned: boolean; status: string;}) => {
      const expireAt = parseInt(u.auth_expire, 10);
      return {
        lrm_serial: u.user_key!,
        discord_id: u.discord_id,
        expires_at: expireAt === -1 ? -1 : new Date(expireAt * 1000).getTime(),
        is_banned: Boolean(u.banned),
        user_status: u.status
      };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = filteredRows.flatMap((r: any) => [
    r.lrm_serial,
    r.discord_id,
    r.expires_at,
    r.is_banned,
    r.user_status
  ]);

  const placeholders = filteredRows
    .map((_: unknown, i: number) => {
      const baseIndex = i * 5;
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
    })
  .join(', ');

  // Bulk INSERT … ON CONFLICT … DO UPDATE
  if (filteredRows.length > 0) {
    const query = `
      INSERT INTO mspaint_users (lrm_serial, discord_id, expires_at, is_banned, user_status)
      VALUES ${placeholders}
      ON CONFLICT (discord_id)
      DO UPDATE SET
        lrm_serial = EXCLUDED.lrm_serial,
        expires_at = EXCLUDED.expires_at,
        is_banned = EXCLUDED.is_banned,
        user_status = EXCLUDED.user_status
      WHERE
        mspaint_users.lrm_serial IS DISTINCT FROM EXCLUDED.lrm_serial
        OR mspaint_users.expires_at IS DISTINCT FROM EXCLUDED.expires_at
        OR mspaint_users.is_banned IS DISTINCT FROM EXCLUDED.is_banned
        OR mspaint_users.user_status IS DISTINCT FROM EXCLUDED.user_status;
    `;

    const insertResult = await sql.query(query, values);
    totalUpdated = insertResult.rowCount ?? 0;
  }

  // Check if we should fetch next batch
  const hasMore = users.length > 0;

  if (hasMore) {
    return {
      status: 206,
      total_updated: totalUpdated,
      total_users: totalUsers
    };      
  }

  //Finally update the syncronization time for all users
  try {
    const currentUnixtime = Date.now();
    await sql`UPDATE mspaint_users SET last_sync = ${currentUnixtime}`
  } catch (error) {
    return {
      status: 200,
      total_updated: totalUpdated,
      total_users: totalUsers,
      warning: "Unable to update syncronization status."
    };
  }

  return {
    status: 200,
    total_updated: totalUpdated,
    total_users: totalUsers,    
  };
}

export async function ResetHardwareIDWithLuarmor(lrm_serial: string, force: boolean = false) {  
  
  const response = await RequestLuarmorUsersEndpoint(HTTP_METHOD.POST, "", {
    user_key: lrm_serial,
    force
  }, "/resethwid");

  if (!response.ok) {
    return {
      status: 500,
      error: `Luarmor API error: ${response.status}`,
    };
  }

  const data = await response.json();
  if (!data.success) {
    return {
      status: 500,
      error: data.message,
    };
  }

  return { status: 200, success: "Your HWID has been successfully reset."};
}