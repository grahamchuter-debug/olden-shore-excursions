/**
 * Temporary Olden visual QA harness.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, ".qa-artifacts");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4173";
const chrome =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

const pages = [
  { path: "/", label: "home" },
  { path: "/excursions", label: "excursions" },
  { path: "/excursions/briksdal-glacier-olden-lake", label: "briksdal" },
  { path: "/olden-port-guide", label: "port-guide" },
  { path: "/one-day-in-olden", label: "one-day" },
  { path: "/is-olden-worth-visiting", label: "worth-visiting" },
  { path: "/best-time-to-visit-olden", label: "best-time" },
  { path: "/ship-schedule", label: "schedule-hub" },
  { path: "/ship-schedule/june-2026", label: "month-busy" },
  { path: "/ship-schedule/march-2027", label: "month-light" },
  { path: "/about", label: "about" },
  { path: "/contact", label: "contact" },
  { path: "/privacy", label: "privacy" },
  { path: "/terms", label: "terms" },
];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const findings = [];

function note(level, message) {
  findings.push({ level, message });
  console.log(`[${level}] ${message}`);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
    });

    for (const route of pages) {
      const url = `${base}${route.path}`;
      const response = await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      const status = response?.status() ?? 0;
      if (status >= 400) {
        note("FAIL", `${route.path} @${vp.name} status ${status}`);
        continue;
      }

      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const overflowX =
          Math.max(doc.scrollWidth, body.scrollWidth) > window.innerWidth + 1;
        const bookHits = Array.from(document.querySelectorAll("a,button")).filter(
          (el) =>
            /BOOK NOW|Book a Tour|CHECK AVAILABILITY|RESERVE/i.test(
              el.textContent || "",
            ),
        ).length;
        const emailLinks = Array.from(
          document.querySelectorAll('a[href^="mailto:"]'),
        ).map((a) => a.getAttribute("href"));
        const h1 = document.querySelectorAll("h1").length;
        const sibling = /Lysefjord|Pulpit Rock|Bryggen|Nidaros|Bakklandet|Flamsbana|Stegastein|Dalsnibba/i.test(
          body.innerText || "",
        );
        const isoRaw = /\b20\d{2}-\d{2}-\d{2}\b/.test(body.innerText || "");
        return { overflowX, bookHits, emailLinks, h1, sibling, isoRaw };
      });

      if (metrics.overflowX) note("WARN", `overflow-x ${route.path} @${vp.name}`);
      if (metrics.bookHits > 0)
        note("FAIL", `banned CTA visible ${route.path} @${vp.name}`);
      if (metrics.h1 !== 1)
        note("WARN", `h1 count ${metrics.h1} on ${route.path} @${vp.name}`);
      if (
        metrics.emailLinks.some((h) =>
          (h || "").includes("hello@oldenshoreexcursions.com"),
        )
      ) {
        note(
          "FAIL",
          `unverified email exposed as mailto on ${route.path} @${vp.name}`,
        );
      }
      if (metrics.sibling && !route.path.includes("olden-port-guide")) {
        note("WARN", `possible sibling remnant text on ${route.path} @${vp.name}`);
      }
      if (metrics.isoRaw && route.path.startsWith("/ship-schedule")) {
        note("WARN", `raw ISO date visible ${route.path} @${vp.name}`);
      }

      await page.screenshot({
        path: path.join(outDir, `${route.label}-${vp.name}.png`),
        fullPage: false,
      });
    }

    if (vp.width <= 430) {
      await page.goto(`${base}/`, { waitUntil: "networkidle2", timeout: 60000 });
      const menu = await page.$('button[aria-controls="mobile-nav"]');
      if (menu) {
        await menu.click();
        await page.waitForSelector("#mobile-nav", { visible: true });
        await page.screenshot({
          path: path.join(outDir, `home-menu-open-${vp.name}.png`),
          fullPage: false,
        });
        note("INFO", `mobile menu open captured @${vp.name}`);
      } else {
        note("WARN", `mobile menu button missing @${vp.name}`);
      }
    }

    if (vp.width === 390 || vp.width === 1440) {
      await page.goto(`${base}/ship-schedule/june-2026`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      const search = await page.$(
        'input[type="search"], input[aria-label*="earch" i], input[placeholder*="earch" i]',
      );
      if (search) {
        await search.click({ clickCount: 3 });
        await search.type("ZZZNOMATCH");
        await new Promise((r) => setTimeout(r, 300));
        await page.screenshot({
          path: path.join(outDir, `schedule-empty-${vp.name}.png`),
          fullPage: false,
        });
        note("INFO", `empty schedule search captured @${vp.name}`);
      } else {
        note("WARN", `schedule search input not found @${vp.name}`);
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
}

writeFileSync(path.join(outDir, "findings.json"), JSON.stringify(findings, null, 2));
const fails = findings.filter((f) => f.level === "FAIL");
const warns = findings.filter((f) => f.level === "WARN");
console.log(`\nVisual QA summary: ${fails.length} FAIL, ${warns.length} WARN`);
if (fails.length) process.exit(1);
