import Link from "next/link";

import {
  oldenScheduleIntegrity,
  formatScheduleDate,
  scheduleDisclaimer,
  shipScheduleHubPath,
  shipScheduleMonthPath,
  type getOldenMonthSummaries,
} from "@/lib/olden-schedules";

type MonthSummary = ReturnType<typeof getOldenMonthSummaries>[number];

export function ShipScheduleMonthCards({ months }: { months: MonthSummary[] }) {
  const byYear = months.reduce<Record<string, MonthSummary[]>>((acc, month) => {
    const year = month.monthKey.slice(0, 4);
    acc[year] = acc[year] ?? [];
    acc[year].push(month);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(byYear).map(([year, yearMonths]) => (
        <div key={year}>
          <h2 className="font-display text-xl font-semibold text-slate-900">{year}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {yearMonths.map((month) => (
              <li key={month.slug}>
                <Link
                  href={shipScheduleMonthPath(month.slug)}
                  className="block rounded border border-[var(--border-light)] bg-white px-4 py-4 transition hover:border-[var(--fjord)]"
                >
                  <p className="font-semibold text-slate-900">{month.label}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {month.callCount} published call{month.callCount === 1 ? "" : "s"} ·{" "}
                    {month.shipCount} ship{month.shipCount === 1 ? "" : "s"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-sm leading-6 text-slate-500">
        {scheduleDisclaimer} Coverage runs through{" "}
        {oldenScheduleIntegrity.lastDate
          ? formatScheduleDate(oldenScheduleIntegrity.lastDate)
          : "the last published call"}
        . Browse from the{" "}
        <Link href={shipScheduleHubPath} className="content-link">
          Olden ship schedule hub
        </Link>
        .
      </p>
    </div>
  );
}
