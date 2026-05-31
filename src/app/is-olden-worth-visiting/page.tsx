import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Is Olden Worth Visiting for Cruise Passengers?",
  description:
    "Honest guide for cruise guests: is Olden worth visiting? Glacier scenery, lakes, waterfalls, dramatic valley setting, and why Olden ranks among Norway's most scenic cruise ports.",
  path: "/is-olden-worth-visiting",
  ogImage: siteImages.worthVisiting,
  ogImageAlt: imageAlts.worthVisiting,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: "Shore excursions", href: "/excursions" },
  { label: "Olden port guide", href: "/olden-port-guide" },
  { label: "One day in Olden", href: "/one-day-in-olden" },
  { label: "Best time to visit", href: "/best-time-to-visit-olden" },
] as const;

const faqs = [
  {
    question: "Is Olden worth visiting from a cruise ship?",
    answer:
      "Yes, Olden is one of the most scenic ports on any Norwegian fjord itinerary. Briksdal Glacier, glacial lakes, waterfalls, and dramatic valley scenery make it a highlight for most cruise passengers.",
  },
  {
    question: "How long should I spend in Olden?",
    answer:
      "Four hours allows a village walk. Six hours unlocks Briksdal Glacier or scenic valley touring. Eight or more hours enables Loen Skylift, private glacier tours, and full valley combinations.",
  },
  {
    question: "Can I see a glacier from Olden cruise port?",
    answer:
      "Yes. Briksdal Glacier is reached by shore excursion through Oldedalen valley, one of Norway's most accessible glacier experiences from a cruise port.",
  },
  {
    question: "What is the best Olden shore excursion?",
    answer:
      "The Briksdal Glacier and Olden Lake Discovery tour is the headline choice for first-time visitors with enough port time. For shorter calls, the Olden Walking Tour fits comfortably.",
  },
  {
    question: "Is Olden walkable from the cruise port?",
    answer:
      "Yes. Olden village is compact and the cruise pier is within minutes of shops, cafés, and excursion meeting points.",
  },
  {
    question: "Why is Olden considered one of Norway's most scenic cruise ports?",
    answer:
      "Olden combines an accessible glacier arm, turquoise glacial lakes, waterfall-filled valleys, and Loen Skylift viewpoints, all within easy reach of the cruise pier in a compact Nordfjord setting.",
  },
] as const;

export default function IsOldenWorthVisitingPage() {
  return (
    <ContentPage
      title="Is Olden Worth Visiting?"
      lead="An honest look at whether Olden deserves your hours ashore, glacier scenery, lakes, waterfalls, dramatic valley setting, and why Olden ranks among Norway's most scenic cruise ports."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Short answer: yes for most cruise itineraries</h2>
        <p>
          Olden is one of the strongest scenic ports in Norway. You get
          Briksdal Glacier, an accessible arm of Europe&apos;s largest
          mainland ice cap, plus glacial lakes, waterfalls, and Loen Skylift
          viewpoints above Nordfjord. For most guests, going ashore is
          absolutely worthwhile.
        </p>
      </section>

      <section>
        <h2>Glacier scenery and dramatic valleys</h2>
        <p>
          Briksdalsbreen terminates in a glacial lake at the end of Oldedalen
          valley, surrounded by steep peaks and pine forests. The{" "}
          <Link href="/excursions/briksdal-glacier-olden-lake">
            Briksdal Glacier and Olden Lake Discovery
          </Link>{" "}
          tour puts you at the heart of this landscape, the experience that
          defines Olden as a cruise destination.
        </p>
      </section>

      <section>
        <h2>Lakes, waterfalls, and Nordfjord setting</h2>
        <p>
          Oldedalen valley delivers turquoise lake water, cascading waterfalls,
          and photo stops at every turn. The{" "}
          <Link href="/excursions/lakes-glaciers-waterfalls">
            Scenic Lakes, Glaciers and Waterfalls Tour
          </Link>{" "}
          explores this countryside for passengers who want broad nature scenery
          on a moderate port day.
        </p>
      </section>

      <section>
        <h2>Why Olden is one of the most scenic Norway cruise ports</h2>
        <ul>
          <li>Accessible glacier arm within reach of the cruise pier</li>
          <li>Glacial lakes and waterfall-filled valley roads</li>
          <li>Loen Skylift to Mount Hoven for fjord panoramas</li>
          <li>Compact village, no long transfers to reach excursions</li>
          <li>Dramatic mountain backdrop visible from the ship and shore</li>
          <li>Range of tours from walking to private glacier sightseeing</li>
        </ul>
      </section>

      <section>
        <h2>Cruise experience and easy shore access</h2>
        <p>
          Most ships dock at the village pier with immediate access to the
          harbour. Excursion meeting points, cafés, and shops are minutes from
          the gangway, so you spend port time on glacier and valley experiences
          rather than in transfers.
        </p>
      </section>

      <section>
        <h2>When Olden might not be worth leaving the ship</h2>
        <p>
          If your port time is under three hours, severe weather limits
          visibility, or you have mobility limits without a suitable tour,
          staying aboard may be safer. Very tight schedules rarely fit Briksdal
          or Loen Skylift comfortably, though even a short village walk
          delivers authentic Nordfjord atmosphere.
        </p>
      </section>

      <section>
        <h2>Plan your Olden port day</h2>
        <p>
          Browse our{" "}
          <Link href="/excursions">shore excursions</Link>, read the{" "}
          <Link href="/olden-port-guide">port guide</Link>, and use the{" "}
          <Link href="/#planner">Cruise Smart Planner</Link> to match activities
          to your ship&apos;s timetable before you sail.
        </p>
      </section>
    </ContentPage>
  );
}
