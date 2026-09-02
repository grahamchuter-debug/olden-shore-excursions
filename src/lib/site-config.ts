import { imageAlts, siteImages } from "@/lib/site-images";

export const siteConfig = {
  name: "Olden Shore Excursions",
  url: "https://oldenshoreexcursions.com",
  locale: "en_GB",
  tagline: "Village, glacier valley or Loen for an Olden cruise day",
  defaultDescription:
    "Independent Olden cruise-port planning: Briksdal Glacier, Olden Lake, Loen Skylift and published ship schedules for your day ashore.",
  defaultOgImage: siteImages.hero,
  defaultOgImageAlt: imageAlts.hero,
  copyrightEntity: "Olden Shore Excursions",
  shoreExcursionsPath: "/excursions",
  plannerPath: "/one-day-in-olden",
  schedulePath: "/ship-schedule",
  nationalAuthorityUrl: "https://norwayshoreexcursions.com",
  contactEmail: "hello@oldenshoreexcursions.com",
  contactEmailVerified: true,
} as const;
