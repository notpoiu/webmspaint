"use server";

import { sql } from "@vercel/postgres";
import { isUserAllowedOnDashboard } from "./authutils";
import { RESELLER_DATA } from "@/data/resellers";
import { createInterval, parseIntervalToMs } from "@/lib/utils";

const LRM_Headers = {
  Authorization: `Bearer ${process.env.LRM_PROXY_API_KEY}`,
  "Content-Type": "application/json",
};

/**
 * A simple handler to do CRUD operations with luarmor users, decreasing code footprint.
 * @param method GET, POST, PATCH, DELETE
 * @param filters refer to https://docs.luarmor.net/#getting-users for more information
 * @returns
 */
export async function RequestLuarmorUsersEndpoint(
  method: string,
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
    "GET",
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
      "DELETE",
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
    const response = await RequestLuarmorUsersEndpoint("POST", "", {
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
    const response = await RequestLuarmorUsersEndpoint("PATCH", "", {
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
    "GET",
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

  let totalUpdated = 0;
  let totalUsers = 0;

  const response = await RequestLuarmorUsersEndpoint("GET");

  if (!response.ok) {
    return {
      status: 500,
      error: `Luarmor API error: ${response.status}`,
    };
  }

  const data = await response.json();
  const users = data.users || [];
  totalUsers += users.length;

  // Filter and prepare user data for bulk update
  const validUsers = users
    .filter(
      (user: { user_key?: string; auth_expire?: string }) =>
        user.user_key && user.auth_expire != null
    )
    .map(
      (user: { user_key: string; auth_expire: string; banned?: boolean }) => {
        const timestamp_expire = parseInt(user.auth_expire, 10);
        const expireTime =
          timestamp_expire == -1
            ? -1
            : new Date(timestamp_expire * 1000).getTime();

        return {
          lrm_serial: user.user_key,
          expires_at: expireTime,
          is_banned: Boolean(user.banned),
        };
      }
    );

  if (validUsers.length > 0) {
    const placeholders = validUsers
      .map((_: unknown, index: number) => {
        const baseIndex = index * 3;
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
      })
      .join(", ");

    const values = validUsers.flatMap(
      (user: {
        lrm_serial: string;
        expires_at: number;
        is_banned: boolean;
      }) => [user.lrm_serial, user.expires_at, user.is_banned]
    );

    const query = `
      UPDATE mspaint_users 
      SET 
        expires_at = updates.new_expires_at::bigint,
        is_banned = updates.new_is_banned::boolean
      FROM (VALUES ${placeholders}) AS updates(lrm_serial, new_expires_at, new_is_banned)
      WHERE mspaint_users.lrm_serial = updates.lrm_serial
        AND (
          mspaint_users.expires_at IS DISTINCT FROM updates.new_expires_at::bigint
          OR mspaint_users.is_banned IS DISTINCT FROM updates.new_is_banned::boolean
        )
    `;

    const result = await sql.query(query, values);
    totalUpdated = result.rowCount || 0;
  }

  return {
    status: 200,
    total_updated: totalUpdated,
    total_users: totalUsers,
  };
}
