"use server";

import { sql } from "@vercel/postgres";
import { isUserAllowedOnDashboard } from "./authutils";
import {
  _internal_create_serial,
  createInterval,
  HTTP_METHOD,
} from "@/lib/utils";
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

    const validFor = durationMinutes == 0 ? "1 second" : createInterval(durationMinutes);

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

/**
 * This function works by Getting the luarmor user and updating in the mspaint DB, how it works:
 * If User NOT present in mspaint DB:
 *   - It will create a new row by the lrm_serial
 * If User IS present:
 *   - Will update the Row by the lrm_serial
 * @param lrm_serial 
 * @param from_dashboard 
 * @returns 
*/
export async function SyncSingleLuarmorUserByLRMSerial(lrm_serial: string, from_dashboard: boolean = true) {
  const allowed = await isUserAllowedOnDashboard();
  if (!allowed && from_dashboard)
    return { status: 403, error: "Permission denied" };

  const response = await RequestLuarmorUsersEndpoint(
    HTTP_METHOD.GET,
    `user_key=${lrm_serial}`
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
    await sql`UPDATE mspaint_users
      SET user_status = 'unlink'
      WHERE user_status IS DISTINCT FROM 'unlink' AND lrm_serial = ${lrm_serial}
    `;    
    return { status: 404, error: "User not found in Luarmor." };
  }

  const timestamp_expire = parseInt(user.auth_expire, 10);
  const expireTime = timestamp_expire == -1 ? -1 : new Date(timestamp_expire * 1000).getTime();

  try {

    //Insert if lrm_serial and discord_id doesn't match any row, update if matches lrm_serial or discord_id
    let result = await sql`
      UPDATE mspaint_users
      SET 
        discord_id = ${user.discord_id},
        expires_at = ${expireTime},
        is_banned = ${Boolean(user.banned)},
        user_status = ${user.status},
        last_sync = ${Date.now()}
      WHERE lrm_serial = ${lrm_serial}
      RETURNING *;
    `;

    if (result.rowCount || 0 > 0) {
      return { status: 200, success: "User synced successfully (by Luarmor Key)" };
    }

    result = await sql`
      UPDATE mspaint_users
      SET 
        lrm_serial = ${lrm_serial},
        expires_at = ${expireTime},
        is_banned = ${Boolean(user.banned)},
        user_status = ${user.status},
        last_sync = ${Date.now()}
      WHERE discord_id = ${user.discord_id}
      RETURNING *;
    `;

    if (result.rowCount || 0 > 0) {
      return { status: 200, success: "User synced successfully (by discord ID)" };
    }

    result = await sql`
      INSERT INTO mspaint_users (
        lrm_serial, discord_id, expires_at, is_banned, user_status, last_sync
      ) VALUES (
        ${lrm_serial},
        ${user.discord_id},
        ${expireTime},
        ${Boolean(user.banned)},
        ${user.status},
        ${Date.now()}
      )
      RETURNING *;
    `;

    return { status: 200, success: "User synced successfully" };
  } catch (error) {
    return { status: 500, error: `Unable to sync: ${error}` };
  }
}

