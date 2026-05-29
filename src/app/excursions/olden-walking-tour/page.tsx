import type { Metadata } from "next";

import { ExcursionDetailPage } from "@/components/excursion-detail-page";
import { oldenWalkingTourExcursion } from "@/lib/excursions/olden-walking-tour";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: oldenWalkingTourExcursion.metaTitle,
  description: oldenWalkingTourExcursion.metaDescription,
  path: oldenWalkingTourExcursion.path,
  ogImage: oldenWalkingTourExcursion.heroImage,
  ogImageAlt: oldenWalkingTourExcursion.heroImageAlt,
});

export default function OldenWalkingTourPage() {
  return <ExcursionDetailPage excursion={oldenWalkingTourExcursion} />;
}
