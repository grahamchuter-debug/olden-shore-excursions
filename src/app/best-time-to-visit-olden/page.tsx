import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Best Time to Visit Olden for Cruise Passengers",
  description:
    "When to visit Olden on a cruise: peak season, glacier access, Loen Skylift availability, valley weather, crowds at Briksdal Glacier, and return-to-ship planning by month.",
  path: "/best-time-to-visit-olden",
  ogImage: siteImages.portGuide,
  ogImageAlt: imageAlts.portGuide,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: "Shore excursions", href: "/excursions" },
  { label: "Olden port guide", href: "/olden-port-guide" },
  { label: "Is Olden worth visiting?", href: "/is-olden-worth-visiting" },
] as const;

const faqs = [
  {
    question: "What is the best month for Olden cruise shore excursions?",
    answer:
      "May through September offers the most reliable Briksdal Glacier access, Loen Skylift operation, and walkable weather for village tours. June and July are busiest, book excursions early.",
  },
  {
    question: "Is Olden crowded in summer?",
    answer:
      "Yes on peak cruise days when multiple ships call. Disembark early, pre-book Briksdal Glacier tours, and consider morning Loen Skylift departures before valley roads fill up.",
  },
  {
    question: "Can I visit Olden on a winter cruise?",
    answer:
      "Winter calls are possible with fewer crowds and dramatic light, but daylight is short and some glacier routes may have reduced access. Pack warm layers and confirm excursion times in advance.",
  },
  {
    question: "Does weather affect Briksdal Glacier and Loen Skylift tours?",
    answer:
      "Valley rain and cloud can enhance waterfall scenery but reduce distant views from Mount Hoven. Glacier tours usually run in most conditions, pack waterproof layers regardless of season.",
  },
] as const;

export default function BestTimeToVisitOldenPage() {
  return (
    <ContentPage
      title="Best Time to Visit Olden"
      lead="Season-by-season advice for cruise passengers choosing when to book Briksdal Glacier tours, Loen Skylift trips, and harbour time in Olden."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Peak cruise season: May to September</h2>
        <p>
          Most Olden cruise calls arrive between late spring and early autumn.
          Longer daylight, active glacier excursion operators, and operating
          Loen Skylift make this the best window for shore excursions. June
          through August sees the highest ship volumes, plan ahead.
        </p>
      </section>

      <section>
        <h2>June and July: best glacier scenery, busiest ports</h2>
        <p>
          Mid-summer delivers the classic Norway glacier experience cruise guests
          expect, green valley walls, accessible Briksdal viewpoints, and full
          excursion timetables. Book Briksdal Glacier and Loen Skylift tours in
          advance on multi-ship days.
        </p>
      </section>

      <section>
        <h2>May and September: balance of light and crowds</h2>
        <p>
          Shoulder months often mean slightly fewer passengers ashore while
          operators still run regular glacier and skylift tours. September can
          bring crisp air and golden light for photography in Oldedalen valley
          and around the harbour.
        </p>
      </section>

      <section>
        <h2>Winter and off-season calls</h2>
        <p>
          Winter cruises offer atmospheric valleys and shorter queues, but cold
          weather and limited daylight change the pace. Walking tours remain
          viable with proper clothing; always confirm whether Briksdal and Loen
          Skylift operate on your exact date.
        </p>
      </section>

      <section>
        <h2>Planning tips whatever month you visit</h2>
        <ul>
          <li>Pre-book headline glacier excursions on peak summer itineraries</li>
          <li>Pack a waterproof layer, valley weather shifts quickly</li>
          <li>Build 30 to 45 minutes buffer before all aboard every season</li>
          <li>
            Read the{" "}
            <Link href="/olden-port-guide">port guide</Link> for pier walking
            times and glacier travel notes
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
