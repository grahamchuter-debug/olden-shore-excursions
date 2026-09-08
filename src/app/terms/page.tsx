import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for Olden Shore Excursions: independent cruise planning information for Olden port days.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      lead="These terms cover use of the Olden Shore Excursions website for Olden cruise-port planning and excursion requests."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/terms"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Terms" },
      ]}
      ctaTitle="Plan your Olden cruise day"
      ctaText="Explore village, glacier valley and Loen options, then verify timings with your cruise line."
      ctaHref="/excursions"
      ctaButtonLabel="Explore excursions"
      showShipReassurance={false}
      relatedLinks={[
        { label: "Privacy", href: "/privacy" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]}
    >
      <section>
        <h2>Informational use</h2>
        <p>
          Content on {siteConfig.name} is provided for general cruise planning
          information about Olden. It is not a substitute for official cruise-line
          instructions, operator terms or local regulations.
        </p>
      </section>

      <section>
        <h2>Excursion requests and payment</h2>
        <p>
          Selected Olden excursions may be requested online. When online checkout
          is enabled, payment takes your request and does not confirm the
          excursion until we email confirmation separately after arranging it with
          the local operator. If we cannot confirm your excursion, you receive a
          full refund.
        </p>
        <p>
          Free cancellation up to 48 hours before departure. Cancellations within
          48 hours of departure are non-refundable for customer cancellations. If
          your cruise ship does not call at Olden, you receive a full refund.
        </p>
        <p>
          Until online checkout is unlocked, contact{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>{" "}
          to request manually.
        </p>
      </section>

      <section>
        <h2>Schedules and timings</h2>
        <p>
          Published ship-call information is imported for planning and may change.
          Always confirm arrival, departure and all aboard times with your cruise
          line.
        </p>
      </section>

      <section>
        <h2>Liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for missed
          ships, cancelled tours, weather disruption, berth changes or reliance on
          planning information without independent verification.
        </p>
      </section>

      <section>
        <h2>Related notices</h2>
        <p>
          See also the <Link href="/privacy">privacy policy</Link> and{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </section>
    </ContentPage>
  );
}
