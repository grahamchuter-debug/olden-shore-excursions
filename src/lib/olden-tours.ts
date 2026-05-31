import { imageAlts, siteImages } from "@/lib/site-images";

export type OldenTourCard = {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  badge: string;
};

export const oldenTourCards: readonly OldenTourCard[] = [
  {
    href: "/excursions/briksdal-glacier-olden-lake",
    image: siteImages.briksdalTour,
    imageAlt: imageAlts.briksdalTourCard,
    title: "Briksdal Glacier and Olden Lake Discovery",
    description:
      "Headline Olden shore excursion to Briksdal Glacier, Olden Lake valley scenery, waterfalls, and a scenic drive from the cruise port, best for first-time visitors.",
    badge: "Headline Tour",
  },
  {
    href: "/excursions/private-briksdal-glacier-olden-lake",
    image: siteImages.privateBriksdalTour,
    imageAlt: imageAlts.privateBriksdalTourCard,
    title: "Private Briksdal Glacier and Olden Lake Discovery",
    description:
      "Premium private sightseeing with flexible pace, glacier viewpoints, and Olden Lake scenery, ideal for families, couples, and small groups.",
    badge: "Private Option",
  },
  {
    href: "/excursions/loen-skylift-mount-hoven",
    image: siteImages.loenSkyliftTour,
    imageAlt: imageAlts.loenSkyliftTourCard,
    title: "Loen Skylift and Mount Hoven Viewpoint",
    description:
      "Dramatic fjord and mountain views from Mount Hoven via Loen Skylift, a photography-focused tour with weather-dependent visibility.",
    badge: "Best Viewpoint",
  },
  {
    href: "/excursions/olden-walking-tour",
    image: siteImages.walkingTour,
    imageAlt: imageAlts.walkingTourCard,
    title: "Olden Walking and Village Highlights",
    description:
      "Easy walking tour through Olden village, harbour area, local history, and scenic viewpoints, the short-port option.",
    badge: "Cruise Friendly",
  },
  {
    href: "/excursions/lakes-glaciers-waterfalls",
    image: siteImages.lakesGlaciersTour,
    imageAlt: imageAlts.lakesGlaciersTourCard,
    title: "Scenic Lakes, Glaciers and Waterfalls Tour",
    description:
      "Nature-focused countryside tour with glacial lakes, waterfalls, valley scenery, and photo stops on a scenic cruise excursion.",
    badge: "Scenic Countryside",
  },
] as const;

export const oldenTourListItems = oldenTourCards.map((tour) => ({
  name: tour.title,
  description: tour.description,
}));
