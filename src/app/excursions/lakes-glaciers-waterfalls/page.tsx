import type { Metadata } from "next";

import { ExcursionDetailPage } from "@/components/excursion-detail-page";
import { lakesGlaciersWaterfallsExcursion } from "@/lib/excursions/lakes-glaciers-waterfalls";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: lakesGlaciersWaterfallsExcursion.metaTitle,
  description: lakesGlaciersWaterfallsExcursion.metaDescription,
  path: lakesGlaciersWaterfallsExcursion.path,
  ogImage: lakesGlaciersWaterfallsExcursion.heroImage,
  ogImageAlt: lakesGlaciersWaterfallsExcursion.heroImageAlt,
});

export default function LakesGlaciersWaterfallsPage() {
  return <ExcursionDetailPage excursion={lakesGlaciersWaterfallsExcursion} />;
}
