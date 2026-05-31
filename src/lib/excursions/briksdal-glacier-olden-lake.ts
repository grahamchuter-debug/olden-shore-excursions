import type { ExcursionData } from "@/lib/excursion-types";
import { imageAlts, siteImages } from "@/lib/site-images";

export const briksdalGlacierOldenLakeExcursion: ExcursionData = {
  slug: "briksdal-glacier-olden-lake",
  path: "/excursions/briksdal-glacier-olden-lake",
  title: "Briksdal Glacier and Olden Lake Discovery",
  headline: "Briksdal Glacier and Olden Lake Discovery for Cruise Passengers",
  lead: "The headline Olden shore excursion, a guided journey to Briksdal Glacier, Olden Lake valley scenery, waterfalls, and a scenic drive from the cruise port with timings designed for your ship's schedule.",
  metaTitle: "Briksdal Glacier and Olden Lake Discovery for Cruise Passengers",
  metaDescription:
    "Headline Olden shore excursion to Briksdal Glacier, Olden Lake, waterfalls, and valley scenery. Cruise-friendly timing for first-time visitors.",
  heroImage: siteImages.briksdalTour,
  heroImageAlt: imageAlts.briksdalTourCard,
  heroBadge: "Headline Olden shore excursion",
  summary: {
    duration: "Approx. 4 to 5 hours",
    meetingPoint: "Olden village centre near cruise pier",
    returnReassurance:
      "Coach timings designed for typical cruise port schedules",
    bestFor:
      "First-time visitors who want the definitive Briksdal Glacier and Olden Lake experience",
  },
  snapshotCards: [
    { label: "Highlights", value: "Briksdal Glacier, Olden Lake, waterfalls" },
    { label: "Fitness level", value: "Easy to moderate, short walks at glacier" },
    { label: "Port call fit", value: "Ideal for 4 to 8 hour visits" },
    { label: "Scenery", value: "Glacier valley and lake landscapes" },
  ],
  gallery: [
    { src: siteImages.briksdalGlacier, alt: imageAlts.briksdalGlacier },
    { src: siteImages.briksdalWaterfall, alt: imageAlts.briksdalWaterfall },
    { src: siteImages.oldenLake, alt: imageAlts.oldenLake },
    { src: siteImages.harbour, alt: imageAlts.harbour },
  ],
  highlights: [
    "Briksdal Glacier, accessible arm of Jostedalsbreen",
    "Olden Lake and Oldedalen valley scenery",
    "Waterfalls along the scenic drive from Olden",
    "Photo stops at glacier viewpoints",
    "Cruise-friendly departure and return timings",
    "Expert commentary on glacier geology and local history",
  ],
  description: [
    "Briksdalsbreen is one of the most accessible glacier arms in Norway, and the reason most cruise passengers choose to go ashore in Olden. This discovery tour combines the glacier terminus, glacial lake scenery, and the dramatic Oldedalen valley in one carefully timed shore excursion.",
    "The scenic drive from Olden pier follows the valley south through pine forests and past waterfalls before reaching Briksdal. At the glacier, short walks lead to viewpoints where you can see the ice, the lake, and the surrounding peaks that define this Nordfjord landscape.",
    "Designed for cruise passengers, the tour accounts for typical port windows and return-to-ship requirements. You spend your hours ashore on glacier and valley scenery rather than in unnecessary transfers, making this the signature choice when you have four or more hours in Olden.",
  ],
  included: [
    "Guided Briksdal Glacier and Olden Lake tour",
    "Scenic drive through Oldedalen valley",
    "Commentary on glacier, valley, and local history",
    "Route paced for typical cruise port timings",
  ],
  notIncluded: [
    "Food, drinks, and personal purchases",
    "Optional gratuities",
    "Independent time beyond the tour schedule",
  ],
  timingAdvice: [
    "Best suited to port calls of four hours or more.",
    "Disembark promptly, Briksdal tours fill on multi-ship days.",
    "Keep 30 to 45 minutes before all aboard to reach the cruise pier.",
    "Weather can affect visibility at the glacier, pack a waterproof layer.",
  ],
  faqs: [
    {
      question: "How far is Briksdal Glacier from Olden cruise port?",
      answer:
        "Briksdal Glacier is approximately 25 km south of Olden village, reached by a scenic drive through Oldedalen valley. The journey is included in the tour duration.",
    },
    {
      question: "Is this the best Olden shore excursion for first-time visitors?",
      answer:
        "Yes. This is the headline choice for passengers who want the definitive glacier and valley experience that defines Olden as a cruise destination.",
    },
    {
      question: "How long is the Briksdal Glacier tour?",
      answer:
        "Most departures run approximately four to five hours, leaving margin for village time on longer port days.",
    },
    {
      question: "Does the tour account for cruise pier departures?",
      answer:
        "Yes. Operators schedule around typical cruise arrival patterns. Confirm your meeting point on your voucher the night before.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Excursions", href: "/excursions" },
    { label: "Briksdal Glacier and Olden Lake Discovery" },
  ],
  relatedLinks: [
    { label: "Private Briksdal Glacier", href: "/excursions/private-briksdal-glacier-olden-lake" },
    { label: "Loen Skylift & Mount Hoven", href: "/excursions/loen-skylift-mount-hoven" },
    { label: "One day in Olden", href: "/one-day-in-olden" },
  ],
  bookingHref: "/excursions",
  bookingLabel: "Book this excursion",
  ctaTitle: "Ready to book your Briksdal Glacier and Olden Lake tour?",
  ctaText:
    "Experience Briksdal Glacier, Olden Lake valley scenery, and dramatic Nordfjord landscapes.",
};
