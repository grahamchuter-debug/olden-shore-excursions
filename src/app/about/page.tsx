import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Olden Shore Excursions",
  description:
    "About Olden Shore Excursions: independent cruise-port planning for Briksdal Glacier, Olden Lake, Loen Skylift and published ship schedules.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      title="About Olden Shore Excursions"
      lead="An independent planning site for cruise passengers calling at Olden. Village, glacier valley and Loen context, plus published ship schedules."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/about"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "About" },
      ]}
      ctaTitle="Start with your Olden day"
      ctaText="Check the ship schedule, then explore village, Briksdal and Loen options that fit your hours ashore."
      ctaHref="/ship-schedule"
      ctaButtonLabel="Check ship schedule"
      showShipReassurance={false}
      relatedLinks={[
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ]}
    >
      <section>
        <h2>What this site is</h2>
        <p>
          Olden Shore Excursions helps cruise passengers plan a realistic day in
          Olden: the village, Briksdal Glacier and Olden Lake, Loen Skylift, and
          published ship-call information drawn from the Norway Shore Excursions
          master schedule.
        </p>
      </section>

      <section>
        <h2>What this site is not</h2>
        <ul>
          <li>Not a cruise line, coach operator or port authority</li>
          <li>Not an official tourism board</li>
          <li>
            Not an instant-confirm booking engine — online requests are confirmed
            separately after we arrange the excursion
          </li>
          <li>Not a guarantee of berth, timings or ticket availability</li>
        </ul>
      </section>

      <section>
        <h2>National context</h2>
        <p>
          For multi-port Norway planning, see{" "}
          <a href={siteConfig.nationalAuthorityUrl}>Norway Shore Excursions</a>.
          This site stays focused on Olden.
        </p>
        <p>
          <Link href="/contact">Contact</Link>
          {" · "}
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <Link href="/terms">Terms</Link>
        </p>
      </section>
    </ContentPage>
  );
}
