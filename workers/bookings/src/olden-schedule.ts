/**
 * Server-side Olden schedule checks — same generated JSON as the public site.
 * Used to verify scheduleMatched ship names cannot be spoofed by the client.
 */
import schedulePayload from "../../../src/data/olden-cruise-schedules.generated.json";

type ScheduleRow = {
  arrival_date: string;
  ship: string;
};

const rows = (schedulePayload as { rows: ScheduleRow[] }).rows;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeOldenIsoDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!ISO_DATE.test(trimmed)) return null;
  return trimmed;
}

export function oldenShipNamesForDate(isoDate: string): string[] {
  const date = normalizeOldenIsoDate(isoDate);
  if (!date) return [];
  return [
    ...new Set(
      rows
        .filter((row) => row.arrival_date === date)
        .map((row) => row.ship.trim())
        .filter(Boolean),
    ),
  ];
}

/**
 * When the client claims scheduleMatched, the ship must appear on that date.
 * Manual / not-listed ships skip this check.
 */
export function validateOldenScheduleShip(input: {
  date: string;
  shipName: string;
  scheduleMatched: boolean;
}): string | null {
  if (!input.scheduleMatched) return null;
  const date = normalizeOldenIsoDate(input.date);
  if (!date) return "Choose your cruise date.";
  const ship = input.shipName.trim();
  if (!ship) return "Tell us which ship you are arriving on.";
  const ships = oldenShipNamesForDate(date);
  if (!ships.length) {
    return "No published ship call matches that date. Choose “My ship isn’t listed” and enter the name.";
  }
  if (!ships.includes(ship)) {
    return "Selected ship does not match the published Olden schedule for that date.";
  }
  return null;
}
