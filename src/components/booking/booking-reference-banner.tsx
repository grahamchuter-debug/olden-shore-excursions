"use client";

import { useEffect, useState } from "react";

import { siteConfig } from "@/lib/site-config";

export function BookingReferenceBanner() {
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("ref");
    if (raw && /^W2ODE-[A-Z0-9]+$/i.test(raw)) {
      setReference(raw.toUpperCase());
    }
  }, []);

  if (reference) {
    return (
      <p>
        Booking reference: <strong>{reference}</strong>
      </p>
    );
  }

  return (
    <p>
      Your booking reference will appear in your confirmation emails. If you have
      questions, contact{" "}
      <a className="content-link" href={`mailto:${siteConfig.contactEmail}`}>
        {siteConfig.contactEmail}
      </a>
      .
    </p>
  );
}
