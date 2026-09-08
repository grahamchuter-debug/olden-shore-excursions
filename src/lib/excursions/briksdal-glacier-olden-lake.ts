import type { ExcursionData } from "@/lib/excursion-types";
import { imageAlts, siteImages } from "@/lib/site-images";

export const briksdalGlacierOldenLakeExcursion: ExcursionData = {
  slug: "briksdal-glacier-olden-lake",
  path: "/excursions/briksdal-glacier-olden-lake",
  title: "Briksdal Glacier & Olden Lake",
  headline: "Briksdal Glacier & Olden Lake",
  lead: "A four-hour guided shore excursion from Olden through the Oldedalen valley and along Olden Lake, with time to walk towards the Briksdal Glacier lake viewpoint.",
  metaTitle: "Briksdal Glacier and Olden Lake Discovery for Cruise Passengers",
  metaDescription:
    "Four-hour Olden shore excursion to Briksdal Glacier and Olden Lake. Adult €96, child €56, infant free. Cruise-port departure with a 45–60 minute glacier walk.",
  heroImage: siteImages.briksdalTour,
  heroImageAlt: imageAlts.briksdalTourCard,
  heroBadge: "Headline Olden shore excursion",
  heroOverlay: "light",
  pricing: {
    currency: "EUR",
    adultLabel: "Adult 12+",
    adultAmount: 96,
    childLabel: "Child 3–11",
    childAmount: 56,
    infantLabel: "Infant 0–2",
    infantAmount: 0,
    infantDisplay: "FREE",
  },
  summary: {
    duration: "4 hours",
    meetingPoint: "Olden cruise terminal area",
    returnReassurance:
      "Designed for cruise passengers, with a local-operator back-in-time-to-ship commitment",
    bestFor:
      "Cruise visitors who want Briksdal Glacier and Olden Lake in one guided outing",
  },
  snapshotCards: [
    { label: "Adult from", value: "€96" },
    { label: "Child from", value: "€56" },
    { label: "Infant", value: "FREE" },
    {
      label: "Walking",
      value: "About 45–60 minutes towards the glacier viewpoint",
    },
  ],
  gallery: [
    {
      src: siteImages.briksdalGlacier,
      alt: imageAlts.briksdalGlacier,
      attributionKey: "briksdalGlacier",
    },
    {
      src: siteImages.oldenLake,
      alt: imageAlts.oldenLake,
      attributionKey: "oldenLake",
    },
    {
      src: siteImages.oldedalen,
      alt: imageAlts.oldedalen,
      attributionKey: "oldedalen",
    },
    {
      src: siteImages.littleRedChurch,
      alt: imageAlts.littleRedChurch,
      attributionKey: "littleRedChurch",
    },
    {
      src: siteImages.kleivafossen,
      alt: imageAlts.kleivafossen,
      attributionKey: "kleivafossen",
    },
    {
      src: siteImages.briksdalTrail,
      alt: imageAlts.briksdalTrail,
      attributionKey: "briksdalTrail",
    },
    {
      src: siteImages.briksdalWaterfall,
      alt: imageAlts.briksdalWaterfall,
      attributionKey: "briksdalWaterfall",
    },
    {
      src: siteImages.harbour,
      alt: imageAlts.harbour,
      attributionKey: "harbour",
    },
  ],
  highlights: [
    "Briksdal Glacier, an accessible arm of Jostedalsbreen",
    "Scenic coach journey through Oldedalen and along Olden Lake",
    "Little Red Church along the valley route",
    "Walk towards the glacier lake viewpoint",
    "Cruise-port departure with timings designed for ship visits",
    "Local guide commentary on the valley and glacier landscape",
  ],
  description: [
    "Briksdalsbreen is one of the most accessible glacier arms in Norway, and the reason many cruise passengers choose to go ashore in Olden. This guided excursion combines the scenic drive through Oldedalen, the shoreline of Olden Lake, and time on foot towards the Briksdal glacier lake viewpoint.",
    "From the Olden cruise terminal area you travel south through the valley, past Olden's historic red church, fertile farms and waterfalls, before arriving in the Briksdal area near Briksdal Inn. There you walk towards the glacier lake viewpoint, with the first section the most challenging.",
    "The excursion is designed around cruise visitors to Olden. Departures are scheduled around ships in port, and the local operator works to a back-in-time-to-ship commitment. Exact meeting instructions and departure time are provided once your request is confirmed.",
  ],
  durationOptions: [
    {
      title: "Guided Briksdal Glacier & Olden Lake itinerary",
      duration: "4 hours",
      startingPoint: "Olden cruise terminal area",
      stops: [
        "Meet at Olden cruise port — meet your excursion representative in the cruise-terminal area before setting off through the village.",
        "Little Red Church & Oldedalen — travel past Olden's historic red church and into the dramatic Oldedalen valley.",
        "Olden Lake — follow the shoreline of Olden Lake, surrounded by mountains, waterfalls and farms.",
        "Briksdal — continue towards Rustøen and the Briksdal area before arriving near Briksdal Inn.",
        "Walk towards Briksdal Glacier — allow approximately 45–60 minutes for the walk towards the glacier lake viewpoint. The first section is the most challenging; suitable footwear and weather-ready clothing are recommended.",
        "Return to Olden — rejoin the vehicle for the return journey through the valley to Olden and the cruise port.",
      ],
      tourEnd:
        "Olden cruise port. Stop order may vary operationally on the day.",
    },
  ],
  suitability: {
    title: "Is this excursion right for you?",
    points: [
      "Approximately 45–60 minutes walking towards the glacier viewpoint",
      "The first section is the most challenging; after that the route becomes relatively more even",
      "Reasonable fitness recommended",
      "Wear suitable walking shoes",
      "Bring layers and weatherproof clothing — conditions can change quickly",
      "If anyone in your party has limited mobility or specific accessibility requirements, contact us before requesting so we can check suitability",
    ],
  },
  included: [
    "Guided Briksdal Glacier and Olden Lake excursion",
    "Coach / bus transportation",
    "Local guide",
    "Scenic route through Oldedalen and along Olden Lake",
    "Applicable VAT / taxes",
  ],
  notIncluded: [
    "Food and drinks",
    "Personal purchases",
    "Optional gratuities",
  ],
  timingAdvice: [
    "Best suited to port calls of four hours or more.",
    "Disembark promptly on multi-ship days — popular Briksdal departures fill.",
    "Arrive at the meeting point about 15 minutes before your confirmed departure time.",
    "Keep a sensible buffer before all aboard for the return to the pier.",
    "Weather can affect visibility at the glacier — pack a waterproof layer.",
  ],
  cancellationPolicy: [
    "Free cancellation up to 48 hours before departure.",
    "Cancellations made within 48 hours of departure are non-refundable.",
    "If we are unable to confirm your excursion, you will receive a full refund.",
    "If your cruise ship does not call at Olden, you will receive a full refund.",
    "Payment receives your request — it does not confirm the excursion until we email confirmation separately.",
  ],
  faqs: [
    {
      question: "How far is Briksdal Glacier from Olden cruise port?",
      answer:
        "Briksdal Glacier is approximately 25 km south of Olden village, reached by a scenic drive through Oldedalen valley. The journey is included in the tour duration.",
    },
    {
      question: "How much walking is involved?",
      answer:
        "Allow approximately 45–60 minutes for the walk towards the glacier lake viewpoint. The first section is the most challenging; after that the route becomes relatively more even. Suitable walking shoes and weather-ready clothing are recommended.",
    },
    {
      question: "How long is the Briksdal Glacier tour?",
      answer:
        "The excursion lasts about four hours, including the scenic drive, glacier walk and return to Olden.",
    },
    {
      question: "Where do we meet?",
      answer:
        "Meet your local excursion representative in the Olden cruise terminal area. Full meeting instructions and your departure time are provided with your booking confirmation. Plan to arrive about 15 minutes early.",
    },
    {
      question: "Will I get back to my ship on time?",
      answer:
        "The excursion is designed for cruise passengers. The local operator schedules departures around ships visiting Olden and operates a back-in-time-to-ship commitment. Always allow a buffer before all aboard.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Free cancellation up to 48 hours before departure. Within 48 hours, customer cancellations are non-refundable. If we cannot confirm your excursion, or if your ship does not call at Olden, you receive a full refund.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Excursions", href: "/excursions" },
    { label: "Briksdal Glacier & Olden Lake" },
  ],
  relatedLinks: [
    {
      label: "Private Briksdal Glacier",
      href: "/excursions/private-briksdal-glacier-olden-lake",
    },
    {
      label: "Loen Skylift & Mount Hoven",
      href: "/excursions/loen-skylift-mount-hoven",
    },
    { label: "One day in Olden", href: "/one-day-in-olden" },
  ],
  bookingHref: "/book/briksdal-glacier-olden-lake",
  bookingLabel: "Request to book",
  ctaTitle: "Request Briksdal Glacier & Olden Lake",
  ctaText:
    "Adult €96 · Child €56 · Infant FREE. Payment takes your request — confirmation follows separately once we arrange the excursion.",
};
