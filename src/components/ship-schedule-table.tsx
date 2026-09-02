"use client";

import { useMemo, useState } from "react";

import {
  formatScheduleDate,
  type OldenScheduleEntry,
} from "@/lib/olden-schedules";

type SortKey = keyof Pick<
  OldenScheduleEntry,
  "date" | "ship" | "arrival" | "departure" | "cruiseLine"
>;
type SortDirection = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "ship", label: "Ship" },
  { key: "arrival", label: "Arrival" },
  { key: "departure", label: "Departure" },
  { key: "cruiseLine", label: "Cruise line" },
];

function compareValues(
  a: OldenScheduleEntry,
  b: OldenScheduleEntry,
  key: SortKey,
): number {
  if (key === "date") return a.date.localeCompare(b.date);
  if (key === "arrival" || key === "departure") {
    const normalize = (value: string) =>
      value.toLowerCase() === "tbc" || value.toLowerCase() === "tb"
        ? "99:99"
        : value;
    return normalize(a[key]).localeCompare(normalize(b[key]));
  }
  return a[key].localeCompare(b[key], undefined, { sensitivity: "base" });
}

type ShipScheduleTableProps = {
  entries: OldenScheduleEntry[];
};

export function ShipScheduleTable({ entries }: ShipScheduleTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? entries.filter((entry) =>
          [
            formatScheduleDate(entry.date),
            entry.date,
            entry.ship,
            entry.arrival,
            entry.departure,
            entry.cruiseLine,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : entries;

    return [...filtered].sort((a, b) => {
      const result = compareValues(a, b, sortKey);
      return sortDirection === "asc" ? result : -result;
    });
  }, [entries, query, sortDirection, sortKey]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Search Olden ship schedule
        </span>
        <input
          id="schedule-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search Olden ship schedule"
          placeholder="Search by ship, cruise line or date"
          className="w-full rounded border border-[var(--border-light)] bg-white px-3 py-3 text-sm text-slate-900"
        />
      </label>

      <p className="text-sm text-slate-600">
        Showing {filteredEntries.length} of {entries.length} published calls
      </p>

      <div className="hidden overflow-x-auto rounded border border-[var(--border-light)] bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-3 py-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="inline-flex min-h-11 items-center gap-1"
                  >
                    {column.label}
                    <span aria-hidden="true" className="text-slate-400">
                      {sortKey === column.key
                        ? sortDirection === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-slate-600">
                  No ships match your search. Try a different ship name, date, or
                  cruise line.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr
                  key={`${entry.date}-${entry.ship}-${entry.cruiseLine}-${entry.arrival}`}
                  className="border-t border-[var(--border-light)]"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatScheduleDate(entry.date)}
                  </td>
                  <td className="max-w-[14rem] px-3 py-3 font-medium text-slate-900">
                    {entry.ship}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{entry.arrival}</td>
                  <td className="whitespace-nowrap px-3 py-3">{entry.departure}</td>
                  <td className="px-3 py-3">{entry.cruiseLine || "Not listed"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {filteredEntries.length === 0 ? (
          <li className="rounded border border-[var(--border-light)] bg-white p-4 text-slate-600">
            No ships match your search. Try a different ship name, date, or
            cruise line.
          </li>
        ) : (
          filteredEntries.map((entry) => (
            <li
              key={`m-${entry.date}-${entry.ship}-${entry.arrival}`}
              className="rounded border border-[var(--border-light)] bg-white p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {formatScheduleDate(entry.date)}
              </p>
              <p className="mt-1 font-semibold text-slate-900">{entry.ship}</p>
              <p className="mt-1 text-sm text-slate-600">
                {entry.cruiseLine || "Not listed"}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Arrive {entry.arrival} · Depart {entry.departure}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
