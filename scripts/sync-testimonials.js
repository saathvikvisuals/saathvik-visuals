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
  const col = (...names) => names.map((n) => header.indexOf(n)).find((i) => i !== -1) ?? -1;

  const nameCol = col("your name", "name");
  const quoteCol = col("your experience (write in any language you're comfortable in)", "your experience", "review", "quote");
  const projectCol = col("which project / website did saathvik build for you?", "project", "website");
  const projectUrlCol = col("project link (optional)", "project url", "website link");
  const languageCol = col("what language did you write in?", "language");
  const consentCol = col("ok to show this publicly on the portfolio site?", "consent", "can we share this publicly?");
  const ratingCol = col("how would you rate your experience?", "rating", "your rating");

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
