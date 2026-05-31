import type { Metadata } from "next";
import Link from "next/link";

import { CruisePortDayPlanner } from "@/components/cruise-port-day-planner";
import {
  ExploreNorwegianPorts,
  explorePortsFromOlden,
} from "@/components/explore-norwegian-ports";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { TourCard } from "@/components/tour-card";
import { oldenTourCards, oldenTourListItems } from "@/lib/olden-tours";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildFaqSchema, buildItemListSchema, buildWebPageSchema } from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";
import { siteConfig } from "@/lib/site-config";

const pageMeta = {
  title:
    "Olden Shore Excursions | Glacier Tours & Cruise Port Guides for Passengers",
  description:
    "Plan your Olden cruise port day with Briksdal Glacier tours, Olden Lake scenery, Loen Skylift viewpoints, port guides, and return-to-ship friendly shore excursion advice.",
  path: "/",
} as const;

export const metadata: Metadata = buildPageMetadata({
  ...pageMeta,
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
  absoluteTitle: true,
});

const trustBadges = [
  { label: "Return to ship on time", accent: true },
  { label: "Glacier valley scenery", accent: false },
  { label: "Cruise passenger friendly", accent: false },
] as const;

const popularTours = oldenTourListItems;

const homeFaqs = [
  {
    question: "Is Olden worth visiting from a cruise ship?",
    answer:
      "Yes, Olden is one of Norway's most scenic cruise ports, with Briksdal Glacier, glacial lakes, waterfalls, and dramatic valley scenery. Most passengers find it a highlight of their Nordfjord itinerary.",
  },
  {
    question: "How long should I spend in Olden?",
    answer:
      "Four hours allows a village walk or short viewpoint tour. Six to eight hours unlocks Briksdal Glacier and Loen Skylift. Eight or more hours enables private glacier touring and full valley combinations.",
  },
  {
    question: "Can I visit Briksdal Glacier from Olden cruise port?",
    answer:
      "Yes. Briksdal Glacier is the headline shore excursion from Olden, reached by a scenic drive through Oldedalen valley. Most tours include glacier viewpoints, lake scenery, and waterfalls with cruise-friendly timings.",
  },
  {
    question: "What is the best Olden shore excursion?",
    answer:
      "The Briksdal Glacier and Olden Lake Discovery tour is the headline choice for first-time visitors with four or more hours ashore. For shorter calls, the Olden Walking and Village Highlights tour fits comfortably.",
  },
  {
    question: "Is Olden walkable from the cruise port?",
    answer:
      "Yes. Olden village is compact and most ships dock at the cruise pier near the harbour. Shops, cafés, and excursion meeting points are within minutes on foot.",
  },
] as const;

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: pageMeta.path,
            title: pageMeta.title,
            description: pageMeta.description,
          }),
          buildItemListSchema(popularTours),
          buildFaqSchema(homeFaqs),
        ]}
      />
      <main className="min-h-screen bg-white text-slate-900">
        <PageHero
          image={siteImages.hero}
          imageAlt={imageAlts.hero}
          centered
          compact
          overlay="light"
          className="min-h-[25rem] md:min-h-[31rem] lg:min-h-[34rem]"
        >
          <h1 className="mb-3 text-2xl font-bold text-white sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl">
            Olden Shore Excursions
          </h1>

          <p className="mx-auto mb-5 max-w-3xl text-sm text-white/95 sm:mb-7 sm:text-lg md:text-xl">
            Discover Briksdal Glacier, Olden Lake, Loen viewpoints and
            Norway&apos;s dramatic glacier valleys with cruise-friendly shore
            excursions designed around your time in port.
          </p>

          <a href="#tours" className="btn-primary px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base">
            View Excursions
          </a>

          <ul className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            {trustBadges.map((badge) => (
              <li
                key={badge.label}
                className={`rounded-full px-3 py-1.5 text-xs font-medium text-white/95 backdrop-blur-sm sm:px-4 sm:text-sm ${
                  badge.accent
                    ? "badge-accent-red"
                    : "border border-white/25 bg-white/10"
                }`}
              >
                {badge.label}
              </li>
            ))}
          </ul>
        </PageHero>

        <section id="tours" className="border-t bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="mb-2 text-3xl font-bold sm:mb-3 sm:text-4xl">
              Popular Olden Tours
            </h2>
            <p className="mb-4 max-w-2xl text-slate-600">
              Cruise-friendly excursions that depart near Olden village and fit
              typical port-day schedules.
            </p>
            <p className="mb-8 max-w-2xl rounded-lg border border-slate-200 border-l-[3px] border-l-[var(--norway-red)] bg-white px-4 py-3 text-sm leading-6 text-slate-700">
              Every excursion featured is selected to fit comfortably within a
              typical Olden cruise port call.
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {oldenTourCards.map((tour) => (
                <TourCard
                  key={tour.href}
                  href={tour.href}
                  image={tour.image}
                  imageAlt={tour.imageAlt}
                  title={tour.title}
                  description={tour.description}
                  badge={tour.badge}
                />
              ))}
            </div>
            <p className="mt-8">
              <Link
                href="/excursions"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-[var(--norway-blue)] hover:text-[var(--norway-blue)]"
              >
                View all Olden excursions
              </Link>
            </p>
          </div>
        </section>

        <section id="why-olden" className="border-t bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Why Olden Is Ideal for Cruise Shore Excursions
            </h2>
            <p className="text-base leading-8 text-slate-700 sm:text-lg">
              Olden sits at the head of Nordfjord beneath Jostedalsbreen , 
              Europe&apos;s largest mainland glacier. Cruise passengers arrive
              directly at a compact village pier, then reach Briksdal Glacier,
              glacial lakes, and Loen Skylift on shore excursions timed for
              return-to-ship schedules.
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-8 text-slate-700">
              <li>Briksdal Glacier, one of Norway&apos;s most accessible glacier arms</li>
              <li>Olden Lake and Oldedalen valley with waterfalls and pine forests</li>
              <li>Loen Skylift to Mount Hoven for dramatic fjord panoramas</li>
              <li>Compact village with easy shore access from the cruise pier</li>
              <li>Cruise-friendly excursion meeting points minutes from the harbour</li>
              <li>Match excursions to your actual hours ashore with our Cruise Smart Planner</li>
            </ul>
          </div>
        </section>

        <section id="planner" className="border-t bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <CruisePortDayPlanner />
          </div>
        </section>

        <ExploreNorwegianPorts
          config={explorePortsFromOlden}
          variant="compact"
        />

        <section id="faqs" className="border-t bg-surface-muted">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
              Olden cruise passenger FAQs
            </h2>
            <dl className="space-y-6">
              {homeFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-slate-200 border-l-[3px] border-l-[var(--norway-blue)] bg-white p-5 shadow-sm"
                >
                  <dt className="font-semibold text-slate-900">{faq.question}</dt>
                  <dd className="mt-2 leading-7 text-slate-700">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t bg-navy text-white">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Plan your Olden port day with confidence
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Browse shore excursions, read the port guide, and use the Cruise
              Smart Planner, everything built for cruise passengers who need
              to return on time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={siteConfig.shoreExcursionsPath} className="btn-primary sm:text-base">
                Book a Tour
              </Link>
              <Link href="/olden-port-guide" className="btn-secondary sm:text-base">
                Olden Port Guide
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
