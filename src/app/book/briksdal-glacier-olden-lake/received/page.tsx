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
      lead="We've received your booking request for Briksdal Glacier & Olden Lake. Your excursion is not confirmed yet — final confirmation will be emailed separately."
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
          Payment receives your booking request. We&apos;ll confirm your excursion
          with our local operator and email your final confirmation. This page is
          not confirmation that your places are booked.
        </p>
        <BookingReferenceBanner />
        <ul className="list-disc space-y-2 pl-5">
          <li>Payment / booking request received</li>
          <li>Local operator confirmation follows</li>
          <li>Final confirmation is emailed separately</li>
          <li>
            If we&apos;re unable to confirm your booking, you&apos;ll receive a full
            refund to your original payment method
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
