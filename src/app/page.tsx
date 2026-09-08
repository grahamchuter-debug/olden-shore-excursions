import type { Metadata } from "next";
import Link from "next/link";

import { CruisePortDayPlanner } from "@/components/cruise-port-day-planner";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { TourCard } from "@/components/tour-card";
import {
  formatScheduleDate,
  oldenScheduleIntegrity,
} from "@/lib/olden-schedules";
import { oldenTourCards, oldenTourListItems } from "@/lib/olden-tours";
import { siteConfig } from "@/lib/site-config";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";
import {
  buildFaqSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";

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

const homeFaqs = [
  {
    question: "Is this site for cruise passengers calling at Olden?",
    answer:
      "Yes. This is an independent Olden cruise-port planning site. It helps you choose between the village, Briksdal Glacier and Loen, check published ship calls, and leave a return buffer. Confirm final timings with your cruise line.",
  },
  {
    question: "Should I go to Briksdal, Loen, or stay in Olden?",
    answer:
      "Stay in the village on a short call. Briksdal is the glacier-valley outing already described on this site. Loen Skylift is a different direction, toward Mount Hoven, and depends on operation that day. Pick one main outing unless both tickets are already confirmed.",
  },
  {
    question: "Can I do Briksdal and Loen because my ship stays all day?",
    answer:
      "Published hours ashore are not enough. Combining them needs confirmed tickets and a generous buffer. This site does not invent current Skylift or glacier-path operation.",
  },
  {
    question: "Can I book shore excursions on this site?",
    answer:
      "Selected Olden excursions can be requested online when checkout is unlocked. Payment takes your request — confirmation follows separately once we arrange the excursion with the local operator. Until then, email hello@oldenshoreexcursions.com.",
  },
] as const;

export default function Home() {
  const firstLabel = oldenScheduleIntegrity.firstDate
    ? formatScheduleDate(oldenScheduleIntegrity.firstDate)
    : "";
  const lastLabel = oldenScheduleIntegrity.lastDate
    ? formatScheduleDate(oldenScheduleIntegrity.lastDate)
    : "";
  const featured = oldenTourCards.slice(0, 3);
  const remaining = oldenTourCards.slice(3);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: pageMeta.path,
            title: pageMeta.title,
            description: pageMeta.description,
          }),
          buildItemListSchema(oldenTourListItems),
          buildFaqSchema(homeFaqs),
        ]}
      />
      <main>
        <PageHero
          image={siteImages.hero}
          imageAlt={imageAlts.hero}
          className="min-h-[28rem] md:min-h-[32rem]"
        >
          <p className="hero-eyebrow mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
            {siteConfig.name}
          </p>
          <h1 className="font-display mb-5 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Your ship is in Olden. Village, glacier valley, or Loen?
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            Three different days. Choose one main direction, then keep time to
            get back to the pier.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/excursions"
              className="btn-primary w-full justify-center sm:w-auto"
            >
              Explore Olden excursions
            </Link>
            <Link
              href="/ship-schedule"
              className="btn-secondary w-full justify-center sm:w-auto"
            >
              Check your ship schedule
            </Link>
          </div>
        </PageHero>

        <section className="border-b border-[var(--border-light)] bg-[var(--surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-eyebrow">Three Olden days</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Stay local, go to Briksdal, or head toward Loen
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              The inventory on this site already splits that way. No extra
              decision URL. Use the one-day guide for hours, not as proof that
              two valleys will combine.
            </p>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Stay in Olden
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Village streets, harbour and an easy walking tour when the
                  call is short.
                </p>
                <Link
                  href="/excursions/olden-walking-tour"
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
                >
                  Village walking tour
                </Link>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Briksdal valley
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Glacier and Olden Lake outings already on this site, including
                  a private option. Confirm the day’s operation with the
                  operator.
                </p>
                <Link
                  href="/excursions/briksdal-glacier-olden-lake"
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
                >
                  Briksdal Glacier tour
                </Link>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Loen and Hoven
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A different direction from the glacier valley. Skylift views
                  depend on weather and whether the attraction is running. This
                  site does not invent current operation.
                </p>
                <Link
                  href="/excursions/loen-skylift-mount-hoven"
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
                >
                  Loen Skylift notes
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border-light)] bg-surface-muted py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-eyebrow">Find your ship</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Check when your ship is in Olden
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {oldenScheduleIntegrity.total} published Olden calls from{" "}
              {firstLabel} to {lastLabel}. Arrival and departure times shape
              what is realistic ashore. Always confirm with your cruise line.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ship-schedule" className="btn-outline-dark">
                Open Olden ship schedule
              </Link>
              <Link
                href="/one-day-in-olden"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
              >
                Then plan your hours
              </Link>
            </div>
          </div>
        </section>

        <section id="tours" className="scroll-mt-24 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-eyebrow">Excursion options</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Experiences already on this site
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              No invented products or prices. Durations are approximate. Keep a
              return buffer. This site does not sell tickets.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((tour) => (
                <TourCard key={tour.href} {...tour} />
              ))}
            </div>
            {remaining.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {remaining.map((tour) => (
                  <TourCard key={tour.href} {...tour} />
                ))}
              </div>
            ) : null}
            <p className="mt-8">
              <Link
                href="/excursions"
                className="text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
              >
                Compare all Olden excursions
              </Link>
            </p>
          </div>
        </section>

        <section className="border-y border-[var(--border-light)] bg-[var(--surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-eyebrow">Briksdal and Loen</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Two valleys is a stretch, not a timetable result
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Existing one-day notes already treat stacking Briksdal and Loen as
              something that needs a long, confirmed day. Ship duration alone
              cannot prove it. Confirm each outing separately.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-eyebrow">First time in Olden</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Useful planning guides
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  href: "/olden-port-guide",
                  title: "Cruise port guide",
                  text: "Village layout from the pier toward valley and Loen outings.",
                },
                {
                  href: "/one-day-in-olden",
                  title: "One day in Olden",
                  text: "Sample shapes for short, classic and longer port calls.",
                },
                {
                  href: "/is-olden-worth-visiting",
                  title: "Is Olden worth visiting?",
                  text: "Honest context if you are deciding how to spend hours ashore.",
                },
                {
                  href: "/best-time-to-visit-olden",
                  title: "Best time to visit",
                  text: "Seasonal context for cruise months already published here.",
                },
              ].map((item) => (
                <li
                  key={item.href}
                  className="border-t border-[var(--border-light)] pt-5"
                >
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    <Link
                      href={item.href}
                      className="underline-offset-4 hover:underline"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="planner"
          className="scroll-mt-24 border-y border-[var(--border-light)] bg-surface-muted py-14 sm:py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-eyebrow">Port-day planning</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Think in hours, valleys and return buffer
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Use published times as a planning start. This planner helps you
              think through the day. It does not invent glacier or Skylift
              availability.
            </p>
            <div className="mt-8">
              <CruisePortDayPlanner />
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-eyebrow">Norway beyond Olden</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Planning other Norwegian ports?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              For multi-port itineraries, the national planning site covers the
              wider Norway cruise picture.
            </p>
            <a
              href={siteConfig.nationalAuthorityUrl}
              className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
            >
              Norway Shore Excursions
            </a>
          </div>
        </section>

        <section className="border-y border-[var(--border-light)] bg-[var(--surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Olden cruise questions
            </h2>
            <dl className="mt-8 space-y-6">
              {homeFaqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-slate-900">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-600">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-navy py-14 text-white sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Olden planning concierge
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              {siteConfig.contactEmailVerified
                ? `Questions about shaping an Olden port day? Email ${siteConfig.contactEmail}.`
                : "A destination email is being prepared. Until then, use the schedule, one-day guide and excursion pages on this site."}
            </p>
            <Link href="/contact" className="btn-primary mt-6">
              Contact
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
