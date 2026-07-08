// Pulls real client review responses from a Google Form into the site.
//
// Setup (one-time, in your own Google account — see docs/testimonials-setup.md
// for the exact form questions to use):
//   1. Create the Google Form, link its responses to a Google Sheet.
//   2. In the Sheet: File -> Share -> Publish to web -> select the responses
//      tab -> format "Comma-separated values (.csv)" -> Publish. Copy the URL.
//   3. Put that URL in .env.local as TESTIMONIALS_SHEET_CSV_URL=...
//   4. Run `npm run testimonials:sync` (also runs automatically in prebuild).
//
// This mirrors scripts/sync-projects.js — same "external source -> committed
// JSON the app reads" shape, just fetched over HTTP instead of read from a
// local file, since the source of truth is a Sheet you don't hand-edit.
const fs = require("node:fs");
const path = require("node:path");

const OUTPUT_PATH = path.resolve(__dirname, "..", "src", "data", "testimonials.json");
const csvUrl = process.env.TESTIMONIALS_SHEET_CSV_URL;

async function main() {
  if (!csvUrl) {
    console.log("No TESTIMONIALS_SHEET_CSV_URL set. Keeping testimonials.json unchanged (see docs/testimonials-setup.md).");
    return;
  }

  const res = await fetch(csvUrl);
  if (!res.ok) {
    console.error(`Failed to fetch testimonials sheet: HTTP ${res.status}`);
    process.exitCode = 1;
    return;
  }

  const csv = await res.text();
  const rows = parseCsv(csv);
  if (rows.length === 0) {
    console.log("Sheet has no response rows yet. Keeping testimonials.json unchanged.");
    return;
  }

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  // Matches by substring rather than exact string, since real-world form
  // editing (descriptions typed into titles, reworded questions) means the
  // published header rarely matches the documented wording byte-for-byte.
  // Each matcher is checked in order and only against headers not already
  // claimed by an earlier, more specific column, so overlapping phrases
  // (e.g. "experience" appears in both the rating and quote questions) don't
  // collide.
  const claimed = new Set();
  const col = (...substrings) => {
    for (let i = 0; i < header.length; i += 1) {
      if (claimed.has(i)) continue;
      if (substrings.some((s) => header[i].includes(s))) {
        claimed.add(i);
        return i;
      }
    }
    return -1;
  };

  // Order matters: more specific matchers must claim their column before a
  // broader fallback (e.g. quoteCol's "your experience" fallback) gets a
  // chance to steal it — "your experience" appears in both the rating and
  // quote questions, so ratingCol has to resolve first.
  const nameCol = col("your name");
  const ratingCol = col("rate your experience", "rating");
  const quoteCol = col("write in any language you're comfortable", "your experience", "review", "quote");
  const projectUrlCol = col("project link", "project url", "website link");
  const projectCol = col("project", "website");
  const languageCol = col("what language did you write", "language");
  const consentCol = col("share this publicly", "show this publicly", "consent");

  const entries = rows
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .filter((row) => consentCol === -1 || /^\s*(yes|y|true)\s*$/i.test(row[consentCol] ?? ""))
    .map((row) => {
      const ratingRaw = ratingCol !== -1 ? Number.parseInt((row[ratingCol] || "").trim(), 10) : NaN;
      return {
        name: (row[nameCol] || "").trim(),
        quote: (row[quoteCol] || "").trim(),
        project: projectCol !== -1 ? (row[projectCol] || "").trim() || undefined : undefined,
        projectUrl: projectUrlCol !== -1 ? (row[projectUrlCol] || "").trim() || undefined : undefined,
        language: languageCol !== -1 ? (row[languageCol] || "").trim() || undefined : undefined,
        rating: Number.isFinite(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : undefined,
      };
    })
    .filter((entry) => entry.name && entry.quote);

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`Synced ${entries.length} testimonial${entries.length === 1 ? "" : "s"} into src/data/testimonials.json.`);
}

// Minimal RFC4180 CSV parser — handles quoted fields containing commas/newlines,
// which Google Sheets' CSV export uses for any multi-line review text.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

main();
