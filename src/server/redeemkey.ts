"use server";

import { sql } from "@vercel/postgres";
import { isUserAllowedOnDashboard } from "./authutils";
import { RESELLER_DATA } from "@/data/resellers";
import { createInterval, parseIntervalToMs } from "@/lib/utils";

const LRM_Headers = {
  Authorization: `Bearer ${process.env.LRM_PROXY_API_KEY}`,
  "Content-Type": "application/json",
};

enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

/**
 * A simple handler to do CRUD operations with luarmor users, decreasing code footprint.
 * @param method GET, POST, PATCH, DELETE
 * @param filters refer to https://docs.luarmor.net/#getting-users for more information
 * @returns
 */
export async function RequestLuarmorUsersEndpoint(
  method: HTTP_METHOD,
  filters: string = "",
  body: unknown = null
) {
  const apiUrl = `${process.env.LRM_PROXY_URL}/v3/projects/${
    process.env.LRM_PROJECT_ID
  }/users${filters == "" ? "" : "?" + filters}`;

  if (body) {
    const response = await fetch(apiUrl, {
      method: method,
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

export async function RedeemKey(serial: string, user_id: string) {
  if (user_id === "skibidiSigma") {
    return {
      status: 403,
      error: "user_id is invalid",
    };
  }

  // if (true) {
  //   return {
  //     status: 200,
  //     error: "This is just a test real",
  //   }
  // }

  const { rows } =
    await sql`SELECT * FROM mspaint_keys_new WHERE serial = ${serial}`;

  if (rows.length === 0 || rows[0].claimed === true) {
    return {
      status: 404,
      error: "key not found",
    };
  }

  const checkpointKeyResponse = await RequestLuarmorUsersEndpoint(
    HTTP_METHOD.GET,
    `discord_id=${user_id}`
  );

  if (checkpointKeyResponse.status !== 200) {
    return {
      status: 500,
      error:
        "internal luarmor api error, returned status code " +
        checkpointKeyResponse.status +
        ", please wait a few minutes and try again",
    };
  }

  const checkpointKey = await checkpointKeyResponse.json();
  let does_user_have_checkpoint_key = false;
  if (checkpointKey.users.length !== 0) {
    if (checkpointKey.users[0].note === "Ad Reward") {
      does_user_have_checkpoint_key = true;
    }

    if (!does_user_have_checkpoint_key) {
      if (checkpointKey.users[0].auth_expire == -1) {
        return {
          status: 403,
          error: "user already has a permanent key",
        };
      }
    }
  }

  if (does_user_have_checkpoint_key) {
    await RequestLuarmorUsersEndpoint(
      HTTP_METHOD.DELETE,
      `user_key=${checkpointKey.users[0].user_key}`
    );
  }

  const validFor: string | null = rows[0].key_duration; //null for lifetime
  let keyExpirationDate = -1;

  const getExistingUser = await GetUserSubscription(user_id);

  let keyCreation;
  if (!getExistingUser) {
    if (validFor) {
      // Calculate expiration time
      const claimedAtDate = Date.now(); //key is being claimed at this exact second
      const durationMs = parseIntervalToMs(validFor);
      keyExpirationDate = Math.floor(
        new Date(claimedAtDate + durationMs).getTime() / 1000
      ); //must be in seconds
    }

    //Creating a new user
    const response = await RequestLuarmorUsersEndpoint(HTTP_METHOD.POST, "", {
      discord_id: user_id,
      note: (rows[0].order_id ?? "Generic ID") + " - " + serial,
      auth_expire: keyExpirationDate,
    });

    if (!response.ok) {
      return {
        status: 500,
        error: `Luarmor API error: ${response.status}`,
      };
    }

    keyCreation = await response.json();

    if (!keyCreation.success) {
      return {
        status: 500,
        error: `Luarmor API error: ${keyCreation.message}`,
      };
    }

    // Calculate the actual expires_at value for database insertion
    const dbExpiresAt =
      keyExpirationDate === -1
        ? -1
        : new Date(keyExpirationDate * 1000).getTime();

    await sql`INSERT INTO mspaint_users (lrm_serial, discord_id, expires_at, is_banned) VALUES (${keyCreation.user_key}, ${user_id}, ${dbExpiresAt}, FALSE)`;
  } else {
    // Update user expiration + other info first
    const result = await SyncUserExpiration(user_id);
    if (result.status !== 200) {
      throw Error(`Luarmor sync error: ${result.error}`);
    }

    //we should only check if the user is not going to a lifetime state
    if (validFor) {
      //this must be valid since we already checked before
      const getUpdatedExistingUser = await GetUserSubscription(user_id);

      // Calculate expiration time
      const expireLuarmorDate = new Date(
        Number(getUpdatedExistingUser.expires_at)
      );
      const durationMs = parseIntervalToMs(validFor);
      keyExpirationDate = Math.floor(
        new Date(expireLuarmorDate.getTime() + durationMs).getTime() / 1000
      ); //must be in seconds
    }

    //Updating an existing user
    const response = await RequestLuarmorUsersEndpoint(HTTP_METHOD.PATCH, "", {
      user_key: getExistingUser.lrm_serial,
      auth_expire: keyExpirationDate,
    });

    if (!response.ok) {
      return {
        status: 500,
        error: `Luarmor API error: ${response.status}`,
      };
    }

    //Make a final syncronization with updated expiration date
    await SyncUserExpiration(user_id);
  }

  await sql`UPDATE mspaint_keys_new
    SET claimed_at = NOW(),
      linked_to = ${user_id}
    WHERE serial = ${serial}
  `;

  const order_id = (rows[0].order_id as string).toLowerCase();
  for (const [key, data] of Object.entries(RESELLER_DATA)) {
    if (order_id.includes(key)) {
      await fetch(data.webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: null,
          embeds: [
            {
              title: `${data.name} - mspaint key purchased`,
              description: `a key was purchased & redeemed via the ${data.name} reseller.`,
              color: 5814783,
              fields: [
                {
                  name: "mspaint serial",
                  value: `||${serial}||`,
                  inline: true,
                },
                {
                  name: "Order ID",
                  value: `||${rows[0].order_id}||`,
                  inline: true,
                },
                {
                  name: "Discord",
                  value: `<@${user_id}> (${user_id})`,
                  inline: true,
                },
                {
                  name: "Luarmor Serial",
                  value: `||${keyCreation.user_key}||`,
                  inline: true,
                },
              ],
            },
          ],
          attachments: [],
        }),
      });
    }
  }

  return {
    status: 200,
    success: "key redeemed successfully",
    user_key: !getExistingUser
      ? keyCreation.user_key
      : getExistingUser.lrm_serial,
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
  // TODO: Implement Luarmor API update logic

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

export async function SyncUserExpiration(discord_id: string) {
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
      SET expires_at = ${expireTime}, is_banned = ${Boolean(user.banned)}
      WHERE discord_id = ${discord_id}
    `;
    return { status: 200, success: "User expiration synced" };
  } catch (error) {
    return { status: 500, error: `Unable to sync: ${error}` };
  }
}

export async function SyncExpirationsFromLuarmor(step: number) {
  const allowed = await isUserAllowedOnDashboard();
  if (!allowed) return { status: 403, error: "Permission denied" };

  const batchSize = 1000;
  let totalUpdated = 0;
  let totalDeleted = 0;

  const minRange = (step - 1) * batchSize
  const maxRange = minRange + batchSize - 1

  // 1. Fetch the batch
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
    .map((u: { user_key: string;  discord_id: string; auth_expire: string; banned: boolean; }) => {
      const expireAt = parseInt(u.auth_expire, 10);
      return {
        lrm_serial: u.user_key!,
        discord_id: u.discord_id,
        expires_at: expireAt === -1 ? -1 : new Date(expireAt * 1000).getTime(),
        is_banned: Boolean(u.banned),
      };
  });

  // 4. Delete any rows not present in this batch
  if (filteredRows.length > 0) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allDiscordIds = filteredRows.map((r: { discord_id: any; }) => r.discord_id);

    const placeholders = allDiscordIds
      .map((_: unknown, i: number) => 
        `$${i + 1}`)
    .join(', ');

    const deleteQuery = `
      DELETE FROM mspaint_users
      WHERE discord_id NOT IN (${placeholders});
    `;

    const deleteResult = await sql.query(deleteQuery, allDiscordIds);

    totalDeleted = deleteResult.rowCount ?? 0;
  } else {
    // Here we'll leave the table untouched.
    totalDeleted = 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = filteredRows.flatMap((r: any) => [
    r.lrm_serial,
    r.discord_id,
    r.expires_at,
    r.is_banned,
  ]);

  const placeholders = filteredRows
    .map((_: unknown, i: number) => {
      const baseIndex = i * 4;
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`;
    })
  .join(', ');

  // 3. Bulk INSERT … ON CONFLICT … DO UPDATE
  if (filteredRows.length > 0) {
    const query = `
      INSERT INTO mspaint_users (lrm_serial, discord_id, expires_at, is_banned)
      VALUES ${placeholders}
      ON CONFLICT (discord_id)
      DO UPDATE SET
        lrm_serial = EXCLUDED.lrm_serial,
        expires_at = EXCLUDED.expires_at,
        is_banned = EXCLUDED.is_banned
      WHERE
        mspaint_users.lrm_serial IS DISTINCT FROM EXCLUDED.lrm_serial
        OR mspaint_users.expires_at IS DISTINCT FROM EXCLUDED.expires_at
        OR mspaint_users.is_banned IS DISTINCT FROM EXCLUDED.is_banned;
    `;

    const insertResult = await sql.query(query, values);
    // rowCount here is # of filteredRows inserted + # of filteredRows updated
    totalUpdated = insertResult.rowCount ?? 0;
  }

  // Check if we should fetch next batch
  const hasMore = users.length > 0;

  if (hasMore) {
    return {
      status: 206,
      total_updated: totalUpdated,
      total_deleted: totalDeleted,
      total_users: totalUsers
    };      
  }

  return {
    status: 200,
    total_updated: totalUpdated,
    total_deleted: totalDeleted,
    total_users: totalUsers,    
  };
}