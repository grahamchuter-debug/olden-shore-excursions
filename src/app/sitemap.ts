import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";
import { siteRoutes } from "@/lib/site-routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
