import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { ShipScheduleMonthCards } from "@/components/ship-schedule-month-cards";
import {
  oldenScheduleIntegrity,
  formatScheduleDate,
  getOldenMonthSummaries,
  scheduleDisclaimer,
  shipScheduleHubPath,
} from "@/lib/olden-schedules";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Olden Cruise Ship Schedule",
  description:
    "Browse Olden cruise ship schedules by month. View arrival times, departure times, and cruise lines visiting Olden, Norway to plan your shore day.",
  path: shipScheduleHubPath,
});

export default function ShipScheduleHubPage() {
  const months = getOldenMonthSummaries();
  const firstLabel = oldenScheduleIntegrity.firstDate
    ? formatScheduleDate(oldenScheduleIntegrity.firstDate)
    : "";
  const lastLabel = oldenScheduleIntegrity.lastDate
    ? formatScheduleDate(oldenScheduleIntegrity.lastDate)
    : "";

  return (
    <ContentPage
      title="Olden cruise ship schedule"
      lead={`Published calls for Olden from ${firstLabel} to ${lastLabel}. Find your month, check arrival and departure times, then decide whether the village, Briksdal or Loen fits.`}
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath={shipScheduleHubPath}
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Ship schedule" },
      ]}
      ctaTitle="Plan your Olden port day"
      ctaText="Once you know your hours ashore, compare village, Briksdal and Loen options with a clear return buffer."
      ctaHref="/one-day-in-olden"
      ctaButtonLabel="Plan your Olden day"
      relatedLinks={[
        { label: "Olden shore excursions", href: "/excursions" },
        { label: "One day in Olden", href: "/one-day-in-olden" },
        { label: "Port guide", href: "/olden-port-guide" },
        { label: "Is Olden worth visiting?", href: "/is-olden-worth-visiting" },
      ]}
    >
      <section>
        <p className="rounded border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {scheduleDisclaimer}
        </p>
        <p className="mt-4 text-base leading-7 text-slate-700">
          This local timetable is filtered from the Norway Shore Excursions master
          schedule: {oldenScheduleIntegrity.total} Olden calls,{" "}
          {oldenScheduleIntegrity.byYear["2026"] ?? 0} in 2026,{" "}
          {oldenScheduleIntegrity.byYear["2027"] ?? 0} in 2027 and{" "}
          {oldenScheduleIntegrity.byYear["2028"] ?? 0} in 2028, across{" "}
          {oldenScheduleIntegrity.uniqueShips} ships.
        </p>
      </section>

      <section>
        <h2>Browse by month</h2>
        <ShipScheduleMonthCards months={months} />
      </section>

      <section>
        <h2>Why ship times matter in Olden</h2>
        <p>
          A short call usually suits the village. Briksdal and Loen need more
          hours and confirmed tickets. A longer day still does not prove both
          will fit. Always leave a clear buffer before all aboard.
        </p>
        <p>
          Continue to{" "}
          <Link href="/one-day-in-olden">one day in Olden</Link>,{" "}
          <Link href="/excursions">excursion options</Link>, the{" "}
          <Link href="/olden-port-guide">port guide</Link>, or{" "}
          <Link href="/is-olden-worth-visiting">is Olden worth visiting?</Link>.
        </p>
      </section>
    </ContentPage>
  );
}
