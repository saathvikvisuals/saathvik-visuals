// Records short walkthrough videos (+ a poster screenshot) of each live deployed
// project for use in the portfolio (replacing static screenshots/placeholder art).
// Requires playwright — run with NODE_PATH pointing at an environment that has it
// installed, e.g.:
//   NODE_PATH=<path-to-playwright-node_modules> node scripts/record-project-videos.mjs
//
// By default records the 9 hand-authored projects below. Pass a single slug as
// argv[2] to record just one. Set RECORD_SLUGS_FILE to a JSON file of
// [{ slug, url }, ...] (as written by discover-new-projects.mjs) to record a
// dynamically discovered batch instead — used by the auto-curation workflow.
import { chromium } from "playwright";
import { mkdirSync, renameSync, readdirSync, rmSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const videoDir = join(__dirname, "..", "public", "project-videos");
const screenshotDir = join(__dirname, "..", "public", "project-screenshots");
mkdirSync(videoDir, { recursive: true });
mkdirSync(screenshotDir, { recursive: true });

// Kept in sync with the `url` field of each project in src/data/portfolio.ts.
// Plain JS list (not a TS import) so this script runs with vanilla node + playwright.
const staticProjects = [
  { slug: "linkedin-creator", url: "https://linkedin-creator-concept.vercel.app" },
  { slug: "airbnb-nomad", url: "https://airbnb-nomad-concept.vercel.app" },
  { slug: "netflix-altitude", url: "https://netflix-pilot-concept.vercel.app" },
  { slug: "spotify-drive", url: "https://spotify-drive-concept.vercel.app" },
  { slug: "aryav", url: "https://aryav-cinematic-real-estate-api-ser.vercel.app" },
  { slug: "aarna-salon", url: "https://aarna-salon.vercel.app" },
  { slug: "jaabili", url: "https://jaabili-tourism.vercel.app" },
  { slug: "naad", url: "https://naad-music-label.vercel.app" },
  { slug: "pawly", url: "https://pawly-pet-store.vercel.app" },
];

const dynamicListFile = process.env.RECORD_SLUGS_FILE;
const projects = dynamicListFile && existsSync(dynamicListFile)
  ? JSON.parse(readFileSync(dynamicListFile, "utf8"))
  : staticProjects;

const only = process.argv[2];
const targets = only ? projects.filter((p) => p.slug === only) : projects;

if (!targets.length) {
  console.log("Nothing to record.");
  process.exit(0);
}

const browser = await chromium.launch();

for (const project of targets) {
  console.log(`Recording ${project.slug} -> ${project.url}`);
  const tmpDir = join(videoDir, `.tmp-${project.slug}`);
  mkdirSync(tmpDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: tmpDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  try {
    await page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(screenshotDir, `${project.slug}.png`) });

    const height = await page.evaluate(() => document.body.scrollHeight);
    const steps = Math.min(6, Math.max(3, Math.round(height / 900)));
    for (let i = 1; i <= steps; i++) {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "smooth" }),
        (height / steps) * i,
      );
      await page.waitForTimeout(1400);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1000);
  } catch (err) {
    console.error(`  failed: ${err.message}`);
  }

  await context.close();

  // playwright names the file with a generated hash; find and rename it.
  const files = readdirSync(tmpDir);
  const video = files.find((f) => f.endsWith(".webm"));
  if (video) {
    renameSync(join(tmpDir, video), join(videoDir, `${project.slug}.webm`));
    console.log(`  saved ${project.slug}.webm`);
  } else {
    console.error(`  no video produced for ${project.slug}`);
  }
  rmSync(tmpDir, { recursive: true, force: true });
}

await browser.close();
console.log("Done.");
