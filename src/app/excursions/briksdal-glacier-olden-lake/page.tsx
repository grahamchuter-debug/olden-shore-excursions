import type { Metadata } from "next";

import { ExcursionDetailPage } from "@/components/excursion-detail-page";
import { briksdalGlacierOldenLakeExcursion } from "@/lib/excursions/briksdal-glacier-olden-lake";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: briksdalGlacierOldenLakeExcursion.metaTitle,
  description: briksdalGlacierOldenLakeExcursion.metaDescription,
  path: briksdalGlacierOldenLakeExcursion.path,
  ogImage: briksdalGlacierOldenLakeExcursion.heroImage,
  ogImageAlt: briksdalGlacierOldenLakeExcursion.heroImageAlt,
});

export default function BriksdalGlacierOldenLakePage() {
  return <ExcursionDetailPage excursion={briksdalGlacierOldenLakeExcursion} />;
}