export async function SyncSingleLuarmorUserByDiscord(discord_id: string, from_dashboard: boolean = true) {
  const allowed = await isUserAllowedOnDashboard();
  if (!allowed && from_dashboard)
    return { status: 403, error: "Permission denied" };

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
    await sql`UPDATE mspaint_users
      SET user_status = 'unlink'
      WHERE user_status IS DISTINCT FROM 'unlink' AND discord_id = ${discord_id}
    `;    
    return { status: 404, error: "User not found in Luarmor." };
  }

  const timestamp_expire = parseInt(user.auth_expire, 10);
  const expireTime = timestamp_expire == -1 ? -1 : timestamp_expire * 1000;
  try {
    //Insert if lrm_serial and discord_id doesn't match any row, update if matches lrm_serial or discord_id
    let result = await sql`
      UPDATE mspaint_users
      SET 
        discord_id = ${discord_id},
        expires_at = ${expireTime},
        is_banned = ${Boolean(user.banned)},
        user_status = ${user.status},
        last_sync = ${Date.now()}
      WHERE lrm_serial = ${user.user_key}
      RETURNING *;
    `;

    // If update by serial succeeded
    if (result.rowCount || 0 > 0) {
      return { status: 200, success: "User synced successfully (by Luarmor Key)" };
    }

    result = await sql`
      UPDATE mspaint_users
      SET 
        lrm_serial = ${user.user_key},
        expires_at = ${expireTime},
        is_banned = ${Boolean(user.banned)},
        user_status = ${user.status},
        last_sync = ${Date.now()}
      WHERE discord_id = ${discord_id}
      RETURNING *;
    `;

    if (result.rowCount || 0 > 0) {
      return { status: 200, success: "User synced successfully (by discord ID)" };
    }

    result = await sql`
      INSERT INTO mspaint_users (
        lrm_serial, discord_id, expires_at, is_banned, user_status, last_sync
      ) VALUES (
        ${user.user_key},
        ${discord_id},
        ${expireTime},
        ${Boolean(user.banned)},
        ${user.status},
        ${Date.now()}
      )
      RETURNING *;
    `;

    return { status: 200, success: "User synced successfully" };
  } catch (error) {
    return { status: 500, error: `Unable to sync: ${error}` };
  }
}

