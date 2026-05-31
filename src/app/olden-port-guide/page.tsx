import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Olden Cruise Port Guide",
  description:
    "Olden cruise port guide for passengers: cruise dock and tender notes, walking distances, Briksdal Glacier travel, Loen Skylift timing, weather advice, and return-to-ship buffer tips.",
  path: "/olden-port-guide",
  ogImage: siteImages.portGuide,
  ogImageAlt: imageAlts.portGuide,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Olden Port Guide" },
] as const;

const relatedLinks = [
  { label: "Shore excursions", href: "/excursions" },
  { label: "One day in Olden", href: "/one-day-in-olden" },
  { label: "Is Olden worth visiting?", href: "/is-olden-worth-visiting" },
  { label: "Best time to visit", href: "/best-time-to-visit-olden" },
] as const;

const faqs = [
  {
    question: "Does Olden have a cruise pier or is it a tender port?",
    answer:
      "Most cruise ships dock at the Olden cruise pier in the village centre. Some larger vessels may use tender boats, confirm your ship's arrangement on the cruise app the night before arrival.",
  },
  {
    question: "How far is the Olden cruise port from the village centre?",
    answer:
      "The village is compact, the cruise pier is within walking distance of shops, cafés, and excursion meeting points, typically 2 to 5 minutes on foot.",
  },
  {
    question: "How long does it take to reach Briksdal Glacier from Olden?",
    answer:
      "Briksdal Glacier is approximately 25 km south via Oldedalen valley. Allow roughly 45 to 60 minutes each way by coach, plus time at the glacier, plan for a four-to-five-hour excursion minimum.",
  },
  {
    question: "How early should cruise passengers return to the ship in Olden?",
    answer:
      "Plan to be back at the cruise pier at least 30 to 45 minutes before all aboard. Security screening and gangway queues can compress that buffer on peak summer days.",
  },
] as const;

export default function OldenPortGuidePage() {
  return (
    <ContentPage
      title="Olden Port Guide for Cruise Passengers"
      lead="Everything you need to navigate Olden cruise port, pier and tender access, walking distances, Briksdal Glacier travel, Loen Skylift timing, weather advice, and return-to-ship buffer guidance."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      breadcrumbs={breadcrumbs}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Cruise dock and tender information</h2>
        <p>
          Olden is primarily a dock port. Most cruise ships berth at the village
          pier with immediate access to the harbour and village centre. On
          occasional busy days or for very large vessels, tender boats may
          transfer passengers ashore, check your cruise line&apos;s app for
          your specific arrangement.
        </p>
        <p>
          Either way, you arrive close to excursion meeting points, cafés, and
          the waterfront. Disembark as early as your cruise line allows on
          popular Briksdal Glacier days.
        </p>
      </section>

      <section>
        <h2>Walking distances from the cruise pier</h2>
        <ul>
          <li>
            <strong>Village centre and harbour:</strong> 2 to 5 minutes on foot
            from the cruise pier
          </li>
          <li>
            <strong>Tourist information and shops:</strong> in the village
            centre, walkable from the pier
          </li>
          <li>
            <strong>Excursion meeting points:</strong> typically signed locations
            near the harbour within minutes of the gangway
          </li>
          <li>
            <strong>Briksdal Glacier:</strong> 25 km by road, coach excursion
            only, not walkable
          </li>
          <li>
            <strong>Loen Skylift:</strong> 15 km from Olden, road transport
            required, approx. 20 to 25 minutes
          </li>
        </ul>
      </section>

      <section>
        <h2>Briksdal Glacier travel considerations</h2>
        <p>
          Briksdalsbreen lies at the end of Oldedalen valley, reached by a
          scenic but narrow valley road. Coach and minibus tours are the
          practical route, do not rely on taxis without a pre-arranged booking.
          Allow approximately four to five hours for a round-trip glacier
          excursion including time at viewpoints.
        </p>
        <p>
          The final approach may include a short walk or shuttle from the car
          park to the glacier lake, depending on the operator and season. Wear
          sturdy shoes and pack a waterproof layer, valley weather changes
          quickly.
        </p>
      </section>

      <section>
        <h2>Loen Skylift timing considerations</h2>
        <p>
          Loen Skylift is approximately 15 km from Olden. Most shore excursions
          include transport and pre-arranged skylift tickets. The ride to Mount
          Hoven takes about five minutes each way; allow time for summit
          viewing and potential queues on busy days.
        </p>
        <p>
          Visibility from Mount Hoven is weather-dependent. Clear days deliver
          exceptional fjord panoramas; mist and cloud can limit distant views.
          Build your itinerary with a weather backup if possible.
        </p>
      </section>

      <section>
        <h2>Weather and clothing advice</h2>
        <p>
          Olden sits at the head of Nordfjord beneath steep mountains and
          glacier valleys. Summer can be mild but changeable; glacier and
          skylift viewpoints are exposed to wind and rain. Pack layers, a
          waterproof jacket, and comfortable walking shoes for every shore
          excursion.
        </p>
      </section>

      <section>
        <h2>Return-to-ship buffer advice</h2>
        <ul>
          <li>Aim to be at the cruise pier 30 to 45 minutes before all aboard</li>
          <li>Pre-book Briksdal and Loen Skylift tours on multi-ship days</li>
          <li>Monitor your cruise app for timetable updates throughout the day</li>
          <li>
            Use the{" "}
            <Link href="/#planner">Cruise Smart Planner</Link> to match
            activities to your hours ashore
          </li>
          <li>
            Allow extra margin if your ship uses tender boats rather than the
            main pier
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
