const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
let outputPath = "";
const positional = [];
const optional = args.includes("--optional");

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--write") {
    outputPath = args[index + 1] ?? "";
    index += 1;
  } else if (arg === "--optional") {
    continue;
  } else {
    positional.push(arg);
  }
}

const inputPath = positional[0] ?? "project-intake.json";
const resolved = path.resolve(inputPath);

if (!fs.existsSync(resolved)) {
  if (optional) {
    console.log(`No ${inputPath} found. Keeping generated project list unchanged.`);
    process.exit(0);
  }
  console.error(`Missing ${inputPath}. Copy project-intake.example.json to project-intake.json and add new deployed projects.`);
  process.exit(1);
}

const incoming = JSON.parse(fs.readFileSync(resolved, "utf8"));

const rules = {
  founders: ["saas", "dashboard", "analytics", "founder", "business", "startup", "crm", "b2b", "proof", "conversion", "real estate", "professional"],
  visual: ["cinematic", "motion", "entertainment", "music", "travel", "creator", "visual", "brand", "portfolio", "landing", "interface"],
  commerce: ["commerce", "shop", "store", "booking", "service", "cart", "product", "payment", "salon", "pet", "nutrition"],
  culture: ["culture", "heritage", "tourism", "music", "classical", "travel", "destination", "language", "community", "story"]
};

const entries = incoming.map((item) => {
  const text = [item.name, item.description, ...(item.tags ?? [])].join(" ").toLowerCase();
  const interests = Object.entries(rules)
    .filter(([, words]) => words.some((word) => text.includes(word)))
    .map(([key]) => key);

  const uniqueInterests = [...new Set(interests)];
  if (!uniqueInterests.length) uniqueInterests.push("visual");

  return {
    slug: item.slug ?? slugify(item.name),
    name: item.name,
    tag: item.tag ?? inferTag(item, uniqueInterests),
    type: item.type ?? inferType(uniqueInterests),
    url: item.url,
    github: item.github,
    image: item.image,
    ...(item.embedUrl ? { embedUrl: item.embedUrl } : {}),
    palette: item.palette ?? inferPalette(uniqueInterests),
    interests: uniqueInterests,
    problem: item.problem ?? "The existing experience needed clearer positioning, stronger visual hierarchy, and a more confident path to action.",
    solution: item.solution ?? "Designed a focused digital experience with responsive UI, clear sections, visual rhythm, and interaction details that support the user journey.",
    outcome: item.outcome ?? "Adds a portfolio-ready case study that can be routed into the right Saathvik Visuals curation room automatically.",
    ...(item.story ? { story: item.story } : {})
  };
});

if (outputPath) {
  const outputResolved = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(outputResolved), { recursive: true });
  fs.writeFileSync(outputResolved, `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`Synced ${entries.length} project${entries.length === 1 ? "" : "s"} into ${outputPath}.`);
} else {
  console.log("// Preview only. Add --write src/data/auto-projects.json to make these projects live:");
  console.log(JSON.stringify(entries, null, 2));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inferTag(item, interests) {
  if (interests.includes("commerce")) return "Commerce and service experience";
  if (interests.includes("culture")) return "Story-led cultural experience";
  if (interests.includes("founders")) return "Business clarity product experience";
  return "Cinematic digital experience";
}

function inferType(interests) {
  if (interests.includes("commerce")) return "Commerce concept";
  if (interests.includes("culture")) return "Cultural experience";
  if (interests.includes("founders")) return "Product strategy concept";
  return "Visual interface concept";
}

function inferPalette(interests) {
  if (interests.includes("commerce")) return ["#0f766e", "#fff7ed", "#111827"];
  if (interests.includes("culture")) return ["#c2410c", "#fff7ed", "#3b1608"];
  if (interests.includes("founders")) return ["#2563eb", "#eef4ff", "#111827"];
  return ["#7c3aed", "#f5f3ff", "#111827"];
}
