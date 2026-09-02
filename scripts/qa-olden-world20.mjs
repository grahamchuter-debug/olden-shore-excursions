/**
 * Olden World 2.0 destination QA.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

const dataPath = path.join(root, "src/data/olden-cruise-schedules.generated.json");
if (!existsSync(dataPath)) {
  fail("missing olden-cruise-schedules.generated.json");
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const rows = data.rows || [];
const integrity = data.integrity || {};

const expected = {
  total: 144,
  y2026: 90,
  y2027: 54,
  first: "2026-06-01",
  last: "2027-11-02",
  ships: 44,
  lines: 23,
};

if (data.port !== "olden") {
  fail(`generated port ${data.port}, expected olden`);
} else {
  pass("generated JSON filtered to port === olden");
}

if (integrity.total !== expected.total || rows.length !== expected.total) {
  fail(`total calls ${integrity.total}/${rows.length}, expected ${expected.total}`);
} else {
  pass(`total Olden calls ${expected.total}`);
}

if ((integrity.byYear?.["2026"] ?? 0) !== expected.y2026) {
  fail(`2026 ${integrity.byYear?.["2026"]}, expected ${expected.y2026}`);
} else {
  pass(`2026 calls ${expected.y2026}`);
}

if ((integrity.byYear?.["2027"] ?? 0) !== expected.y2027) {
  fail(`2027 ${integrity.byYear?.["2027"]}, expected ${expected.y2027}`);
} else {
  pass(`2027 calls ${expected.y2027}`);
}

if (integrity.firstDate !== expected.first || integrity.lastDate !== expected.last) {
  fail(`date range ${integrity.firstDate}..${integrity.lastDate}`);
} else {
  pass(`date range ${expected.first} .. ${expected.last}`);
}

if (integrity.uniqueShips !== expected.ships) {
  fail(`unique ships ${integrity.uniqueShips}, expected ${expected.ships}`);
} else {
  pass(`unique ships ${expected.ships}`);
}

if (integrity.cruiseLines !== expected.lines) {
  fail(`cruise lines ${integrity.cruiseLines}, expected ${expected.lines}`);
} else {
  pass(`cruise lines ${expected.lines}`);
}

if (integrity.has2028 || rows.some((r) => String(r.arrival_date).startsWith("2028"))) {
  fail("2028 schedule data present");
} else {
  pass("no 2028 schedule data");
}

const required = [
  "src/app/about/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/ship-schedule/page.tsx",
  "src/app/ship-schedule/[monthSlug]/page.tsx",
  "src/app/excursions/page.tsx",
  "src/app/olden-port-guide/page.tsx",
  "src/app/one-day-in-olden/page.tsx",
  "src/app/is-olden-worth-visiting/page.tsx",
  "src/app/best-time-to-visit-olden/page.tsx",
  "src/lib/image-provenance.ts",
];
for (const rel of required) {
  if (!existsSync(path.join(root, rel))) fail(`missing ${rel}`);
  else pass(`exists ${rel}`);
}

const preserved = [
  "src/app/page.tsx",
  "src/app/excursions/briksdal-glacier-olden-lake/page.tsx",
  "src/app/excursions/private-briksdal-glacier-olden-lake/page.tsx",
  "src/app/excursions/loen-skylift-mount-hoven/page.tsx",
  "src/app/excursions/olden-walking-tour/page.tsx",
  "src/app/excursions/lakes-glaciers-waterfalls/page.tsx",
  "src/app/olden-port-guide/page.tsx",
  "src/app/best-time-to-visit-olden/page.tsx",
];
for (const rel of preserved) {
  if (!existsSync(path.join(root, rel))) fail(`preserved route missing ${rel}`);
  else pass(`preserved ${rel}`);
}

pass("no /excursions redirect required; Olden hub is already /excursions");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const srcFiles = walk(path.join(root, "src"));
const banned = [/BOOK NOW/i, /Book a Tour/, /Book this excursion/];
let bannedHits = 0;
for (const file of srcFiles) {
  const text = readFileSync(file, "utf8");
  for (const pattern of banned) {
    if (pattern.test(text)) {
      bannedHits += 1;
      fail(`banned CTA pattern ${pattern} in ${path.relative(root, file)}`);
    }
  }
  if (/stripe|checkout\.session|payment.?intent/i.test(text)) {
    bannedHits += 1;
    fail(`payment infrastructure ref in ${path.relative(root, file)}`);
  }
}
if (bannedHits === 0) {
  pass("no BOOK NOW / Book a Tour / Book this excursion / payment infra in src");
}

const chromeFiles = [
  "src/components/site-footer.tsx",
  "src/app/page.tsx",
  "src/app/ship-schedule/page.tsx",
];
for (const rel of chromeFiles) {
  const text = readFileSync(path.join(root, rel), "utf8");
  if (/Lysefjord|Pulpit Rock|Preikestolen|Bryggen|Mostraumen|Nidaros|Bakklandet|Flamsbana|Stegastein|Dalsnibba|Flydalsjuvet/.test(text)) {
    fail(`sibling-destination remnant in ${rel}`);
  } else {
    pass(`no sibling remnant in ${rel}`);
  }
}

const config = readFileSync(path.join(root, "src/lib/site-config.ts"), "utf8");
if (!config.includes("oldenshoreexcursions.com")) {
  fail("canonical domain missing from site-config");
} else {
  pass("canonical domain oldenshoreexcursions.com present");
}

if (!config.includes("contactEmailVerified: true")) {
  fail("contactEmailVerified should be true after Cloudflare routing activation");
} else {
  pass("contact email marked verified");
}

if (!config.includes("hello@oldenshoreexcursions.com")) {
  fail("reserved contact email missing from config");
} else {
  pass("reserved contact email present in config");
}

if (/mailto:hello@oldenshoreexcursions\.com/.test(config)) {
  fail("mailto on unverified address in site-config");
} else {
  pass("no mailto in site-config");
}

const sitemapSrc = readFileSync(path.join(root, "src/app/sitemap.ts"), "utf8");
if (!sitemapSrc.includes("getSiteRoutes")) {
  fail("sitemap does not use getSiteRoutes");
} else {
  pass("sitemap uses getSiteRoutes including populated months");
}

const monthKeys = [...new Set(rows.map((r) => r.arrival_date.slice(0, 7)))].sort();
if (monthKeys.length !== 13) {
  fail(`populated months ${monthKeys.length}, expected 13`);
} else {
  pass("13 populated Olden months");
}

console.log(
  "\nINFO: sync source = norway-shore-excursions generated JSON, filter port===olden",
);
if (process.exitCode) {
  console.error("\nQA FAILED");
  process.exit(1);
}
console.log("\nQA PASSED");
