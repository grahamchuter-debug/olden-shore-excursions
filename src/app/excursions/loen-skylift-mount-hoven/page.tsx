import type { Metadata } from "next";

import { ExcursionDetailPage } from "@/components/excursion-detail-page";
import { loenSkyliftMountHovenExcursion } from "@/lib/excursions/loen-skylift-mount-hoven";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: loenSkyliftMountHovenExcursion.metaTitle,
  description: loenSkyliftMountHovenExcursion.metaDescription,
  path: loenSkyliftMountHovenExcursion.path,
  ogImage: loenSkyliftMountHovenExcursion.heroImage,
  ogImageAlt: loenSkyliftMountHovenExcursion.heroImageAlt,
});

export default function LoenSkyliftMountHovenPage() {
  return <ExcursionDetailPage excursion={loenSkyliftMountHovenExcursion} />;
}
