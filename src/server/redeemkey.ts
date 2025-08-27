"use server";

import { sql } from "@vercel/postgres";
import { RESELLER_DATA } from "@/data/resellers";
import { HTTP_METHOD, parseIntervalToSec } from "@/lib/utils";
import {
  RequestLuarmorUsersEndpoint,
  SyncSingleLuarmorUserByLRMSerial,
} from "./dashutils";
import { rateLimitService } from "./ratelimit";

export async function RedeemKey(serial: string, user_id: string) {
  if (user_id === "skibidiSigma") {
    return {
      status: 403,
      error: "user_id is invalid",
    };
  }

  const limiter = rateLimitService.getLimiter("redeemkey");
  const { success } = await limiter.limit(user_id);
  if (!success) {
    return {
      status: 429,
      error:
        "Rate limit reached: Please wait a few minutes before trying again.",
    };
  }

  const claimedAtUnixtimestamp = Math.floor(Date.now() / 1000); //key being claimed at this exact second
  const reservedMaxTimeout = claimedAtUnixtimestamp + 5; // Five seconds timeout

  /**
   * Atomic query where it will always give the data of the row using the serial (if exist)
   * It will update reserved_to if it's NULL meaning the key wasn't claimed at first and not it is
   * the reserved_to is a precaution if "luarmor API"/"redeem function" fails, the user can still retrive their purchase.
   * finally, this also is race condition safe for giveaways.
   */
  const { rows } = await sql`
    WITH update_attempt AS (
      UPDATE mspaint_keys_new
      SET reserved_to = ${user_id},
      reserved_until = ${reservedMaxTimeout}
      WHERE serial = ${serial}
        AND claimed_at IS NULL
        AND (reserved_to IS NULL OR reserved_to = ${user_id})
        AND (reserved_until IS NULL OR reserved_until < EXTRACT(EPOCH FROM NOW()))
      RETURNING *
    )
    SELECT * FROM update_attempt
    UNION ALL
    SELECT * FROM mspaint_keys_new
    WHERE serial = ${serial}
      AND NOT EXISTS (SELECT 1 FROM update_attempt)
  `;

  if (rows.length === 0) {
    return {
      status: 404,
      error: "Key not found.",
    };
  }

  const serialKeyData = rows[0];

  if (serialKeyData.linked_to || serialKeyData.claimed_at !== null) {
    return {
      status: 404,
      error: "Serial key already claimed.",
    };
  }

  if (serialKeyData.reserved_to !== user_id) {
    return {
      status: 404,
      error: "Serial key already redeemed.",
    };
  }

  if (serialKeyData.reserved_until != reservedMaxTimeout) {
    return {
      status: 404,
      error: `Serial key is being claimed, try again later.`,
    };
  }

  //This can only return 1 or 0 users. (luarmor doesn't allow the same discord ID for different keys)
  const getLuarmorUser = await RequestLuarmorUsersEndpoint(
    HTTP_METHOD.GET,
    `discord_id=${user_id}`
  );

  if (getLuarmorUser.status !== 200) {
    return {
      status: 500,
      error:
        "internal luarmor api error, returned status code " +
        getLuarmorUser.status +
        ", please wait a few minutes and try again.",
    };
  }

  const lrmUserData = await getLuarmorUser.json();
  if (!lrmUserData.success) {
    return {
      status: 500,
      error: `Luarmor error: ${lrmUserData.message}`,
    };
  }

  const lrmUserFound = lrmUserData.users.length !== 0;

  let isCheckpointKey = false;
  if (lrmUserFound) {
    if (lrmUserData.note === "Ad Reward") {
      isCheckpointKey = true;
    }

    if (!isCheckpointKey) {
      if (lrmUserData.users[0].auth_expire == -1) {
        return {
          status: 403,
          error: "You already have a lifetime key!",
        };
      }
    }
  }

  if (isCheckpointKey) {
    await RequestLuarmorUsersEndpoint(
      HTTP_METHOD.DELETE,
      `user_key=${lrmUserData.users[0].user_key}`
    );
  }

  const validFor: string | null = serialKeyData.key_duration; //null for lifetime
  const lifetimeDate = -1;

  let luarmorSerialKey = "";

  if (lrmUserFound) {
    luarmorSerialKey = lrmUserData.users[0].user_key;

    //Updating an existing user
    const addSubscriptionTime = validFor
      ? lrmUserData.users[0].auth_expire + parseIntervalToSec(validFor)
      : lifetimeDate;
    const response = await RequestLuarmorUsersEndpoint(HTTP_METHOD.PATCH, "", {
      user_key: luarmorSerialKey,
      auth_expire: addSubscriptionTime,
    });

    if (!response.ok) {
      return {
        status: 500,
        error: `Luarmor API error: ${response.status}`,
      };
    }
  } else {
    //Creating a new user
    const createSubscriptionTime = validFor
      ? claimedAtUnixtimestamp + parseIntervalToSec(validFor)
      : lifetimeDate;
    const response = await RequestLuarmorUsersEndpoint(HTTP_METHOD.POST, "", {
      discord_id: user_id,
      note: (serialKeyData.order_id ?? "Generic ID") + " - " + serial,
      auth_expire: createSubscriptionTime,
    });

    if (!response.ok) {
      return {
        status: 500,
        error: `Luarmor API error: ${response.status}`,
      };
    }

    const lrmCreatedUserData = await response.json();
    luarmorSerialKey = lrmCreatedUserData.user_key;
  }

  //Actually claim the key
  await sql`UPDATE mspaint_keys_new
    SET claimed_at = NOW(),
      linked_to = ${user_id}
    WHERE serial = ${serial}
  `;

  //Sync with updated expiration date (system rate limit just to track the amount of requests)
  await rateLimitService.trackRequest("syncuser");

  // This sync is triggered by an end-user redeem action, not from dashboard.
  // Pass `from_dashboard=false` to bypass dashboard auth checks so the
  // mspaint_users row is updated and the success UI can render immediately.
  await SyncSingleLuarmorUserByLRMSerial(luarmorSerialKey, false);

  const order_id = (serialKeyData.order_id as string).toLowerCase();
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
                  value: `||${luarmorSerialKey}||`,
                  inline: true,
                },
              ],
            },
          ],
          attachments: [],
        }),
      });
      break;
    }

    //If no reseller is found, must be a untracked reseller or from mspaint
    await fetch(data.webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: null,
        embeds: [
          {
            title: `${data.name} - key redeemed!`,
            description: `Via the official __${data.name}__ shop or untracked reseller.`,
            color: 55295,
            fields: [
              {
                name: "mspaint serial",
                value: `||${serial}||`,
                inline: true,
              },
              {
                name: "Order ID",
                value: `||${order_id}||`,
                inline: true,
              },
              {
                name: "Discord",
                value: `<@${user_id}> (${user_id})`,
                inline: true,
              },
              {
                name: "Luarmor Serial",
                value: `||${luarmorSerialKey}||`,
                inline: true,
              },
              {
                name: `Key duration: ${validFor ?? "Lifetime"}`,
                value: `Claimed at: <t:${claimedAtUnixtimestamp}:d><t:${claimedAtUnixtimestamp}:T>`,
                inline: true,
              },
            ],
          },
        ],
        attachments: [],
      }),
    });
    break;
  }

  return {
    status: 200,
    success: "key redeemed successfully",
    user_key: luarmorSerialKey,
  };
}
