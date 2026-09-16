"use client";

import { useEffect, useState } from "react";

import { getOldenBookingsApiUrl } from "@/lib/booking/commercial-config";
import { siteConfig } from "@/lib/site-config";

type PaymentView =
  | { kind: "loading" }
  | { kind: "paid"; reference: string }
  | { kind: "pending"; reference: string | null }
  | { kind: "reference_only"; reference: string }
  | { kind: "missing" };

/**
 * Shows booking reference and payment state from the bookings Worker.
 * Landing on the success URL alone is not treated as verified payment —
 * we require Stripe/session or D1 payment_status=paid from the API.
 */
export function BookingReferenceBanner() {
  const [view, setView] = useState<PaymentView>({ kind: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawRef = params.get("ref");
    const sessionId = params.get("session_id")?.trim() || "";
    const reference =
      rawRef && /^W2ODE-[A-Z0-9]+$/i.test(rawRef) ? rawRef.toUpperCase() : null;

    const apiUrl = getOldenBookingsApiUrl();
    if (!apiUrl || (!sessionId && !reference)) {
      setView(reference ? { kind: "reference_only", reference } : { kind: "missing" });
      return;
    }

    const query = new URLSearchParams();
    if (sessionId.startsWith("cs_")) query.set("session_id", sessionId);
    if (reference) query.set("ref", reference);

    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const response = await fetch(`${apiUrl}/api/bookings/session?${query.toString()}`);
        const payload = (await response.json().catch(() => null)) as {
          ok?: boolean;
          stripePaid?: boolean;
          payment_status?: string | null;
          reference?: string | null;
          bookingFinalised?: boolean;
        } | null;

        if (cancelled) return;

        const paid =
          Boolean(payload?.ok) &&
          (payload?.stripePaid === true ||
            payload?.payment_status === "paid" ||
            payload?.bookingFinalised === true);
        const resolvedRef = (payload?.reference || reference || "").toUpperCase() || null;

        if (paid && resolvedRef) {
          setView({ kind: "paid", reference: resolvedRef });
          return;
        }

        if (attempts < 8) {
          setView({ kind: "pending", reference: resolvedRef });
          window.setTimeout(poll, 1500);
          return;
        }

        if (resolvedRef) {
          setView({ kind: "pending", reference: resolvedRef });
        } else {
          setView({ kind: "missing" });
        }
      } catch {
        if (cancelled) return;
        if (attempts < 8) {
          window.setTimeout(poll, 1500);
          return;
        }
        setView(reference ? { kind: "reference_only", reference } : { kind: "missing" });
      }
    }

    void poll();
    return () => {
      cancelled = true;
    };
  }, []);

  if (view.kind === "loading") {
    return (
      <p>
        Confirming your payment with our payment provider. Your excursion is not
        confirmed yet.
      </p>
    );
  }

  if (view.kind === "paid") {
    return (
      <div className="space-y-2">
        <p>
          Booking reference: <strong>{view.reference}</strong>
        </p>
        <p>
          Payment received and booking request received. We&apos;ll confirm your
          excursion with our local operator and email your final confirmation.
        </p>
      </div>
    );
  }

  if (view.kind === "pending") {
    return (
      <div className="space-y-2">
        {view.reference ? (
          <p>
            Booking reference: <strong>{view.reference}</strong>
          </p>
        ) : null}
        <p>
          We&apos;re still confirming payment with our provider. Keep this page and
          your email — your excursion is not confirmed until we email confirmation
          separately.
        </p>
      </div>
    );
  }

  if (view.kind === "reference_only") {
    return (
      <p>
        Booking reference: <strong>{view.reference}</strong>. Keep this reference
        from your payment confirmation. If you have questions, contact{" "}
        <a className="content-link" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    );
  }

  return (
    <p>
      Keep your booking reference from the payment confirmation screen. If you
      have questions, contact{" "}
      <a className="content-link" href={`mailto:${siteConfig.contactEmail}`}>
        {siteConfig.contactEmail}
      </a>
      .
    </p>
  );
}
