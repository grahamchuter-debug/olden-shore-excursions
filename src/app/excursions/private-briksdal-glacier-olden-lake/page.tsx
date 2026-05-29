import type { Metadata } from "next";

import { ExcursionDetailPage } from "@/components/excursion-detail-page";
import { privateBriksdalGlacierOldenLakeExcursion } from "@/lib/excursions/private-briksdal-glacier-olden-lake";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: privateBriksdalGlacierOldenLakeExcursion.metaTitle,
  description: privateBriksdalGlacierOldenLakeExcursion.metaDescription,
  path: privateBriksdalGlacierOldenLakeExcursion.path,
  ogImage: privateBriksdalGlacierOldenLakeExcursion.heroImage,
  ogImageAlt: privateBriksdalGlacierOldenLakeExcursion.heroImageAlt,
});

export default function PrivateBriksdalGlacierOldenLakePage() {
  return <ExcursionDetailPage excursion={privateBriksdalGlacierOldenLakeExcursion} />;
}
