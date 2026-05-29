import type { ExcursionData } from "@/lib/excursion-types";
import { imageAlts, siteImages } from "@/lib/site-images";

export const loenSkyliftMountHovenExcursion: ExcursionData = {
  slug: "loen-skylift-mount-hoven",
  path: "/excursions/loen-skylift-mount-hoven",
  title: "Loen Skylift and Mount Hoven Viewpoint",
  headline: "Loen Skylift and Mount Hoven Viewpoint for Cruise Passengers",
  lead: "Ride one of the world's steepest cable cars to Mount Hoven for dramatic fjord and mountain panoramas — a photography-focused shore excursion with weather-dependent visibility.",
  metaTitle: "Loen Skylift and Mount Hoven Viewpoint for Cruise Passengers",
  metaDescription:
    "Loen Skylift and Mount Hoven viewpoint tour from Olden cruise port. Fjord panoramas, dramatic views, and return-to-ship friendly timings for cruise passengers.",
  heroImage: siteImages.loenSkyliftTour,
  heroImageAlt: imageAlts.loenSkyliftTourCard,
  heroBadge: "Best viewpoint tour",
  summary: {
    duration: "Approx. 4–5 hours",
    meetingPoint: "Olden village or Loen Skylift base (tour dependent)",
    returnReassurance:
      "Coordinated transport and skylift timings for cruise schedules",
    bestFor:
      "Cruise passengers wanting dramatic fjord views and photography opportunities",
  },
  snapshotCards: [
    { label: "Elevation gain", value: "1,011 m to Mount Hoven summit" },
    { label: "Skylift ride", value: "Approx. 5 minutes each way" },
    { label: "Port call fit", value: "Ideal for 6–8 hour visits" },
    { label: "Visibility", value: "Weather-dependent — best on clear days" },
  ],
  gallery: [
    { src: siteImages.loenSkylift, alt: imageAlts.loenSkylift },
    { src: siteImages.mountHoven, alt: imageAlts.mountHoven },
    { src: siteImages.oldenLake, alt: imageAlts.oldenLake },
    { src: siteImages.harbour, alt: imageAlts.harbour },
  ],
  highlights: [
    "Loen Skylift — one of the steepest cable cars in the world",
    "Mount Hoven summit with Nordfjord panoramas",
    "Fjord and mountain views from viewing platforms",
    "Optional time at Hoven Restaurant (own expense)",
    "Cruise-friendly transport from Olden cruise port",
    "Ideal for photography on clear days",
  ],
  description: [
    "Loen Skylift lifts you more than 1,000 metres from the fjord to Mount Hoven in approximately five minutes — one of the steepest aerial tramways in the world. At the summit, viewing platforms and the Hoven Restaurant offer sweeping panoramas over Nordfjord, glaciers, and surrounding peaks.",
    "This tour suits cruise passengers who want a dramatic viewpoint experience without the long drive to Briksdal. Visibility is weather-dependent: clear days deliver exceptional photography; cloud and mist can limit distant views but still create atmospheric mountain scenery.",
    "Most shore excursions include transport between Olden and Loen, skylift tickets, and coordinated return timing. Allow enough port hours for the drive, skylift ride, and summit time before heading back to the cruise pier.",
  ],
  included: [
    "Transport between Olden and Loen Skylift (tour dependent)",
    "Loen Skylift return ticket",
    "Guided orientation at Mount Hoven viewpoints",
    "Schedule paced for typical cruise port timings",
  ],
  notIncluded: [
    "Food and drinks at Hoven Restaurant",
    "Optional gratuities",
    "Extended hiking beyond the summit platforms",
  ],
  timingAdvice: [
    "Best suited to port calls of six hours or more.",
    "Check weather forecasts — clear days offer the best fjord views.",
    "Skylift queues can form on busy days; pre-booked tours often skip ticket lines.",
    "Keep 45 minutes before all aboard for the return drive to Olden pier.",
  ],
  faqs: [
    {
      question: "How far is Loen Skylift from Olden cruise port?",
      answer:
        "Loen is approximately 15 km from Olden village, reached by road in around 20–25 minutes. Most tours include transport from the cruise pier.",
    },
    {
      question: "What if the weather is poor on port day?",
      answer:
        "Cloud and rain can limit visibility from Mount Hoven. Operators may adjust itineraries or offer alternatives — always confirm policy when booking.",
    },
    {
      question: "Is Loen Skylift suitable for passengers with limited mobility?",
      answer:
        "The skylift cabin and summit platforms are generally accessible, but confirm specific requirements with the operator before booking.",
    },
    {
      question: "Can I combine Loen Skylift with Briksdal Glacier?",
      answer:
        "Combining both requires a long port day of eight hours or more. The Cruise Smart Planner on the homepage helps assess whether your schedule allows both.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Excursions", href: "/excursions" },
    { label: "Loen Skylift and Mount Hoven Viewpoint" },
  ],
  relatedLinks: [
    { label: "Briksdal Glacier tour", href: "/excursions/briksdal-glacier-olden-lake" },
    { label: "Scenic lakes tour", href: "/excursions/lakes-glaciers-waterfalls" },
    { label: "One day in Olden", href: "/one-day-in-olden" },
  ],
  bookingHref: "/excursions",
  bookingLabel: "Book this excursion",
  ctaTitle: "Ready to book Loen Skylift and Mount Hoven?",
  ctaText:
    "Ride to Mount Hoven for dramatic Nordfjord panoramas on a cruise-friendly shore excursion.",
};
