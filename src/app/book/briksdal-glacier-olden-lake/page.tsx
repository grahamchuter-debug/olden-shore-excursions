import type { Metadata } from "next";
import Link from "next/link";

import { BriksdalBookingForm } from "@/components/booking/briksdal-booking-form";
import { ContentPage } from "@/components/content-page";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Request Briksdal Glacier & Olden Lake",
    description:
      "Request the four-hour Briksdal Glacier and Olden Lake shore excursion from Olden. Adult €96, child €56, infant free.",
    path: "/book/briksdal-glacier-olden-lake",
    ogImage: siteImages.briksdalTour,
    ogImageAlt: imageAlts.briksdalTourCard,
  }),
  robots: { index: false, follow: true },
};

export default function BriksdalBookPage() {
  return (
    <ContentPage
      title="Request Briksdal Glacier & Olden Lake"
      lead="Four-hour guided shore excursion from Olden. Adult €96 · Child €56 · Infant FREE. Payment takes your request — confirmation follows separately."
      heroImage={siteImages.briksdalTour}
      heroImageAlt={imageAlts.briksdalTourCard}
      pagePath="/book/briksdal-glacier-olden-lake"
      pageDescription="Request Briksdal Glacier and Olden Lake from Olden cruise port."
      breadcrumbs={[
        { label: "Home", href: "/" },
        {
          label: "Briksdal Glacier & Olden Lake",
          href: "/excursions/briksdal-glacier-olden-lake",
        },
        { label: "Request" },
      ]}
      showShipReassurance={false}
      relatedLinks={[
        {
          label: "Excursion notes",
          href: "/excursions/briksdal-glacier-olden-lake",
        },
        { label: "Contact", href: "/contact" },
        { label: "Terms", href: "/terms" },
      ]}
    >
      <section className="space-y-4">
        <p>
          Before you continue, please read the walking requirements on the{" "}
          <Link
            href="/excursions/briksdal-glacier-olden-lake"
            className="content-link"
          >
            excursion page
          </Link>
          : about 45–60 minutes walking, with the first section the most
          challenging.
        </p>
      </section>
      <BriksdalBookingForm />
    </ContentPage>
  );
}
