import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { TourCard } from "@/components/tour-card";
import { oldenTourCards, oldenTourListItems } from "@/lib/olden-tours";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Olden Excursions — All Shore Tours for Cruise Passengers",
  description:
    "Browse all Olden shore excursions for cruise passengers: Briksdal Glacier, private glacier tours, Loen Skylift, walking tours, and scenic lakes and waterfalls experiences.",
  path: "/excursions",
  ogImage: siteImages.briksdalGlacier,
  ogImageAlt: imageAlts.briksdalGlacier,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Excursions" },
] as const;

const relatedLinks = [
  { label: "Olden port guide", href: "/olden-port-guide" },
  { label: "One day in Olden", href: "/one-day-in-olden" },
  { label: "Is Olden worth visiting?", href: "/is-olden-worth-visiting" },
] as const;

const faqs = [
  {
    question: "What is the best Olden excursion for first-time cruise visitors?",
    answer:
      "The Briksdal Glacier and Olden Lake Discovery tour is the headline choice when you have four or more hours in port. For shorter calls, the Olden Walking and Village Highlights tour covers the village in around 90 minutes to two hours.",
  },
  {
    question: "How do I choose between Olden shore excursions?",
    answer:
      "Match the tour to your hours ashore: walking tours suit under-four-hour calls; Briksdal and scenic lakes tours suit 4–6 hours; Briksdal or Loen Skylift suit 6–8 hours; private glacier and full valley combinations need 8+ hours. Use the Cruise Smart Planner on the homepage.",
  },
  {
    question: "Do all Olden excursions depart near the cruise port?",
    answer:
      "Yes. Featured tours meet in Olden village centre near the cruise pier — typically within a few minutes of where you come ashore.",
  },
] as const;

export default function ExcursionsIndexPage() {
  return (
    <>
      <JsonLd data={[buildItemListSchema(oldenTourListItems)]} />
      <ContentPage
        title="Olden Excursions"
        lead="Every cruise-friendly shore excursion in Olden — Briksdal Glacier, Loen Skylift, village walks, and scenic valley touring — with return-to-ship timing in mind."
        heroImage={pageMeta.ogImage}
        heroImageAlt={pageMeta.ogImageAlt}
        pagePath={pageMeta.path}
        pageDescription={pageMeta.description}
        breadcrumbs={breadcrumbs}
        relatedLinks={relatedLinks}
        faqs={faqs}
        ctaTitle="Need help choosing an Olden tour?"
        ctaText="Use the Cruise Smart Planner on the homepage to match tours to your ship's timetable."
        ctaHref="/#planner"
        ctaButtonLabel="Open Cruise Smart Planner"
        belowHero={
          <section className="border-b bg-surface-muted">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
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
            </div>
          </section>
        }
      >
        <section>
          <h2>Compare Olden shore excursions</h2>
          <p>
            Each tour below is designed for cruise passengers calling at Olden.
            Briksdal Glacier and Loen Skylift need the longest port windows;
            walking tours fit shorter schedules. Private glacier tours suit
            full-day port calls.
          </p>
          <p>
            For port-day planning tools and tier-based recommendations, use the{" "}
            <Link href="/#planner">Cruise Smart Planner</Link> on the homepage.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
