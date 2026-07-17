// One-off script: exchanges a short-lived Instagram access token for a
// long-lived one (valid ~60 days, refreshable). Run after getting a fresh
// short-lived token from the Meta tester/OAuth flow.
//
// Usage: node scripts/exchange-instagram-token.mjs
// Reads IG_APP_SECRET and IG_PAGE_ACCESS_TOKEN from .env.local, prints the
// long-lived token to paste back into .env.local / Vercel.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(rootDir, ".env.local");

function loadEnv() {
  const lines = readFileSync(envPath, "utf8").split("\n");
  const env = {};
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const appSecret = env.IG_APP_SECRET;
  const shortLivedToken = env.IG_PAGE_ACCESS_TOKEN;

  if (!appSecret) {
    console.error("Missing IG_APP_SECRET in .env.local — find this in the Meta App dashboard under Settings > Basic > App Secret.");
    process.exit(1);
  }
  if (!shortLivedToken) {
    console.error("Missing IG_PAGE_ACCESS_TOKEN in .env.local.");
    process.exit(1);
  }

  // Instagram API with Instagram Login tokens (prefix "IGAA") exchange via
  // graph.instagram.com, not graph.facebook.com/oauth (that's for Facebook
  // Login / Page tokens instead).
  const url = new URL("https://graph.instagram.com/access_token");
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("access_token", shortLivedToken);

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.error("Exchange failed:", data);
    process.exit(1);
  }

  console.log("Long-lived token (valid ~60 days):");
  console.log(data.access_token);
  console.log("\nExpires in (seconds):", data.expires_in);
  console.log("\nReplace IG_PAGE_ACCESS_TOKEN in .env.local and Vercel with this value.");
}

main();
