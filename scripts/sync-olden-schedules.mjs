import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourcePath = path.resolve(root, "../norway-shore-excursions/src/data/cruise-schedules.generated.json");
const outPath = path.join(root, "src/data/olden-cruise-schedules.generated.json");
const payload = JSON.parse(readFileSync(sourcePath, "utf8"));
const rows = (payload.rows || []).filter((r) => r.port === "olden");
const years = {};
for (const r of rows) years[r.arrival_date.slice(0,4)] = (years[r.arrival_date.slice(0,4)]||0)+1;
const ships = new Set(rows.map((r)=>r.ship));
const lines = new Set(rows.map((r)=>r.cruise_line));
const dates = rows.map((r)=>r.arrival_date).sort();
const out = {
  port: "olden", portDisplayName: "Olden",
  syncedAt: new Date().toISOString(),
  sourceFile: "norway-shore-excursions/src/data/cruise-schedules.generated.json",
  sourceGeneratedAt: payload.generatedAt ?? null,
  source: payload.source ?? "CSV import pipeline",
  filter: 'port === "olden"',
  rowCount: rows.length,
  integrity: { total: rows.length, byYear: years, firstDate: dates[0]??null, lastDate: dates[dates.length-1]??null, uniqueShips: ships.size, cruiseLines: lines.size, has2028: Boolean(years["2028"]) },
  rows,
};
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(out, null, 2)+"\n");
console.log(JSON.stringify(out.integrity, null, 2));
