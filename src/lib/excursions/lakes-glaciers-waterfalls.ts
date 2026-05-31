import type { ExcursionData } from "@/lib/excursion-types";
import { imageAlts, siteImages } from "@/lib/site-images";

export const lakesGlaciersWaterfallsExcursion: ExcursionData = {
  slug: "lakes-glaciers-waterfalls",
  path: "/excursions/lakes-glaciers-waterfalls",
  title: "Scenic Lakes, Glaciers and Waterfalls Tour",
  headline: "Scenic Lakes, Glaciers and Waterfalls Tour for Cruise Passengers",
  lead: "A nature-focused countryside tour through glacial lakes, waterfalls, and dramatic valley scenery with photo stops, a scenic cruise excursion beyond the village.",
  metaTitle: "Scenic Lakes, Glaciers and Waterfalls Tour for Cruise Passengers",
  metaDescription:
    "Scenic Olden countryside tour with glacial lakes, waterfalls, valley scenery, and photo stops. Nature-focused shore excursion for cruise passengers.",
  heroImage: siteImages.lakesGlaciersTour,
  heroImageAlt: imageAlts.lakesGlaciersTourCard,
  heroBadge: "Scenic countryside tour",
  summary: {
    duration: "Approx. 4 to 5 hours",
    meetingPoint: "Olden village centre near cruise pier",
    returnReassurance:
      "Coach route timed for typical cruise port schedules",
    bestFor:
      "Nature lovers who want lakes, waterfalls, and valley scenery on a moderate port day",
  },
  snapshotCards: [
    { label: "Highlights", value: "Glacial lakes, waterfalls, valley views" },
    { label: "Fitness level", value: "Easy, photo stops with short walks" },
    { label: "Port call fit", value: "Ideal for 4 to 6 hour visits" },
    { label: "Focus", value: "Nature and landscape photography" },
  ],
  gallery: [
    { src: siteImages.oldedalen, alt: imageAlts.oldedalen },
    { src: siteImages.briksdalWaterfall, alt: imageAlts.briksdalWaterfall },
    { src: siteImages.oldenLake, alt: imageAlts.oldenLake },
    { src: siteImages.briksdalGlacier, alt: imageAlts.briksdalGlacier },
  ],
  highlights: [
    "Glacial lakes and turquoise valley water",
    "Waterfalls along Oldedalen scenic routes",
    "Valley scenery with pine forests and peaks",
    "Multiple photo stops for landscape photography",
    "Nature-focused commentary throughout",
    "Cruise-friendly timing from Olden cruise port",
  ],
  description: [
    "This scenic countryside tour explores the landscapes that surround Olden, glacial lakes, cascading waterfalls, and the steep-walled valleys that make Nordfjord one of Norway's most photogenic regions. It suits passengers who want broad nature scenery without necessarily reaching the Briksdal glacier terminus.",
    "The route typically follows valley roads south from Olden with stops at viewpoints, lakes, and waterfall areas. Your guide explains the glacial history of the region and points out photo opportunities along the way.",
    "A strong choice for port calls of four to six hours when you want more than a village walk but need a tighter schedule than a full Briksdal and Loen combination day.",
  ],
  included: [
    "Guided scenic lakes and waterfalls tour",
    "Coach transport through Oldedalen valley",
    "Photo stops at lakes and waterfall viewpoints",
    "Route paced for typical cruise port timings",
  ],
  notIncluded: [
    "Food, drinks, and personal purchases",
    "Loen Skylift tickets",
    "Optional gratuities",
  ],
  timingAdvice: [
    "Best suited to port calls of four to six hours.",
    "Bring a camera, this tour emphasises landscape photography stops.",
    "Weather affects waterfall volume and lake colour, both are dramatic in rain or sun.",
    "Keep 45 minutes before all aboard for the return to Olden pier.",
  ],
  faqs: [
    {
      question: "How is this different from the Briksdal Glacier tour?",
      answer:
        "The scenic lakes tour covers broader valley scenery with multiple photo stops. The Briksdal Glacier tour focuses specifically on the glacier terminus and is the headline first-time visitor choice.",
    },
    {
      question: "Is this tour good for photography?",
      answer:
        "Yes. Multiple photo stops at lakes, waterfalls, and valley viewpoints are a core part of the itinerary.",
    },
    {
      question: "How long is the scenic lakes tour?",
      answer:
        "Most departures run approximately four to five hours, fitting comfortably within a six-hour port window.",
    },
    {
      question: "Does the tour reach Briksdal Glacier?",
      answer:
        "The route may include glacier valley scenery and distant glacier views. For the glacier terminus, choose the dedicated Briksdal Glacier and Olden Lake Discovery tour.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Excursions", href: "/excursions" },
    { label: "Scenic Lakes, Glaciers and Waterfalls Tour" },
  ],
  relatedLinks: [
    { label: "Briksdal Glacier tour", href: "/excursions/briksdal-glacier-olden-lake" },
    { label: "Loen Skylift", href: "/excursions/loen-skylift-mount-hoven" },
    { label: "Is Olden worth visiting?", href: "/is-olden-worth-visiting" },
  ],
  bookingHref: "/excursions",
  bookingLabel: "Book this excursion",
  ctaTitle: "Ready to book the scenic lakes and waterfalls tour?",
  ctaText:
    "Discover glacial lakes, waterfalls, and dramatic valley scenery on a nature-focused Olden shore excursion.",
};
