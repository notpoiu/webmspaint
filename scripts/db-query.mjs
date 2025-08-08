#!/usr/bin/env node

// Minimal DB inspector for mspaint data
// Usage examples:
//   node scripts/db-query.mjs --serial IJKOS1EC0X4XSQEA
//   node scripts/db-query.mjs --lrm IFpCrDsbHWBActhQNPnKlfBDXvVyMjXY
//   node scripts/db-query.mjs --discord 123456789012345678
//   node scripts/db-query.mjs --url postgres://user:pass@host:5432/db --serial ...

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { sql } from "@vercel/postgres";

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--serial") args.serial = argv[++i];
    else if (a === "--lrm" || a === "--lrm_serial") args.lrm = argv[++i];
    else if (a === "--discord" || a === "--discord_id") args.discord = argv[++i];
    else if (a === "--url") args.url = argv[++i];
    else if (a === "--print-env" || a === "--verbose") args.verbose = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else args._.push(a);
  }
  return args;
}

function formatMs(ms) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${days}d ${hours}h ${mins}m`;
}

function normalizeEpochMs(epoch) {
  if (epoch == null) return null;
  const n = typeof epoch === "string" ? Number(epoch) : Number(epoch);
  if (!Number.isFinite(n)) return null;
  if (n === -1) return -1;
  if (n > 0 && n < 1e11) return n * 1000; // seconds -> ms
  return n;
}

async function getBySerial(serial) {
  const { rows } = await sql`SELECT * FROM mspaint_keys_new WHERE serial = ${serial}`;
  if (rows.length === 0) return { key: null, user: null };
  const key = rows[0];
  let user = null;
  if (key.linked_to) {
    const u = await sql`SELECT * FROM mspaint_users WHERE discord_id = ${key.linked_to}`;
    user = u.rows[0] || null;
  }
  return { key, user };
}

async function getByLrm(lrm) {
  const { rows } = await sql`SELECT * FROM mspaint_users WHERE lrm_serial = ${lrm}`;
  return { user: rows[0] || null };
}

async function getByDiscord(discord) {
  const { rows } = await sql`SELECT * FROM mspaint_users WHERE discord_id = ${discord}`;
  return { user: rows[0] || null };
}

function printUser(user) {
  if (!user) {
    console.log("User: <not found>");
    return;
  }
  const now = Date.now();
  const exp = normalizeEpochMs(user.expires_at);
  let expText = "- -";
  if (exp === -1) {
    expText = "Lifetime (-1)";
  } else if (typeof exp === "number" && Number.isFinite(exp)) {
    const msLeft = exp - now;
    const d = new Date(exp);
    expText = `${Number.isFinite(msLeft) ? d.toISOString() : "-"} (in ${formatMs(Math.max(0, msLeft || 0))})`;
  }

  console.log("User:");
  const lastSyncMs = Number(user.last_sync);
  const lastSyncReadable = Number.isFinite(lastSyncMs)
    ? new Date(lastSyncMs).toISOString()
    : "- -";

  console.table({
    discord_id: user.discord_id,
    lrm_serial: user.lrm_serial,
    user_status: user.user_status,
    is_banned: user.is_banned,
    expires_at_readable: expText,
    expires_at_raw: user.expires_at,
    last_sync_iso: lastSyncReadable,
  });
}

function printKey(key) {
  if (!key) {
    console.log("Key: <not found>");
    return;
  }
  console.log("Key (mspaint_keys_new):");
  console.table({
    serial: key.serial,
    order_id: key.order_id,
    claimed: key.claimed,
    claimed_at: key.claimed_at ? new Date(key.claimed_at).toISOString() : null,
    linked_to: key.linked_to,
    key_duration: key.key_duration,
  });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.serial && !args.lrm && !args.discord)) {
    console.log("Usage:");
    console.log("  node scripts/db-query.mjs --serial <SERIAL>");
    console.log("  node scripts/db-query.mjs --lrm <LRM_SERIAL>");
    console.log("  node scripts/db-query.mjs --discord <DISCORD_ID>");
    console.log("  node scripts/db-query.mjs --url <POSTGRES_URL> [...flags]");
    process.exit(0);
  }

  try {
    // Load env files explicitly: try .env.local then .env
    const envCandidates = [
      ".env.local",
      ".env.development.local",
      ".env",
      ".env.development",
    ];
    for (const p of envCandidates) {
      const full = path.resolve(process.cwd(), p);
      if (fs.existsSync(full)) {
        dotenv.config({ path: full, override: false });
      }
    }

    // CLI --url takes precedence
    if (args.url) {
      process.env.POSTGRES_URL = args.url;
    }

    // Allow common fallbacks if POSTGRES_URL isn't defined locally
    if (!process.env.POSTGRES_URL) {
      if (process.env.DATABASE_URL) {
        process.env.POSTGRES_URL = process.env.DATABASE_URL;
      } else if (process.env.POSTGRES_URL_NON_POOLING) {
        process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
      } else if (process.env.PG_CONNECTION_STRING) {
        process.env.POSTGRES_URL = process.env.PG_CONNECTION_STRING;
      }
    }

    if (args.verbose) {
      const mask = (s = "") => (s ? s.replace(/:[^:@/]+@/, ":****@") : s);
      console.log("Using POSTGRES_URL:", mask(process.env.POSTGRES_URL));
    }

    if (!process.env.POSTGRES_URL) {
      console.error(
        "Missing POSTGRES_URL. Define POSTGRES_URL (or DATABASE_URL / POSTGRES_URL_NON_POOLING / PG_CONNECTION_STRING) in your .env, or pass --url."
      );
      process.exit(1);
    }
    if (args.serial) {
      console.log(`Looking up by serial: ${args.serial}`);
      const { key, user } = await getBySerial(args.serial);
      printKey(key);
      printUser(user);
    } else if (args.lrm) {
      console.log(`Looking up by LRM serial: ${args.lrm}`);
      const { user } = await getByLrm(args.lrm);
      printUser(user);
    } else if (args.discord) {
      console.log(`Looking up by Discord ID: ${args.discord}`);
      const { user } = await getByDiscord(args.discord);
      printUser(user);
    }
  } catch (err) {
    console.error("Error:", err);
    process.exitCode = 1;
  }
}

await main();


