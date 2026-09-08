import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";
import { imageAlts, siteImages } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Olden Shore Excursions: how this independent cruise planning website handles information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      lead="This privacy notice describes how Olden Shore Excursions handles information for cruise-port planning and excursion requests."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/privacy"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy" },
      ]}
      ctaTitle="Questions about this policy?"
      ctaText="Use the contact page if you have a privacy question about this website."
      ctaHref="/contact"
      ctaButtonLabel="Contact"
      showShipReassurance={false}
      relatedLinks={[
        { label: "Terms", href: "/terms" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]}
    >
      <section>
        <h2>Who we are</h2>
        <p>
          This website is operated under the name {siteConfig.name} at{" "}
          {siteConfig.url}. It provides independent Olden cruise-port planning
          information.
        </p>
      </section>

      <section>
        <h2>Excursion request data</h2>
        <p>
          When you submit an excursion request, we process the details you provide
          (such as name, email, phone, cruise ship, date, guest counts, and any
          child-seat or accessibility notes) to arrange the excursion with the
          local operator and to send transactional emails about your request.
        </p>
        <p>
          Payment card details are handled by our payment provider on their hosted
          checkout pages. We do not store full card numbers on this website.
        </p>
      </section>

      <section>
        <h2>What this site does not do</h2>
        <ul>
          <li>
            It does not include first-party marketing analytics packages in the
            application source reviewed for this policy.
          </li>
          <li>
            It does not sell your personal information.
          </li>
        </ul>
      </section>

      <section>
        <h2>Technical and hosting data</h2>
        <p>
          Hosting and content-delivery providers may process standard technical
          data such as IP address, browser type, requested pages and timestamps to
          deliver and secure the site.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          This site does not intentionally set marketing cookies through
          application code reviewed for this notice. Your browser and hosting
          platform may still use essential technical mechanisms required to
          deliver pages.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        {siteConfig.contactEmailVerified ? (
          <p>
            Email{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
            , or see the <Link href="/contact">contact page</Link>. If you email
            us, we process the content of your message and your email address in
            order to respond.
          </p>
        ) : (
          <p>
            See the <Link href="/contact">contact page</Link> for current ways to
            reach us. When a destination email is verified and published, messages
            sent to it will be processed in order to respond.
          </p>
        )}
      </section>

      <section>
        <h2>Updates</h2>
        <p>
          We may update this notice if the site’s functionality changes.
        </p>
      </section>
    </ContentPage>
  );
}
