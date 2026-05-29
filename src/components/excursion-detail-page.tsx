import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ShipScheduleBreadcrumbs } from "@/components/ship-schedule-breadcrumbs";
import type { ExcursionData } from "@/lib/excursion-types";
import { siteConfig } from "@/lib/site-config";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";

type ExcursionDetailPageProps = {
  excursion: ExcursionData;
};

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function SnapshotCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 border-t-2 border-t-[var(--norway-blue)] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-slate-900">{value}</p>
    </div>
  );
}

export function ExcursionDetailPage({ excursion }: ExcursionDetailPageProps) {
  const schema = [
    buildWebPageSchema({
      path: excursion.path,
      title: `${excursion.metaTitle} | ${siteConfig.name}`,
      description: excursion.metaDescription,
    }),
    buildBreadcrumbSchema(excursion.breadcrumbs, excursion.path),
    buildFaqSchema(excursion.faqs),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <main className="min-h-screen bg-white text-slate-900">
        <ShipScheduleBreadcrumbs items={excursion.breadcrumbs} />

        <PageHero image={excursion.heroImage} imageAlt={excursion.heroImageAlt}>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {excursion.headline}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
            {excursion.lead}
          </p>
          {excursion.heroBadge ? (
            <p className="badge-hero-red mt-5 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm sm:text-sm">
              {excursion.heroBadge}
            </p>
          ) : null}
          <p
            className={`${excursion.heroBadge ? "mt-3" : "mt-5"} badge-accent-red inline-flex rounded-full px-4 py-1.5 text-xs font-medium text-white/95 backdrop-blur-sm sm:text-sm`}
          >
            Return to ship on time — cruise passenger friendly
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={excursion.bookingHref ?? siteConfig.shoreExcursionsPath}
              className="btn-primary sm:text-base"
            >
              {excursion.bookingLabel ?? "Book this excursion"}
            </Link>
            <Link
              href={siteConfig.shoreExcursionsPath}
              className="btn-secondary sm:text-base"
            >
              View all excursions
            </Link>
          </div>
        </PageHero>

        <section className="border-b bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SnapshotCard label="Duration" value={excursion.summary.duration} />
              <SnapshotCard
                label="Meeting point"
                value={excursion.summary.meetingPoint}
              />
              <SnapshotCard
                label="Return to ship"
                value={excursion.summary.returnReassurance}
              />
              <SnapshotCard label="Best for" value={excursion.summary.bestFor} />
            </div>
            {excursion.snapshotCards && excursion.snapshotCards.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {excursion.snapshotCards.map((card) => (
                  <SnapshotCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Photo gallery</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {excursion.gallery.map((image) => (
              <figure
                key={`${image.src}-${image.alt}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </section>

        <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-14 text-slate-700 sm:space-y-16">
            <ContentSection title="Highlights">
              <ul className="list-disc space-y-2 pl-5 leading-7">
                {excursion.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </ContentSection>

            <ContentSection title="About this tour">
              <div className="space-y-4 leading-7">
                {excursion.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </ContentSection>

            {excursion.durationOptions &&
            excursion.durationOptions.length > 0 ? (
              <ContentSection title="Tour duration options">
                <div className="space-y-8">
                  {excursion.durationOptions.map((option) => (
                    <div
                      key={option.title}
                      className="rounded-xl border border-slate-200 bg-surface-muted p-5 sm:p-6"
                    >
                      <h3 className="text-lg font-semibold text-slate-900">
                        {option.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {option.duration} · Starting at {option.startingPoint}
                      </p>
                      <p className="mt-4 text-sm font-semibold text-gray-800">
                        Stops
                      </p>
                      <ol className="mt-2 list-decimal space-y-1.5 pl-5 leading-7">
                        {option.stops.map((stop) => (
                          <li key={stop}>{stop}</li>
                        ))}
                      </ol>
                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        <strong>Tour ends:</strong> {option.tourEnd}
                      </p>
                    </div>
                  ))}
                </div>
              </ContentSection>
            ) : null}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <ContentSection title="What's included">
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {excursion.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentSection>

              <ContentSection title="What's not included">
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {excursion.notIncluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentSection>
            </div>

            <ContentSection title="Cruise passenger timing advice">
              <div className="space-y-4 leading-7">
                {excursion.timingAdvice.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="leading-7">
                Read the{" "}
                <Link href="/olden-port-guide" className="content-link">
                  Olden port guide
                </Link>
                , plan your day with our{" "}
                <Link href="/one-day-in-olden" className="content-link">
                  one day in Olden
                </Link>{" "}
                itinerary, and use the{" "}
                <Link href="/#planner" className="content-link">
                  Cruise Smart Planner
                </Link>{" "}
                to match tours to your hours ashore.
              </p>
            </ContentSection>
          </div>
        </article>

        <section className="border-t bg-surface-muted">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {excursion.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <dt className="font-semibold text-slate-900">{faq.question}</dt>
                  <dd className="mt-2 leading-7 text-slate-700">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-y bg-navy text-white">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {excursion.ctaTitle ?? `Ready to book your ${excursion.title}?`}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              {excursion.ctaText ??
                "Secure your place before port day and explore more cruise-friendly excursions designed around your ship's timetable."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={excursion.bookingHref ?? siteConfig.shoreExcursionsPath}
                className="btn-primary sm:px-8 sm:py-3.5 sm:text-base"
              >
                {excursion.bookingLabel ?? "Book this excursion"}
              </Link>
              <Link
                href={siteConfig.shoreExcursionsPath}
                className="btn-secondary sm:px-8 sm:py-3.5 sm:text-base"
              >
                View all shore excursions
              </Link>
            </div>
          </div>
        </section>

        {excursion.relatedLinks.length > 0 ? (
          <section className="bg-surface-muted">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Plan your Olden port day
              </h2>
              <ul className="flex flex-wrap gap-3">
                {excursion.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-[var(--norway-blue)] hover:text-[var(--norway-blue)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
