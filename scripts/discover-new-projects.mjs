// Scans the saathvikvisuals GitHub account for repos that aren't in the portfolio
// yet, and appends them to project-intake.json so the existing projects:sync
// pipeline picks them up. Only considers repos with a `homepage` set (i.e.
// actually deployed) and skips the portfolio repo itself and any forks.
//
// Run locally with: GITHUB_TOKEN=<token> node scripts/discover-new-projects.mjs
// (the GitHub Action passes its own token automatically).
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const GITHUB_USER = "saathvikvisuals";
const PORTFOLIO_REPO_NAME = "saathvik-visuals";
const token = process.env.GITHUB_TOKEN;

const headers = {
  Accept: "application/vnd.github+json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, { headers });
if (!res.ok) {
  console.error(`GitHub API error: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const repos = await res.json();

const portfolioSrc = readFileSync(join(root, "src", "data", "portfolio.ts"), "utf8");
const knownGithubUrls = new Set([...portfolioSrc.matchAll(/github:\s*"([^"]+)"/g)].map((m) => m[1].toLowerCase()));

const intakePath = join(root, "project-intake.json");
const intake = existsSync(intakePath) ? JSON.parse(readFileSync(intakePath, "utf8")) : [];
const knownIntakeUrls = new Set(intake.map((p) => (p.github ?? "").toLowerCase()));

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function titleCase(value) {
  return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const discovered = [];

for (const repo of repos) {
  if (repo.fork || repo.archived || repo.private) continue;
  if (repo.name === PORTFOLIO_REPO_NAME) continue;
  if (!repo.homepage) continue;

  const githubUrl = repo.html_url.toLowerCase();
  if (knownGithubUrls.has(githubUrl) || knownIntakeUrls.has(githubUrl)) continue;

  const slug = slugify(repo.name);
  discovered.push({
    slug,
    name: titleCase(repo.name),
    url: repo.homepage,
    github: repo.html_url,
    image: `/project-screenshots/${slug}.png`,
    description: repo.description ?? "A live Saathvik Visuals project.",
    tags: repo.topics ?? [],
  });
}

if (!discovered.length) {
  console.log("No new deployed projects found.");
  process.exit(0);
}

const merged = [...intake, ...discovered];
writeFileSync(intakePath, `${JSON.stringify(merged, null, 2)}\n`);

console.log(`Discovered ${discovered.length} new project(s): ${discovered.map((p) => p.slug).join(", ")}`);
// Emit for the workflow to pick up which slugs need recording.
writeFileSync(join(root, ".new-project-slugs.json"), JSON.stringify(discovered.map((p) => ({ slug: p.slug, url: p.url }))));
