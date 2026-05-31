import type { ExcursionData } from "@/lib/excursion-types";
import { imageAlts, siteImages } from "@/lib/site-images";

export const oldenWalkingTourExcursion: ExcursionData = {
  slug: "olden-walking-tour",
  path: "/excursions/olden-walking-tour",
  title: "Olden Walking and Village Highlights",
  headline: "Olden Walking and Village Highlights for Cruise Passengers",
  lead: "An easy guided walk through Olden village, harbour area, local history, and scenic viewpoints, the short-port option when you have limited time ashore.",
  metaTitle: "Olden Walking and Village Highlights for Cruise Passengers",
  metaDescription:
    "Olden walking tour for cruise passengers. Village highlights, harbour area, local history, and scenic viewpoints with return-to-ship friendly timing.",
  heroImage: siteImages.walkingTour,
  heroImageAlt: imageAlts.walkingTourCard,
  heroBadge: "Short-port option",
  summary: {
    duration: "Approx. 1.5 to 2 hours",
    meetingPoint: "Olden cruise pier or village centre",
    returnReassurance:
      "Compact route within minutes of the gangway",
    bestFor:
      "Cruise passengers with under four hours ashore or who prefer easy walking",
  },
  snapshotCards: [
    { label: "Walking distance", value: "Easy, mostly flat village routes" },
    { label: "Fitness level", value: "Low, suitable for most passengers" },
    { label: "Port call fit", value: "Ideal for under 4 hour visits" },
    { label: "Focus", value: "Village, harbour, and local history" },
  ],
  gallery: [
    { src: siteImages.village, alt: imageAlts.village },
    { src: siteImages.harbour, alt: imageAlts.harbour },
    { src: siteImages.oldenLake, alt: imageAlts.oldenLake },
    { src: siteImages.briksdalGlacier, alt: imageAlts.briksdalGlacier },
  ],
  highlights: [
    "Olden village streets and harbour area",
    "Local history and Olden village culture",
    "Scenic viewpoints within walking distance",
    "Churches, cafés, and waterfront landmarks",
    "Easy walking option for shorter port calls",
    "Returns to cruise pier with comfortable margin",
  ],
  description: [
    "When your port time is limited, a guided walk through Olden delivers authentic Norwegian village atmosphere without long road transfers. The compact layout means you are never far from the cruise pier while still discovering local history, harbour views, and the mountain backdrop that defines Olden as a cruise port.",
    "Your guide covers Olden's development as a cruise destination, points out key landmarks, and recommends how to spend any remaining free time before all aboard. This is the practical choice when Briksdal Glacier or Loen Skylift do not fit your schedule.",
    "Most walking tours run between 90 minutes and two hours, leaving margin for independent shopping, a harbour coffee, or a calm return to ship on tight port days.",
  ],
  included: [
    "Guided walking tour of Olden village and harbour",
    "Commentary on local history and Olden village culture",
    "Route designed for short cruise port windows",
  ],
  notIncluded: [
    "Food, drinks, and shopping purchases",
    "Optional gratuities",
    "Transport to Briksdal Glacier or Loen",
  ],
  timingAdvice: [
    "Ideal for port calls under four hours.",
    "Disembark as early as permitted to maximise village time.",
    "Keep 30 minutes before all aboard, the pier is nearby.",
    "Combine with independent harbour time if your schedule allows.",
  ],
  faqs: [
    {
      question: "Is the Olden walking tour suitable for short port calls?",
      answer:
        "Yes. This is specifically designed as the short-port option, typically completing within two hours with easy return to the cruise pier.",
    },
    {
      question: "How much walking is involved?",
      answer:
        "Routes are mostly flat village paths with manageable distances. Suitable for passengers who prefer easy walking without steep climbs.",
    },
    {
      question: "Can I see the glacier on the walking tour?",
      answer:
        "The walking tour stays in Olden village. Glacier views require the Briksdal Glacier excursion or a scenic drive into Oldedalen valley.",
    },
    {
      question: "Where does the walking tour meet?",
      answer:
        "Most tours meet near the cruise pier or village centre. Confirm the exact location on your booking voucher.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Excursions", href: "/excursions" },
    { label: "Olden Walking and Village Highlights" },
  ],
  relatedLinks: [
    { label: "Briksdal Glacier tour", href: "/excursions/briksdal-glacier-olden-lake" },
    { label: "Olden port guide", href: "/olden-port-guide" },
    { label: "One day in Olden", href: "/one-day-in-olden" },
  ],
  bookingHref: "/excursions",
  bookingLabel: "Book this excursion",
  ctaTitle: "Ready to book your Olden walking tour?",
  ctaText:
    "Explore Olden village and harbour highlights on an easy cruise-friendly walking tour.",
};
