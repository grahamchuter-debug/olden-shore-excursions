import type { ExcursionData } from "@/lib/excursion-types";
import { imageAlts, siteImages } from "@/lib/site-images";

export const privateBriksdalGlacierOldenLakeExcursion: ExcursionData = {
  slug: "private-briksdal-glacier-olden-lake",
  path: "/excursions/private-briksdal-glacier-olden-lake",
  title: "Private Briksdal Glacier and Olden Lake Discovery",
  headline: "Private Briksdal Glacier and Olden Lake Discovery for Cruise Passengers",
  lead: "Premium private sightseeing to Briksdal Glacier and Olden Lake with flexible pace, glacier viewpoints, and personalised timing, ideal for families, couples, and small groups.",
  metaTitle: "Private Briksdal Glacier and Olden Lake Discovery for Cruise Passengers",
  metaDescription:
    "Private Briksdal Glacier and Olden Lake tour from Olden cruise port. Flexible pace, glacier viewpoints, and return-to-ship friendly timings for small groups.",
  heroImage: siteImages.privateBriksdalTour,
  heroImageAlt: imageAlts.privateBriksdalTourCard,
  heroBadge: "Premium private option",
  summary: {
    duration: "Approx. 5 to 6 hours (flexible)",
    meetingPoint: "Olden cruise pier or agreed village location",
    returnReassurance:
      "Private vehicle with schedule tailored to your ship's timetable",
    bestFor:
      "Families, couples, and small groups wanting flexible glacier valley sightseeing",
  },
  snapshotCards: [
    { label: "Group size", value: "Private vehicle for your party" },
    { label: "Pace", value: "Flexible stops and photo time" },
    { label: "Port call fit", value: "Ideal for 8+ hour visits" },
    { label: "Highlights", value: "Glacier viewpoints and Olden Lake" },
  ],
  gallery: [
    { src: siteImages.briksdalWaterfall, alt: imageAlts.briksdalWaterfall },
    { src: siteImages.briksdalGlacier, alt: imageAlts.briksdalGlacier },
    { src: siteImages.oldedalen, alt: imageAlts.oldedalen },
    { src: siteImages.village, alt: imageAlts.village },
  ],
  highlights: [
    "Private sightseeing with flexible pace",
    "Briksdal Glacier viewpoints with extended photo time",
    "Olden Lake and Oldedalen valley scenery",
    "Personalised commentary for your group",
    "Cruise-friendly return timings built around your ship",
    "Ideal for families, couples, and small groups",
  ],
  description: [
    "A private Briksdal Glacier tour gives you control over pace, stops, and photo time, without sharing a coach with other cruise passengers. Your guide adapts the itinerary to your group's interests while keeping return-to-ship timing as the priority.",
    "The route follows the same dramatic Oldedalen valley as the group tour, but with flexibility to linger at glacier viewpoints, waterfall stops, and lake scenery. Families with children and couples who prefer a quieter experience often choose this format.",
    "Best suited to longer port calls of eight hours or more, when you have margin for unhurried glacier viewing and optional village time before returning to the pier.",
  ],
  included: [
    "Private vehicle and dedicated guide",
    "Flexible Briksdal Glacier and Olden Lake itinerary",
    "Scenic drive through Oldedalen valley",
    "Schedule tailored to your cruise timetable",
  ],
  notIncluded: [
    "Food, drinks, and personal purchases",
    "Optional gratuities",
    "Loen Skylift tickets (can be added separately)",
  ],
  timingAdvice: [
    "Best suited to port calls of eight hours or more.",
    "Confirm your all-aboard time with the guide at the start of the tour.",
    "Allow 45 minutes before departure to reach the cruise pier comfortably.",
    "Private tours should be booked well in advance on peak summer days.",
  ],
  faqs: [
    {
      question: "How many people can join a private Briksdal Glacier tour?",
      answer:
        "Capacity depends on vehicle size, but private tours typically accommodate couples, families, and small groups up to around eight passengers.",
    },
    {
      question: "Can we adjust the itinerary during the tour?",
      answer:
        "Yes. Private format allows flexible stops and extended time at glacier viewpoints, within the constraints of your ship's departure schedule.",
    },
    {
      question: "Is a private tour worth it over the group excursion?",
      answer:
        "If you value flexible pace, personalised commentary, and extended photo time, especially on a longer port day, the private format often delivers a more relaxed glacier experience.",
    },
    {
      question: "Does the private tour include Loen Skylift?",
      answer:
        "The standard private Briksdal itinerary focuses on glacier and valley scenery. Loen Skylift can sometimes be combined on full-day private bookings, confirm availability when booking.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Excursions", href: "/excursions" },
    { label: "Private Briksdal Glacier and Olden Lake Discovery" },
  ],
  relatedLinks: [
    { label: "Briksdal Glacier group tour", href: "/excursions/briksdal-glacier-olden-lake" },
    { label: "Loen Skylift & Mount Hoven", href: "/excursions/loen-skylift-mount-hoven" },
    { label: "Olden port guide", href: "/olden-port-guide" },
  ],
  bookingHref: "/excursions",
  bookingLabel: "Book this excursion",
  ctaTitle: "Ready to book your private Briksdal Glacier tour?",
  ctaText:
    "Enjoy flexible private sightseeing to Briksdal Glacier and Olden Lake with cruise-friendly timings.",
};
