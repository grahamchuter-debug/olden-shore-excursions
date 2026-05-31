import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "One Day in Olden for Cruise Passengers",
  description:
    "Sample one-day Olden itineraries for cruise guests: 4-hour, 6-hour, and 8+ hour plans with Briksdal Glacier, Olden Lake, Loen Skylift, and village time with realistic return-to-ship timing.",
  path: "/one-day-in-olden",
  ogImage: siteImages.briksdalGlacier,
  ogImageAlt: imageAlts.briksdalGlacier,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: "Shore excursions", href: "/excursions" },
  { label: "Olden port guide", href: "/olden-port-guide" },
  { label: "Is Olden worth visiting?", href: "/is-olden-worth-visiting" },
] as const;

const faqs = [
  {
    question: "What can cruise passengers do in Olden with only four hours ashore?",
    answer:
      "Focus on the Olden Walking and Village Highlights tour or a self-guided harbour stroll. Skip Briksdal Glacier and Loen Skylift, they need more time than a four-hour window allows comfortably.",
  },
  {
    question: "Can I visit Briksdal Glacier and Loen Skylift in one Olden day?",
    answer:
      "Only if your ship stays at least eight hours. Both experiences need road transport and several hours each, combining them on shorter port calls risks missing all aboard.",
  },
  {
    question: "Should I book Olden excursions before my cruise arrives?",
    answer:
      "Pre-booking is strongly recommended on peak summer days. Popular Briksdal Glacier and Loen Skylift tours sell out when several ships share the port.",
  },
  {
    question: "How much buffer time should I leave before all aboard?",
    answer:
      "Aim to be at the cruise pier 30 to 45 minutes before the published all-aboard time. Gangway queues can compress that window quickly.",
  },
] as const;

export default function OneDayInOldenPage() {
  return (
    <ContentPage
      title="One Day in Olden"
      lead="Practical sample itineraries for cruise passengers with 4, 6, or 8+ hours in Olden, focused on Briksdal Glacier, Olden Lake, Loen Skylift, and village time with realistic return-to-ship timing."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Start with your ship&apos;s Olden schedule</h2>
        <p>
          Every good Olden day begins with your cruise line&apos;s arrival,
          departure, and all-aboard times. Subtract at least 45 minutes from
          your last possible departure to set a hard deadline for being back at
          the pier. Confirm times on your ship&apos;s app the morning you
          arrive.
        </p>
      </section>

      <section>
        <h2>4-hour itinerary: village and harbour</h2>
        <p>
          With under four hours ashore, stay in Olden village. Take the{" "}
          <Link href="/excursions/olden-walking-tour">
            Olden Walking and Village Highlights
          </Link>{" "}
          tour or explore the harbour independently. Enjoy a coffee by the
          waterfront, browse local shops, and photograph the Olden mountain
          backdrop. Skip glacier and skylift tours, valley road time exceeds
          your margin.
        </p>
        <ul>
          <li>Disembark promptly and walk the harbour area</li>
          <li>90-minute guided village tour or self-guided loop</li>
          <li>Short photo stops at waterfront viewpoints</li>
          <li>Return to pier 30 minutes before all aboard</li>
        </ul>
      </section>

      <section>
        <h2>6-hour itinerary: Briksdal Glacier or scenic valley</h2>
        <p>
          Six hours unlocks the headline experiences. Choose the{" "}
          <Link href="/excursions/briksdal-glacier-olden-lake">
            Briksdal Glacier and Olden Lake Discovery
          </Link>{" "}
          for the definitive glacier day, or the{" "}
          <Link href="/excursions/lakes-glaciers-waterfalls">
            Scenic Lakes, Glaciers and Waterfalls Tour
          </Link>{" "}
          for broader valley scenery with photo stops.
        </p>
        <ul>
          <li>Disembark early and head straight to your excursion meeting point</li>
          <li>Morning: four-to-five-hour glacier or scenic valley tour</li>
          <li>Return with margin for a brief harbour stroll if time allows</li>
          <li>Be at the pier 45 minutes before departure</li>
        </ul>
      </section>

      <section>
        <h2>8+ hour itinerary: glacier, skylift, or private touring</h2>
        <p>
          Long port days open the full Olden experience. Options include the{" "}
          <Link href="/excursions/briksdal-glacier-olden-lake">
            Briksdal Glacier tour
          </Link>{" "}
          combined with village time, the{" "}
          <Link href="/excursions/loen-skylift-mount-hoven">
            Loen Skylift and Mount Hoven
          </Link>{" "}
          viewpoint excursion, or the{" "}
          <Link href="/excursions/private-briksdal-glacier-olden-lake">
            Private Briksdal Glacier
          </Link>{" "}
          for flexible pacing.
        </p>
        <ul>
          <li>Morning: Briksdal Glacier or Loen Skylift excursion</li>
          <li>Midday: Lunch in Olden village or at Hoven Restaurant</li>
          <li>Afternoon: Second excursion or extended valley touring if schedule allows</li>
          <li>Final hour free near the cruise pier for a calm return</li>
        </ul>
      </section>

      <section>
        <h2>Return to ship</h2>
        <p>
          Head back to the cruise pier at least 30 to 45 minutes before all aboard.
          Use the{" "}
          <Link href="/#planner">Cruise Smart Planner</Link> to validate your
          itinerary against your actual port window before you sail.
        </p>
      </section>
    </ContentPage>
  );
}
