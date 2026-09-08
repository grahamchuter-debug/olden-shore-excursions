import schedulePayload from "@/data/olden-cruise-schedules.generated.json";

export type OldenScheduleRow = {
  port: string;
  ship: string;
  cruise_line: string;
  passengers: number | null;
  arrival_date: string;
  arrival_time: string | null;
  departure_time: string | null;
  all_aboard_time: string | null;
  source: string;
  source_url: string;
  source_checked: string | null;
  notes: string;
};

export type OldenScheduleEntry = {
  date: string;
  ship: string;
  arrival: string;
  departure: string;
  cruiseLine: string;
  allAboard: string | null;
  passengers: number | null;
};

type SchedulePayload = {
  port: string;
  portDisplayName: string;
  rowCount: number;
  integrity: {
    total: number;
    byYear: Record<string, number>;
    firstDate: string | null;
    lastDate: string | null;
    uniqueShips: number;
    cruiseLines: number;
    has2028: boolean;
  };
  rows: OldenScheduleRow[];
};

const payload = schedulePayload as SchedulePayload;

export const oldenScheduleIntegrity = payload.integrity;
export const oldenScheduleMeta = {
  port: payload.port,
  portDisplayName: payload.portDisplayName,
  rowCount: payload.rowCount,
} as const;

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export function monthKeyToSlug(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const index = Number(month) - 1;
  return `${MONTH_NAMES[index]}-${year}`;
}

export function monthSlugToKey(slug: string): string | null {
  const match = /^([a-z]+)-(\d{4})$/.exec(slug);
  if (!match) return null;
  const [, name, year] = match;
  const index = MONTH_NAMES.indexOf(name as (typeof MONTH_NAMES)[number]);
  if (index < 0) return null;
  return `${year}-${String(index + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatScheduleDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function displayTime(value: string | null | undefined): string {
  if (!value || !value.trim()) return "TBC";
  return value.trim();
}

function toEntry(row: OldenScheduleRow): OldenScheduleEntry {
  return {
    date: row.arrival_date,
    ship: row.ship,
    arrival: displayTime(row.arrival_time),
    departure: displayTime(row.departure_time),
    cruiseLine: row.cruise_line,
    allAboard: row.all_aboard_time,
    passengers: row.passengers,
  };
}

export function getAllOldenRows(): OldenScheduleRow[] {
  return payload.rows;
}

export function getOldenEntries(): OldenScheduleEntry[] {
  return payload.rows.map(toEntry);
}

export function getOldenEntriesForMonthKey(monthKey: string): OldenScheduleEntry[] {
  return payload.rows
    .filter((row) => row.arrival_date.startsWith(monthKey))
    .map(toEntry)
    .sort((a, b) => a.date.localeCompare(b.date) || a.ship.localeCompare(b.ship));
}

/** Ships calling Olden on a single ISO date (YYYY-MM-DD). */
export function getOldenEntriesForDate(isoDate: string): OldenScheduleEntry[] {
  return payload.rows
    .filter((row) => row.arrival_date === isoDate)
    .map(toEntry)
    .sort((a, b) => a.ship.localeCompare(b.ship));
}

export function getOldenMonthKeysWithCalls(): string[] {
  return [...new Set(payload.rows.map((row) => row.arrival_date.slice(0, 7)))].sort();
}

export function getOldenMonthSummaries() {
  return getOldenMonthKeysWithCalls().map((monthKey) => {
    const entries = getOldenEntriesForMonthKey(monthKey);
    const ships = new Set(entries.map((e) => e.ship));
    return {
      monthKey,
      slug: monthKeyToSlug(monthKey),
      label: formatMonthLabel(monthKey),
      callCount: entries.length,
      shipCount: ships.size,
    };
  });
}

export const shipScheduleHubPath = "/ship-schedule";

export function shipScheduleMonthPath(slug: string): string {
  return `/ship-schedule/${slug}`;
}

export const scheduleDisclaimer =
  "Published times come from the Norway Shore Excursions master schedule import. Always confirm arrival, departure and all aboard with your cruise line before finalising plans.";
