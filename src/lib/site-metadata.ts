import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  absoluteTitle?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  ogImage = siteConfig.defaultOgImage,
  ogImageAlt = siteConfig.defaultOgImageAlt,
  absoluteTitle = false,
}: BuildPageMetadataOptions): Metadata {
  const pageTitle = absoluteTitle ? title : title;
  const openGraphTitle = absoluteTitle
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : pageTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: openGraphTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: ogImageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
      images: [ogImage],
    },
  };
}
