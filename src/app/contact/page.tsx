import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Olden Shore Excursions for help planning a cruise day around Briksdal Glacier, Olden village and Loen.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      lead="Questions about planning an Olden cruise day? Use the planning tools on this site, or write when the destination concierge email is active."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/contact"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact" },
      ]}
      ctaTitle="Prefer to plan yourself first?"
      ctaText="Use the ship schedule, one-day guide and excursion pages for immediate answers."
      ctaHref="/ship-schedule"
      ctaButtonLabel="Check ship schedule"
      showShipReassurance={false}
      relatedLinks={[
        { label: "About", href: "/about" },
        { label: "Excursions", href: "/excursions" },
        { label: "Privacy", href: "/privacy" },
      ]}
    >
      <section>
        <h2>How we can help</h2>
        <ul>
          <li>Understanding an Olden cruise call and time ashore</li>
          <li>Choosing between village time, Briksdal Glacier and Loen</li>
          <li>Finding the right guide page for your day</li>
        </ul>
      </section>

      <section>
        <h2>Olden planning concierge</h2>
        {siteConfig.contactEmailVerified ? (
          <>
            <p>
              Email{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </p>
            <p>
              We help with Olden port-day planning questions. Include your cruise
              dates and approximate hours ashore where relevant.
            </p>
          </>
        ) : (
          <p>
            A destination concierge email for Olden Shore Excursions is being
            prepared. In the meantime, use the planning tools on this site: the{" "}
            <Link href="/ship-schedule">ship schedule</Link>,{" "}
            <Link href="/one-day-in-olden">one-day guide</Link> and{" "}
            <Link href="/excursions">excursion options</Link>.
          </p>
        )}
      </section>

      <section>
        <h2>What we cannot do</h2>
        <ul>
          <li>Confirm your ship’s official arrival or all aboard time</li>
          <li>Guarantee glacier, Skylift or coach operation</li>
          <li>
            Instantly confirm an excursion before the local operator booking is
            secured
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
