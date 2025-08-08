"use server";

import { sql } from "@vercel/postgres";
import { RESELLER_DATA } from "@/data/resellers";
import { HTTP_METHOD, parseIntervalToMs } from "@/lib/utils";
import {
  RequestLuarmorUsersEndpoint,
  GetUserSubscription,
  SyncSingleLuarmorUser,
} from "./dashutils";
import { rateLimitService } from "./ratelimit";

export async function RedeemKey(serial: string, user_id: string) {
  if (user_id === "skibidiSigma") {
    return {
      status: 403,
      error: "user_id is invalid",
    };
  }

  const { rows } =
    await sql`SELECT * FROM mspaint_keys_new WHERE serial = ${serial}`;

  if (rows.length === 0 || rows[0].claimed === true) {
    return {
      status: 404,
      error: "key not found",
    };
  }

  if (rows.length > 1) {
    return {
      status: 500,
      error: "Serial key must be unique. Contact support.",
    };
  }

  const serialKeyData = rows[0];
  if (serialKeyData.claimed_at !== null) {
    return {
      status: 403,
      error: "Serial key already redeemed.",
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

  const validFor: string | null = serialKeyData.key_duration; //null for lifetime
  let keyExpirationDate = -1;

  const getExistingUser = await GetUserSubscription(user_id);

  let keyCreation;
  const claimedAtDate = Date.now(); //key is being claimed at this exact second
  const unixtimeStamp = Math.floor(claimedAtDate / 1000);

  if (!getExistingUser) {
    if (validFor) {
      // Calculate expiration time
      const durationMs = parseIntervalToMs(validFor);
      keyExpirationDate = Math.floor(
        new Date(claimedAtDate + durationMs).getTime() / 1000
      ); //must be in seconds
    }

    //Creating a new user
    const response = await RequestLuarmorUsersEndpoint(HTTP_METHOD.POST, "", {
      discord_id: user_id,
      note: (serialKeyData.order_id ?? "Generic ID") + " - " + serial,
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

    await sql`INSERT INTO mspaint_users (lrm_serial, discord_id, expires_at) VALUES (${keyCreation.user_key}, ${user_id}, ${dbExpiresAt})`;
  } else {
    // Update user expiration + other info first
    await rateLimitService.trackRequest("syncuser", user_id);

    const result = await SyncSingleLuarmorUser(user_id, false);
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
    await rateLimitService.trackRequest("syncuser", user_id);
    await SyncSingleLuarmorUser(user_id);
  }

  const luarmorSerial = !getExistingUser
    ? keyCreation.user_key
    : getExistingUser.lrm_serial;

  await sql`UPDATE mspaint_keys_new
    SET claimed_at = NOW(),
      linked_to = ${user_id}
    WHERE serial = ${serial}
  `;

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
                  value: `||${keyCreation.user_key}||`,
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
                value: `||${luarmorSerial}||`,
                inline: true,
              },
              {
                name: `Key duration: ${validFor ?? "Lifetime"}`,
                value: `Claimed at: <t:${unixtimeStamp}:d><t:${unixtimeStamp}:T>`,
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
    user_key: luarmorSerial,
  };
}
