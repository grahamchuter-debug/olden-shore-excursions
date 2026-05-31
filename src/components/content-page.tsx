import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/lib/site-config";
import { buildFaqSchema, buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/site-schema";

export type PageFaq = {
  question: string;
  answer: string;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type RelatedLink = {
  label: string;
  href: string;
};

type ContentPageProps = {
  title: string;
  lead: string;
  heroImage: string;
  heroImageAlt: string;
  pagePath: string;
  pageDescription: string;
  children: React.ReactNode;
  relatedLinks?: readonly RelatedLink[];
  faqs?: readonly PageFaq[];
  breadcrumbs?: readonly BreadcrumbItem[];
  belowHero?: React.ReactNode;
  ctaTitle?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaButtonLabel?: string;
  showShipReassurance?: boolean;
  relatedSectionTitle?: string;
};

export function ContentPage({
  title,
  lead,
  heroImage,
  heroImageAlt,
  pagePath,
  pageDescription,
  children,
  relatedLinks,
  faqs,
  breadcrumbs,
  belowHero,
  ctaTitle = "Plan your Olden shore excursion",
  ctaText = "Browse cruise-friendly tours designed around your ship's time in port, with enough margin to return before all aboard.",
  ctaHref = siteConfig.shoreExcursionsPath,
  ctaButtonLabel = "View Olden shore excursions",
  showShipReassurance = true,
  relatedSectionTitle = "Related Olden guides",
}: ContentPageProps) {
  const schema = [
    buildWebPageSchema({
      path: pagePath,
      title,
      description: pageDescription,
    }),
    ...(breadcrumbs && breadcrumbs.length > 0
      ? [buildBreadcrumbSchema(breadcrumbs, pagePath)]
      : []),
    ...(faqs && faqs.length > 0 ? [buildFaqSchema(faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <main className="min-h-screen bg-white text-slate-900">
        <PageHero image={heroImage} imageAlt={heroImageAlt}>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
            {lead}
          </p>
          {showShipReassurance ? (
            <p className="badge-accent-red mt-5 inline-flex rounded-full px-4 py-1.5 text-xs font-medium text-white/95 backdrop-blur-sm sm:text-sm">
              Return to ship on time, cruise passenger friendly
            </p>
          ) : null}
        </PageHero>

        {belowHero}

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-10 text-slate-700 [&_a]:content-link [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:leading-7 [&_p]:leading-7 [&_section]:space-y-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {children}
          </div>
        </article>

        <section className="border-y bg-navy text-white">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14">
            <h2 className="text-2xl font-bold sm:text-3xl">{ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              {ctaText}
            </p>
            <Link href={ctaHref} className="btn-primary mt-6 sm:px-8 sm:py-3.5 sm:text-base">
              {ctaButtonLabel}
            </Link>
          </div>
        </section>

        {faqs && faqs.length > 0 ? (
          <section className="border-b bg-surface-muted">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Frequently asked questions
              </h2>
              <dl className="space-y-6">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <dt className="font-semibold text-slate-900">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 leading-7 text-slate-700">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {relatedLinks && relatedLinks.length > 0 ? (
          <section className="bg-surface-muted">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                {relatedSectionTitle}
              </h2>
              <ul className="flex flex-wrap gap-3">
                {relatedLinks.map((link) => (
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
