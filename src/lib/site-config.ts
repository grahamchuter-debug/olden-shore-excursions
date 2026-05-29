import { imageAlts, siteImages } from "@/lib/site-images";

export const siteConfig = {
  name: "Olden Shore Excursions",
  url: "https://oldenshoreexcursions.com",
  locale: "en_GB",
  defaultDescription:
    "Independent Olden cruise port guides and shore excursion planning for passengers visiting Briksdal Glacier, Olden Lake, Loen Skylift, glacier valleys, and dramatic Nordfjord scenery.",
  defaultOgImage: siteImages.hero,
  defaultOgImageAlt: imageAlts.hero,
  copyrightEntity: "Olden Shore Excursions",
  shoreExcursionsPath: "/excursions",
} as const;
