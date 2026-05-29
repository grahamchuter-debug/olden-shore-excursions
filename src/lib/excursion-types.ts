export type ExcursionFaq = {
  question: string;
  answer: string;
};

export type ExcursionImage = {
  src: string;
  alt: string;
};

export type ExcursionBreadcrumb = {
  label: string;
  href?: string;
};

export type ExcursionRelatedLink = {
  label: string;
  href: string;
};

export type ExcursionSummary = {
  duration: string;
  meetingPoint: string;
  returnReassurance: string;
  bestFor: string;
};

export type ExcursionSnapshotCard = {
  label: string;
  value: string;
};

export type ExcursionDurationOption = {
  title: string;
  duration: string;
  startingPoint: string;
  stops: readonly string[];
  tourEnd: string;
};

export type ExcursionData = {
  slug: string;
  path: string;
  title: string;
  headline: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroBadge?: string;
  summary: ExcursionSummary;
  snapshotCards?: readonly ExcursionSnapshotCard[];
  gallery: ExcursionImage[];
  highlights: string[];
  description: readonly string[];
  durationOptions?: readonly ExcursionDurationOption[];
  included: readonly string[];
  notIncluded: readonly string[];
  timingAdvice: readonly string[];
  faqs: readonly ExcursionFaq[];
  breadcrumbs: readonly ExcursionBreadcrumb[];
  relatedLinks: readonly ExcursionRelatedLink[];
  bookingHref?: string;
  bookingLabel?: string;
  ctaTitle?: string;
  ctaText?: string;
};
