/**
 * Olden schedule lookup tests — booking date step must share /ship-schedule data.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getOldenEntriesForDate,
  getOldenShipNamesForDate,
  normalizeIsoDate,
  oldenScheduleIntegrity,
  scheduleEntryKey,
  slugifyShipName,
} from "./olden-schedules";

test("schedule integrity includes 2026–2028", () => {
  assert.ok((oldenScheduleIntegrity.byYear["2026"] ?? 0) > 0);
  assert.ok((oldenScheduleIntegrity.byYear["2027"] ?? 0) > 0);
  assert.ok((oldenScheduleIntegrity.byYear["2028"] ?? 0) > 0);
  assert.equal(oldenScheduleIntegrity.has2028, true);
});

test("normalizeIsoDate trims and rejects non-ISO / locale display forms", () => {
  assert.equal(normalizeIsoDate(" 2026-09-21 "), "2026-09-21");
  assert.equal(normalizeIsoDate("24/09/2026"), null);
  assert.equal(normalizeIsoDate(""), null);
});

test("2026 single-ship date resolves Britannia", () => {
  const entries = getOldenEntriesForDate("2026-09-21");
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.ship, "Britannia");
});

test("2026 multi-ship date returns distinct ships", () => {
  const entries = getOldenEntriesForDate("2026-06-01");
  const names = getOldenShipNamesForDate("2026-06-01");
  assert.ok(entries.length >= 2);
  assert.ok(names.includes("Mein Schiff 3"));
  assert.ok(names.includes("Bolette"));
  assert.equal(new Set(entries.map(scheduleEntryKey)).size, entries.length);
});

test("2026 no-call date returns empty (manual fallback)", () => {
  assert.deepEqual(getOldenEntriesForDate("2026-09-24"), []);
});

test("2027 single-ship and multi-ship dates resolve", () => {
  const single = getOldenEntriesForDate("2027-03-31");
  assert.equal(single.length, 1);
  assert.equal(single[0]!.ship, "Arvia");

  const multi = getOldenShipNamesForDate("2027-05-09");
  assert.ok(multi.length >= 2);
  assert.ok(multi.includes("AIDAluna"));
  assert.ok(multi.includes("Borealis"));
});

test("2028 single-ship and multi-ship dates resolve", () => {
  const single = getOldenEntriesForDate("2028-04-04");
  assert.equal(single.length, 1);
  assert.equal(single[0]!.ship, "Iona");

  const multi = getOldenShipNamesForDate("2028-05-06");
  assert.ok(multi.length >= 2);
  assert.ok(multi.includes("AIDAmar"));
  assert.ok(multi.includes("Ambience"));
});

test("slugifyShipName is stable for booking persistence", () => {
  assert.equal(slugifyShipName("Mein Schiff 3"), "mein-schiff-3");
  assert.equal(slugifyShipName("Britannia"), "britannia");
});