export async function SyncExpirationsFromLuarmor(
  step: number,
  authbypass?: string
) {
  if (!authbypass || authbypass !== `Bearer ${process.env.LRM_PROXY_API_KEY}`) {
    const allowed = await isUserAllowedOnDashboard();
    if (!allowed) return { status: 403, error: "Permission denied" };
  }

  const batchSize = 1500;
  
  const minRange = (step - 1) * batchSize;
  const maxRange = minRange + batchSize - 1;
  
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
  let totalUpdated = 0;
  const totalInnactive = 0;

  // 2. Normalize & filter out any without user_key
  const filteredRows = users
    .filter(
      (u: { discord_id: string; note?: string }) =>
        u.discord_id != "" && u.note != "Ad Reward"
    )
    .map(
      (u: {
        user_key: string;
        discord_id: string;
        auth_expire: string;
        banned: boolean;
        status: string;
      }) => {
        const expireAt = parseInt(u.auth_expire, 10);
        return {
          lrm_serial: u.user_key!,
          discord_id: u.discord_id,
          expires_at:
            expireAt === -1 ? -1 : new Date(expireAt * 1000).getTime(),
          is_banned: Boolean(u.banned),
          user_status: u.status,
        };
      }
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = filteredRows.flatMap((r: any) => [
    r.lrm_serial,
    r.discord_id,
    r.expires_at,
    r.is_banned,
    r.user_status,
  ]);

  const placeholders = filteredRows
    .map((_: unknown, i: number) => {
      const baseIndex = i * 5;
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}::bigint, $${baseIndex + 4}::boolean, $${baseIndex + 5})`;
    })
  .join(", ");

  // Bulk INSERT … ON CONFLICT … DO UPDATE
  if (filteredRows.length > 0) {
    
    //prepare unlink
    if (step == 1) await sql`UPDATE mspaint_users SET user_status = 'unlink';`;
    
    const queryUpsert = `
      WITH incoming (lrm_serial, discord_id, expires_at, is_banned, user_status) AS (
        VALUES ${placeholders}
      ),
      -- 1) update rows that match incoming discord_id
      updated_by_discord AS (
        UPDATE mspaint_users u
        SET
          lrm_serial  = i.lrm_serial,
          expires_at  = i.expires_at,
          is_banned   = i.is_banned,
          user_status = i.user_status
        FROM incoming i
        WHERE u.discord_id IS NOT DISTINCT FROM i.discord_id
          AND u.lrm_serial IS DISTINCT FROM i.lrm_serial
        RETURNING u.*
      ),
      -- 2) update rows that match incoming lrm_serial
      updated_by_serial AS (
        UPDATE mspaint_users u
        SET
          discord_id  = i.discord_id,
          expires_at  = i.expires_at,
          is_banned   = i.is_banned,
          user_status = i.user_status
        FROM incoming i
        WHERE u.lrm_serial IS NOT DISTINCT FROM i.lrm_serial
          AND (u.discord_id IS DISTINCT FROM i.discord_id OR u.expires_at IS DISTINCT FROM i.expires_at
              OR u.is_banned IS DISTINCT FROM i.is_banned OR u.user_status IS DISTINCT FROM i.user_status)
        RETURNING u.*
      ),
      -- 3) insert the remaining incoming rows that matched nothing
      inserted AS (
        INSERT INTO mspaint_users (lrm_serial, discord_id, expires_at, is_banned, user_status)
        SELECT i.lrm_serial, i.discord_id, i.expires_at, i.is_banned, i.user_status
        FROM incoming i
        LEFT JOIN mspaint_users u
          ON u.lrm_serial IS NOT DISTINCT FROM i.lrm_serial
          OR u.discord_id IS NOT DISTINCT FROM i.discord_id
        WHERE u.lrm_serial IS NULL AND u.discord_id IS NULL
        RETURNING *
      )
      SELECT
        (SELECT count(*) FROM updated_by_discord) AS updated_by_discord_count,
        (SELECT count(*) FROM updated_by_serial)  AS updated_by_serial_count,
        (SELECT count(*) FROM inserted)           AS inserted_count;
    `;
    const upsertResult = await sql.query(queryUpsert, values);

    const insertSerialCount  = Number(upsertResult.rows[0].updated_by_discord_count || 0);
    const insertDiscordCount = Number(upsertResult.rows[0].updated_by_serial_count || 0);
    const insertedCount = Number(upsertResult.rows[0].inserted_count || 0);

    totalUpdated += insertSerialCount + insertDiscordCount + insertedCount;
  }

  // Check if we should fetch next batch
  const hasMore = users.length > 0;

  if (hasMore) {
    return {
      status: 206,
      total_updated: totalUpdated,
      total_users: totalUsers,
    };
  }

  //Finally update the syncronization time for all users
  try {
    const currentUnixtime = Date.now();
    await sql`UPDATE mspaint_users SET last_sync = ${currentUnixtime}`;

    //if there's 'unlink' upsert
    // const moveInnactiveResult = await sql`
    //   WITH upserted AS (
    //   INSERT INTO mspaint_users_innactive (lrm_serial, discord_id, expires_at, is_banned, user_status, last_sync)
    //   SELECT lrm_serial, discord_id, expires_at, is_banned, user_status, last_sync
    //   FROM mspaint_users
    //   WHERE user_status = 'unlink'
    //   ON CONFLICT (lrm_serial) 
    //   DO UPDATE SET 
    //     discord_id = EXCLUDED.discord_id,
    //     expires_at = EXCLUDED.expires_at,
    //     is_banned  = EXCLUDED.is_banned,
    //     user_status = EXCLUDED.user_status,
    //     last_sync = EXCLUDED.last_sync
    //   RETURNING lrm_serial
    //   )
    //   DELETE FROM mspaint_users 
    //   WHERE lrm_serial IN (SELECT lrm_serial FROM upserted); 
    // `;
    // totalInnactive = moveInnactiveResult.rowCount || 0;

  } catch (error) {
    return {
      status: 200,
      total_updated: totalUpdated,
      total_innactive: totalInnactive,
      total_users: totalUsers,
      warning: "Unable to update syncronization status.",
    };
  }

  return {
    status: 200,
    total_updated: totalUpdated,
    total_innactive: totalInnactive,
    total_users: totalUsers,
  };
}

export async function ResetHardwareIDWithLuarmor(
  lrm_serial: string,
  force: boolean = false
) {
  const response = await RequestLuarmorUsersEndpoint(
    HTTP_METHOD.POST,
    "",
    {
      user_key: lrm_serial,
      force,
    },
    "/resethwid"
  );

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

  return { status: 200, success: "Your HWID has been successfully reset." };
}
