import type { Metadata } from "next";
import Link from "next/link";

import { BookingReferenceBanner } from "@/components/booking/booking-reference-banner";
import { ContentPage } from "@/components/content-page";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Request received — Briksdal Glacier & Olden Lake",
    description:
      "We have received your Briksdal Glacier and Olden Lake excursion request. Confirmation follows separately.",
    path: "/book/briksdal-glacier-olden-lake/received",
    ogImage: siteImages.briksdalTour,
    ogImageAlt: imageAlts.briksdalTourCard,
  }),
  robots: { index: false, follow: false },
};

export default function BriksdalReceivedPage() {
  return (
    <ContentPage
      title="Request received"
      lead="We're verifying your payment and preparing your Briksdal Glacier & Olden Lake request. This is not a booking confirmation."
      heroImage={siteImages.briksdalTour}
      heroImageAlt={imageAlts.briksdalTourCard}
      pagePath="/book/briksdal-glacier-olden-lake/received"
      pageDescription="Briksdal Glacier request received."
      breadcrumbs={[
        { label: "Home", href: "/" },
        {
          label: "Briksdal Glacier & Olden Lake",
          href: "/excursions/briksdal-glacier-olden-lake",
        },
        { label: "Request received" },
      ]}
      showShipReassurance={false}
      relatedLinks={[
        {
          label: "Excursion notes",
          href: "/excursions/briksdal-glacier-olden-lake",
        },
        { label: "Contact", href: "/contact" },
      ]}
    >
      <section className="space-y-4 leading-7">
        <p>
          This page does not confirm your excursion by itself. Payment must be
          verified with our payment provider, and your places are only confirmed
          when we email confirmation separately.
        </p>
        <BookingReferenceBanner />
        <ul className="list-disc space-y-2 pl-5">
          <li>Payment is verified by Stripe / our booking system — not by this URL alone</li>
          <li>Excursion request awaits operator confirmation</li>
          <li>We&apos;ll email you separately when the excursion is confirmed</li>
          <li>
            If we&apos;re unable to confirm your excursion, you&apos;ll receive a
            full refund to your original payment method
          </li>
        </ul>
        <p>
          <Link href="/excursions/briksdal-glacier-olden-lake" className="content-link">
            Return to excursion notes
          </Link>
        </p>
      </section>
    </ContentPage>
  );
}
