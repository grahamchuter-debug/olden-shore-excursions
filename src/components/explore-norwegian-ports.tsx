import type { ReactNode } from "react";

import { imageAlts, siteImages } from "@/lib/site-images";

export type ExplorePortCard = {
  title: string;
  titleHref: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
};

export type ExploreNorwegianPortsConfig = {
  intro: ReactNode;
  cards: readonly ExplorePortCard[];
};

type ExploreNorwegianPortsProps = {
  config: ExploreNorwegianPortsConfig;
  variant?: "full" | "compact";
};

export function ExploreNorwegianPorts({
  config,
  variant = "full",
}: ExploreNorwegianPortsProps) {
  if (variant === "compact") {
    return (
      <section
        id="norwegian-cruise-ports"
        className="border-t bg-white"
        aria-labelledby="explore-norwegian-ports-heading"
      >
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
          <h2
            id="explore-norwegian-ports-heading"
            className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl"
          >
            Explore More Norwegian Cruise Ports
          </h2>

          <div className="text-base leading-7 text-slate-700 sm:leading-8">
            {config.intro}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="norwegian-cruise-ports"
      className="border-t bg-surface-muted"
      aria-labelledby="explore-norwegian-ports-heading"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2
          id="explore-norwegian-ports-heading"
          className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Explore More Norwegian Cruise Ports
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="text-base leading-8 text-slate-700 sm:text-lg lg:col-span-2">
            {config.intro}
          </div>

          {config.cards.map((card) => (
            <article
              key={card.titleHref}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-44">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div
                  className="accent-bar-blue absolute bottom-0 left-0 h-1 w-full"
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="mb-2 text-lg font-semibold leading-snug text-slate-900">
                  <a
                    href={card.titleHref}
                    className="text-slate-900 underline-offset-2 transition hover:text-[var(--norway-blue)] hover:underline"
                  >
                    {card.title}
                  </a>
                </h3>

                <p className="mb-5 flex-1 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>

                <a href={card.ctaHref} className="btn-primary-on-light w-fit">
                  {card.ctaLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export const explorePortsFromOlden: ExploreNorwegianPortsConfig = {
  intro: (
    <>
      If your itinerary includes more than one Norwegian port, plan each call
      around your ship&apos;s timetable before you sail. Many Nordfjord cruises
      pair Olden with{" "}
      <a
        href="https://flamshoreexcursions.com"
        className="font-medium text-[var(--norway-blue)] underline-offset-2 hover:underline"
      >
        Flam Shore Excursions
      </a>
      ,{" "}
      <a
        href="https://bergenshoreexcursions.com"
        className="font-medium text-[var(--norway-blue)] underline-offset-2 hover:underline"
      >
        Bergen Shore Excursions
      </a>
      ,{" "}
      <a
        href="https://stavangershoreexcursions.com"
        className="font-medium text-[var(--norway-blue)] underline-offset-2 hover:underline"
      >
        Stavanger Shore Excursions
      </a>
      ,{" "}
      <a
        href="https://alesundshoreexcursions.com"
        className="font-medium text-[var(--norway-blue)] underline-offset-2 hover:underline"
      >
        Alesund Shore Excursions
      </a>
      , and{" "}
      <a
        href="https://geirangershoreexcursions.com"
        className="font-medium text-[var(--norway-blue)] underline-offset-2 hover:underline"
      >
        Geiranger Shore Excursions
      </a>{" "}
     , each with port guides, tour comparisons, and Cruise Smart Planners built
      for passengers on the same sailing.
    </>
  ),
  cards: [
    {
      title: "Flam Shore Excursions",
      titleHref: "https://flamshoreexcursions.com",
      description:
        "Explore Flam shore excursions, fjord cruises, railway tours, and cruise port planning guides.",
      ctaLabel: "Visit Flam Shore Excursions",
      ctaHref: "https://flamshoreexcursions.com",
      image: siteImages.flamPortCard,
      imageAlt: imageAlts.flamPortCard,
    },
    {
      title: "Bergen Shore Excursions",
      titleHref: "https://bergenshoreexcursions.com",
      description:
        "Compare Bergen fjord cruises, Bryggen walking tours, port guides, and return-to-ship planning tools.",
      ctaLabel: "Visit Bergen Shore Excursions",
      ctaHref: "https://bergenshoreexcursions.com",
      image: siteImages.bergenPortCard,
      imageAlt: imageAlts.bergenPortCard,
    },
    {
      title: "Stavanger Shore Excursions",
      titleHref: "https://stavangershoreexcursions.com",
      description:
        "Compare Stavanger Lysefjord cruises, walking tours, port guides, and return-to-ship planning tools.",
      ctaLabel: "Visit Stavanger Shore Excursions",
      ctaHref: "https://stavangershoreexcursions.com",
      image: siteImages.stavangerPortCard,
      imageAlt: imageAlts.stavangerPortCard,
    },
    {
      title: "Alesund Shore Excursions",
      titleHref: "https://alesundshoreexcursions.com",
      description:
        "Compare Alesund Art Nouveau tours, Mount Aksla viewpoints, port guides, and cruise planning tools.",
      ctaLabel: "Visit Alesund Shore Excursions",
      ctaHref: "https://alesundshoreexcursions.com",
      image: siteImages.alesundPortCard,
      imageAlt: imageAlts.alesundPortCard,
    },
    {
      title: "Geiranger Shore Excursions",
      titleHref: "https://geirangershoreexcursions.com",
      description:
        "Compare Geiranger fjord sightseeing, mountain viewpoints, port guides, and cruise planning tools.",
      ctaLabel: "Visit Geiranger Shore Excursions",
      ctaHref: "https://geirangershoreexcursions.com",
      image: siteImages.geirangerPortCard,
      imageAlt: imageAlts.geirangerPortCard,
    },
  ],
};
