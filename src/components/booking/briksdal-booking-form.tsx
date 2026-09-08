"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  isPublicBookingEnabled,
  oldenCommercialConfig,
} from "@/lib/booking/commercial-config";
import { siteConfig } from "@/lib/site-config";

const PRODUCT = oldenCommercialConfig.products["briksdal-glacier-olden-lake"];

type ChildSeatRow = {
  age: string;
  height: string;
  weight: string;
  note: string;
};

function formatEuro(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BriksdalBookingForm() {
  const bookingLive = isPublicBookingEnabled(PRODUCT.publicBookingStatus);
  const [excursionDate, setExcursionDate] = useState("");
  const [shipName, setShipName] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [seatNeeded, setSeatNeeded] = useState<"no" | "yes">("no");
  const [seatRows, setSeatRows] = useState<ChildSeatRow[]>([
    { age: "", height: "", weight: "", note: "" },
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [walkingAck, setWalkingAck] = useState(false);
  const [leadAdultAck, setLeadAdultAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const youngCount = children + infants;
  const partyTotal = adults + children + infants;
  const totalEur =
    adults * PRODUCT.adultEur +
    children * PRODUCT.childEur +
    infants * PRODUCT.infantEur;

  const overCapacity = partyTotal > PRODUCT.maxGuests;
  const underAdult = adults < 1;

  const seatNotesBlock = useMemo(() => {
    if (youngCount === 0) return "";
    if (seatNeeded !== "yes") {
      return "Child seat / booster request: NO — no child or booster seat requested.";
    }
    const lines = [
      "Child seat / booster request: YES — pass to local operator; subject to operator confirmation.",
    ];
    seatRows.forEach((row, index) => {
      lines.push(
        `  Child ${index + 1}: age ${row.age || "n/a"} · height ${row.height || "n/a"} · weight ${row.weight || "n/a"}${row.note ? ` · ${row.note}` : ""}`,
      );
    });
    return lines.join("\n");
  }, [youngCount, seatNeeded, seatRows]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!bookingLive) {
      setError(
        `Online requests are not open yet. Email ${oldenCommercialConfig.email} and we will help you manually.`,
      );
      return;
    }
    if (underAdult) {
      setError("Please include at least one adult (12+).");
      return;
    }
    if (overCapacity) {
      setError(
        `Online requests are limited to ${PRODUCT.maxGuests} guests. ${oldenCommercialConfig.overTenGuidance}`,
      );
      return;
    }
    if (!excursionDate || !shipName.trim()) {
      setError("Please enter your excursion date and cruise ship.");
      return;
    }
    if (excursionDate < todayIsoDate()) {
      setError("Please choose a future excursion date.");
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please complete your contact details.");
      return;
    }
    if (!walkingAck || !leadAdultAck) {
      setError("Please confirm the walking suitability and lead-traveller acknowledgements.");
      return;
    }
    if (youngCount > 0 && seatNeeded === "yes") {
      const incomplete = seatRows.some((row) => !row.age.trim());
      if (incomplete) {
        setError("Please enter the age for each child needing a seat.");
        return;
      }
    }

    const operationalNotes = [seatNotesBlock, notes.trim()]
      .filter(Boolean)
      .join("\n\n");

    setBusy(true);
    try {
      const response = await fetch(
        `${oldenCommercialConfig.bookingsApiUrl}/api/bookings/checkout`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "idempotency-key": crypto.randomUUID(),
          },
          body: JSON.stringify({
            productId: PRODUCT.productId,
            bookingSessionId: crypto.randomUUID(),
            cruise: {
              date: excursionDate,
              shipName: shipName.trim(),
              shipSlug: "not-listed",
              cruiseLine: "",
              isCustomShip: true,
              scheduleMatched: false,
            },
            guests: { adults, children, infants },
            customer: {
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              operationalNotes: operationalNotes || undefined,
            },
            confirmationAcknowledged: true,
            eligibilityAcknowledged: walkingAck,
            clientDisplayedTotalCents: Math.round(totalEur * 100),
          }),
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        url?: string;
        message?: string;
        error?: string;
        reference?: string;
      } | null;

      if (!response.ok || !payload?.url) {
        setError(
          payload?.message ||
            payload?.error ||
            "We could not start checkout. Please try again or contact us.",
        );
        setBusy(false);
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError("Network error starting checkout. Please try again or contact us.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {!bookingLive ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950"
        >
          <p className="font-semibold">Online request checkout is production-locked</p>
          <p className="mt-2">
            You can review prices and requirements below. Live card payment is not
            enabled yet. For the June 2027 enquiry (or any date), email{" "}
            <a
              className="font-medium underline"
              href={`mailto:${oldenCommercialConfig.email}?subject=Briksdal%20Glacier%20request`}
            >
              {oldenCommercialConfig.email}
            </a>{" "}
            and we will arrange it manually.
          </p>
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">1. Cruise details</h2>
        <p className="text-sm text-slate-600">
          Ship schedule data helps planning only. It does not prove excursion
          availability.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-800">
            Excursion date
            <input
              type="date"
              required
              min={todayIsoDate()}
              value={excursionDate}
              onChange={(e) => setExcursionDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Cruise ship
            <input
              type="text"
              required
              value={shipName}
              onChange={(e) => setShipName(e.target.value)}
              placeholder="e.g. Regal Princess"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">2. Guests</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-medium text-slate-800">
            Adults (12+) · {formatEuro(PRODUCT.adultEur)}
            <input
              type="number"
              min={1}
              max={PRODUCT.maxGuests}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Children (3–11) · {formatEuro(PRODUCT.childEur)}
            <input
              type="number"
              min={0}
              max={PRODUCT.maxGuests}
              value={children}
              onChange={(e) => setChildren(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Infants (0–2) · FREE
            <input
              type="number"
              min={0}
              max={PRODUCT.maxGuests}
              value={infants}
              onChange={(e) => setInfants(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
        <p className="text-sm text-slate-600">
          Party total: <strong>{partyTotal}</strong> / {PRODUCT.maxGuests} · Estimated
          total <strong>{formatEuro(totalEur)}</strong>
        </p>
        {overCapacity ? (
          <p className="text-sm text-red-700">
            {oldenCommercialConfig.overTenGuidance}{" "}
            <Link href="/contact" className="content-link">
              Contact us
            </Link>
            .
          </p>
        ) : null}
      </section>

      {youngCount > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. Child / booster seat</h2>
          <p className="text-sm text-slate-600">
            Does any child in your party require a child or booster seat? We pass
            this request to the local operator when arranging your excursion. Child
            and booster seats are subject to operator confirmation.
          </p>
          <div className="flex gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="seat"
                checked={seatNeeded === "no"}
                onChange={() => setSeatNeeded("no")}
              />
              No
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="seat"
                checked={seatNeeded === "yes"}
                onChange={() => setSeatNeeded("yes")}
              />
              Yes
            </label>
          </div>
          {seatNeeded === "yes"
            ? seatRows.map((row, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border border-slate-200 bg-surface-muted p-4 sm:grid-cols-2"
                >
                  <label className="text-sm font-medium">
                    Child age
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={row.age}
                      onChange={(e) => {
                        const next = [...seatRows];
                        next[index] = { ...row, age: e.target.value };
                        setSeatRows(next);
                      }}
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Approx. height
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={row.height}
                      onChange={(e) => {
                        const next = [...seatRows];
                        next[index] = { ...row, height: e.target.value };
                        setSeatRows(next);
                      }}
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Approx. weight
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={row.weight}
                      onChange={(e) => {
                        const next = [...seatRows];
                        next[index] = { ...row, weight: e.target.value };
                        setSeatRows(next);
                      }}
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Seat note (optional)
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={row.note}
                      onChange={(e) => {
                        const next = [...seatRows];
                        next[index] = { ...row, note: e.target.value };
                        setSeatRows(next);
                      }}
                    />
                  </label>
                </div>
              ))
            : null}
          {seatNeeded === "yes" && seatRows.length < youngCount ? (
            <button
              type="button"
              className="text-sm font-medium text-[var(--norway-blue)]"
              onClick={() =>
                setSeatRows([
                  ...seatRows,
                  { age: "", height: "", weight: "", note: "" },
                ])
              }
            >
              Add another child seat request
            </button>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {youngCount > 0 ? "4" : "3"}. Your details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-800 sm:col-span-2">
            Lead traveller full name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Mobile / WhatsApp
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800 sm:col-span-2">
            Notes / special requirements (optional)
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-surface-muted p-5">
        <h2 className="text-xl font-bold text-slate-900">
          {youngCount > 0 ? "5" : "4"}. Review
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>
            {PRODUCT.name} · {PRODUCT.durationLabel}
          </li>
          <li>
            {adults} adult · {children} child · {infants} infant ·{" "}
            {formatEuro(totalEur)}
          </li>
          <li>Approximately 45–60 minutes walking; first section most challenging</li>
          <li>{oldenCommercialConfig.cancellation}</li>
          <li>{oldenCommercialConfig.paymentNotConfirmation}</li>
        </ul>
        <label className="flex items-start gap-3 text-sm text-slate-800">
          <input
            type="checkbox"
            className="mt-1"
            checked={walkingAck}
            onChange={(e) => setWalkingAck(e.target.checked)}
          />
          <span>
            I understand this excursion includes about 45–60 minutes walking towards
            the glacier viewpoint, with the first section the most challenging, and
            that suitable footwear and weather clothing are recommended.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-slate-800">
          <input
            type="checkbox"
            className="mt-1"
            checked={leadAdultAck}
            onChange={(e) => setLeadAdultAck(e.target.checked)}
          />
          <span>
            I confirm the lead traveller is aged 18 or over and will be responsible
            for this request.
          </span>
        </label>
      </section>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy || overCapacity || underAdult || !bookingLive}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy
            ? "Starting checkout…"
            : bookingLive
              ? `Pay ${formatEuro(totalEur)} & request`
              : "Online checkout locked"}
        </button>
        <Link href={PRODUCT.productPath} className="btn-outline-dark">
          Back to excursion notes
        </Link>
        <Link href={`mailto:${siteConfig.contactEmail}`} className="btn-outline-dark">
          Email {siteConfig.contactEmail}
        </Link>
      </div>
    </form>
  );
}
