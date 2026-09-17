"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  getOldenBookingsApiUrl,
  isOldenBookingTestUiEnabled,
  isPublicBookingEnabled,
  oldenCommercialConfig,
} from "@/lib/booking/commercial-config";
import {
  formatScheduleDate,
  getOldenEntriesForDate,
  normalizeIsoDate,
  scheduleDisclaimer,
  scheduleEntryKey,
  slugifyShipName,
  type OldenScheduleEntry,
} from "@/lib/olden-schedules";
import { siteConfig } from "@/lib/site-config";
import { formatOldenChildSeatRequestNotes } from "../../../shared/destinations/olden-products";
import {
  composeE164Phone,
  DEFAULT_PHONE_DIAL_CODE,
  openNativeDatePicker,
  PHONE_DIAL_OPTIONS,
} from "../../../shared/world-booking";

const PRODUCT = oldenCommercialConfig.products["briksdal-glacier-olden-lake"];

type Step = "cruise" | "guests" | "details" | "review";

type ChildSeatRow = {
  age: string;
  height: string;
  weight: string;
  note: string;
};

type ShipChoice = "schedule" | "custom";

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

const STEPS: { id: Step; label: string }[] = [
  { id: "cruise", label: "Date / cruise" },
  { id: "guests", label: "Guests" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
];

export function BriksdalBookingForm() {
  const bookingLive = isPublicBookingEnabled(PRODUCT.publicBookingStatus);
  const testUi = isOldenBookingTestUiEnabled();
  const apiUrl = getOldenBookingsApiUrl();

  const [step, setStep] = useState<Step>("cruise");
  const [excursionDate, setExcursionDate] = useState("");
  const [shipChoice, setShipChoice] = useState<ShipChoice>("schedule");
  const [selectedShipKey, setSelectedShipKey] = useState("");
  const [customShipName, setCustomShipName] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [seatNeeded, setSeatNeeded] = useState<"no" | "yes">("no");
  const [seatRows, setSeatRows] = useState<ChildSeatRow[]>([
    { age: "", height: "", weight: "", note: "" },
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDial, setPhoneDial] = useState(DEFAULT_PHONE_DIAL_CODE);
  const [phoneNational, setPhoneNational] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState("");
  const [walkingAck, setWalkingAck] = useState(false);
  const [leadAdultAck, setLeadAdultAck] = useState(false);
  const [requestAck, setRequestAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheduleShips: OldenScheduleEntry[] = useMemo(
    () => (excursionDate ? getOldenEntriesForDate(excursionDate) : []),
    [excursionDate],
  );

  const selectedScheduleShip = scheduleShips.find(
    (entry) => scheduleEntryKey(entry) === selectedShipKey,
  );

  const shipName =
    shipChoice === "custom"
      ? customShipName.trim()
      : selectedScheduleShip?.ship.trim() || "";

  const cruiseLine =
    shipChoice === "schedule" ? selectedScheduleShip?.cruiseLine || "" : "";
  const scheduleMatched = shipChoice === "schedule" && Boolean(selectedScheduleShip);
  const distinctScheduleShipCount = useMemo(
    () => new Set(scheduleShips.map((entry) => entry.ship.trim())).size,
    [scheduleShips],
  );

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
      return formatOldenChildSeatRequestNotes([{ required: false }]);
    }
    return formatOldenChildSeatRequestNotes(
      seatRows.map((row) => ({
        required: true,
        ageYears: row.age.trim() ? Number(row.age) : null,
        heightCm: row.height.trim() ? Number(row.height) || null : null,
        weightKg: row.weight.trim() ? Number(row.weight) || null : null,
        notes: row.note.trim() || null,
      })),
    );
  }, [youngCount, seatNeeded, seatRows]);

  function go(next: Step) {
    setError(null);
    setStep(next);
  }

  function validateCruise(): string | null {
    if (!excursionDate) return "Please choose your excursion date.";
    if (excursionDate < todayIsoDate()) return "Please choose a future excursion date.";
    if (shipChoice === "schedule") {
      if (!scheduleShips.length) {
        return "We don’t have a published ship call for that date — choose “My ship isn’t listed” and enter the name.";
      }
      if (!selectedScheduleShip) return "Please select which ship you are sailing on.";
    } else if (!customShipName.trim()) {
      return "Please enter your cruise ship name.";
    }
    return null;
  }

  function validateGuests(): string | null {
    if (underAdult) return "Please include at least one adult (12+).";
    if (overCapacity) {
      return `Online requests are limited to ${PRODUCT.maxGuests} guests. ${oldenCommercialConfig.overTenGuidance}`;
    }
    if (youngCount > 0 && seatNeeded === "yes") {
      const incomplete = seatRows.some((row) => !row.age.trim());
      if (incomplete) return "Please enter the age for each child needing a seat.";
    }
    return null;
  }

  function validateDetails(): string | null {
    if (!name.trim() || !email.trim()) {
      return "Please complete your contact details.";
    }
    if (!composeE164Phone(phoneDial, phoneNational)) {
      return "Please choose your country code and enter a valid Mobile / WhatsApp number.";
    }
    return null;
  }

  function onContinueFromCruise() {
    const message = validateCruise();
    if (message) {
      setError(message);
      return;
    }
    go("guests");
  }

  function onContinueFromGuests() {
    const message = validateGuests();
    if (message) {
      setError(message);
      return;
    }
    go("details");
  }

  function onContinueFromDetails() {
    const message = validateDetails();
    if (message) {
      setError(message);
      return;
    }
    go("review");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!bookingLive) {
      setError(
        `Online requests are not open yet. Email ${oldenCommercialConfig.email} and we will help you manually.`,
      );
      return;
    }

    const cruiseError = validateCruise();
    if (cruiseError) {
      setError(cruiseError);
      setStep("cruise");
      return;
    }
    const guestsError = validateGuests();
    if (guestsError) {
      setError(guestsError);
      setStep("guests");
      return;
    }
    const detailsError = validateDetails();
    if (detailsError) {
      setError(detailsError);
      setStep("details");
      return;
    }
    if (!walkingAck) {
      setError(
        "Please acknowledge the walking requirements before continuing to payment.",
      );
      return;
    }
    if (!leadAdultAck || !requestAck) {
      setError("Please confirm the lead-traveller and request acknowledgements.");
      return;
    }

    const operationalNotes = [
      walkingAck ? "Walking suitability acknowledged: yes" : "",
      seatNotesBlock,
      notes.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    if (!apiUrl) {
      setError(
        `Online checkout is locked for this build. Email ${oldenCommercialConfig.email} for help.`,
      );
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${apiUrl}/api/bookings/checkout`, {
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
            shipName,
            shipSlug: scheduleMatched ? slugifyShipName(shipName) : "not-listed",
            cruiseLine,
            isCustomShip: !scheduleMatched,
            scheduleMatched,
          },
          guests: { adults, children, infants },
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: composeE164Phone(phoneDial, phoneNational) || "",
            operationalNotes: operationalNotes || undefined,
          },
          confirmationAcknowledged: requestAck,
          eligibilityAcknowledged: walkingAck,
          clientDisplayedTotalCents: Math.round(totalEur * 100),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        url?: string;
        checkoutUrl?: string;
        message?: string;
        error?: string;
        code?: string;
        reference?: string;
      } | null;

      const checkoutUrl = payload?.url || payload?.checkoutUrl;
      if (!response.ok || !checkoutUrl) {
        setError(
          payload?.message ||
            payload?.error ||
            "We could not start checkout. Please try again or contact us.",
        );
        setBusy(false);
        return;
      }

      window.location.href = checkoutUrl;
    } catch {
      setError("Network error starting checkout. Please try again or contact us.");
      setBusy(false);
    }
  }

  function onDateChange(value: string) {
    const iso = normalizeIsoDate(value) || value.trim();
    setExcursionDate(iso);
    setSelectedShipKey("");
    const ships = iso ? getOldenEntriesForDate(iso) : [];
    if (ships.length === 1) {
      const only = ships[0]!;
      setShipChoice("schedule");
      setSelectedShipKey(scheduleEntryKey(only));
    } else if (ships.length === 0) {
      setShipChoice("custom");
    } else {
      setShipChoice("schedule");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {testUi ? (
        <div
          role="status"
          className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-950"
        >
          <p className="font-semibold">TEST booking UI</p>
          <p className="mt-1">
            Checkout targets the isolated TEST Worker only. This mode is not used
            by normal production builds.
          </p>
        </div>
      ) : null}

      {bookingLive ? (
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-800"
        >
          <p className="font-semibold">Secure online booking request</p>
          <p className="mt-2">
            Choose your cruise date and guests and pay securely online. We&apos;ll
            confirm your excursion with our local operator and email your final
            confirmation. If we&apos;re unable to confirm your booking, you&apos;ll
            receive a full refund.
          </p>
        </div>
      ) : (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950"
        >
          <p className="font-semibold">Online booking is not available in this build</p>
          <p className="mt-2">
            You can review prices and requirements below. For help, email{" "}
            <a
              className="font-medium underline"
              href={`mailto:${oldenCommercialConfig.email}?subject=Briksdal%20Glacier%20request`}
            >
              {oldenCommercialConfig.email}
            </a>
            .
          </p>
        </div>
      )}

      <nav aria-label="Booking steps" className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
        {STEPS.map((item, index) => {
          const active = item.id === step;
          const currentIndex = STEPS.findIndex((s) => s.id === step);
          const done = index < currentIndex;
          return (
            <button
              key={item.id}
              type="button"
              disabled={!done && !active}
              onClick={() => {
                if (done) go(item.id);
              }}
              className={`rounded-full px-3 py-1.5 ${
                active
                  ? "bg-[var(--norway-blue)] text-white"
                  : done
                    ? "bg-slate-200 text-slate-800"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {index + 1}. {item.label}
            </button>
          );
        })}
      </nav>

      {step === "cruise" ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">1. Date / cruise</h2>
          <p className="text-sm text-slate-600">{scheduleDisclaimer}</p>
          <label className="block text-sm font-medium text-slate-800">
            Excursion date
            <input
              ref={dateInputRef}
              type="date"
              required
              min={todayIsoDate()}
              value={excursionDate}
              onChange={(e) => onDateChange(e.target.value)}
              onClick={(e) => openNativeDatePicker(e.currentTarget, { clickFallback: false })}
              onFocus={(e) => openNativeDatePicker(e.currentTarget, { clickFallback: false })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          {excursionDate ? (
            <div className="space-y-3">
              {scheduleShips.length > 0 ? (
                <>
                  <p className="text-sm font-medium text-slate-800">
                    {distinctScheduleShipCount > 1
                      ? "Which ship are you sailing on?"
                      : "Select your cruise ship"}
                  </p>
                  <p className="text-sm text-slate-600">
                    We&apos;ve matched the cruise ships visiting Olden on{" "}
                    {formatScheduleDate(excursionDate)}. Select yours below.
                  </p>
                  <div className="space-y-2" role="radiogroup" aria-label="Cruise ship">
                    {scheduleShips.map((entry) => {
                      const key = scheduleEntryKey(entry);
                      return (
                        <label
                          key={key}
                          className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
                        >
                          <input
                            type="radio"
                            name="ship"
                            checked={shipChoice === "schedule" && selectedShipKey === key}
                            onChange={() => {
                              setShipChoice("schedule");
                              setSelectedShipKey(key);
                            }}
                            className="mt-1"
                          />
                          <span>
                            <strong>
                              {distinctScheduleShipCount === 1 ? `Cruise ship: ${entry.ship}` : entry.ship}
                            </strong>
                            {entry.cruiseLine ? ` · ${entry.cruiseLine}` : ""}
                            <br />
                            <span className="text-slate-600">
                              In {entry.arrival} · Out {entry.departure}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-600">
                  We don&apos;t currently have a published ship call for this date.
                  Enter your ship name below and we&apos;ll verify it with your booking.
                </p>
              )}

              <label className="flex items-start gap-3 text-sm text-slate-800">
                <input
                  type="radio"
                  name="ship"
                  checked={shipChoice === "custom"}
                  onChange={() => setShipChoice("custom")}
                  className="mt-1"
                />
                <span className="w-full">
                  My ship isn&apos;t listed
                  <input
                    type="text"
                    value={customShipName}
                    disabled={shipChoice !== "custom"}
                    onChange={(e) => setCustomShipName(e.target.value)}
                    placeholder="e.g. Regal Princess"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-50"
                  />
                </span>
              </label>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={onContinueFromCruise}>
              Continue to guests
            </button>
            <Link href={PRODUCT.productPath} className="btn-outline-dark">
              Back to excursion
            </Link>
          </div>
        </section>
      ) : null}

      {step === "guests" ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">2. Guests</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium text-slate-800">
              Adults 12+ — {formatEuro(PRODUCT.adultEur)}
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
              Children 3–11 — {formatEuro(PRODUCT.childEur)}
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
              Infants 0–2 — FREE
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
            Party total: <strong>{partyTotal}</strong> / {PRODUCT.maxGuests} · Total:{" "}
            <strong>{formatEuro(totalEur)}</strong> EUR
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

          {youngCount > 0 ? (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-surface-muted p-4">
              <h3 className="text-base font-bold text-slate-900">Child / booster seat</h3>
              <p className="text-sm text-slate-600">
                Optional request passed to the local operator. It does not change the
                price.
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
                      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"
                    >
                      <label className="text-sm font-medium">
                        Child age (years)
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
                        Approx. height (cm)
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
                        Approx. weight (kg)
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
                    setSeatRows([...seatRows, { age: "", height: "", weight: "", note: "" }])
                  }
                >
                  Add another child seat request
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-outline-dark" onClick={() => go("cruise")}>
              Back
            </button>
            <button type="button" className="btn-primary" onClick={onContinueFromGuests}>
              Continue to details
            </button>
          </div>
        </section>
      ) : null}

      {step === "details" ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. Your details</h2>
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
            <label className="block text-sm font-medium text-slate-800 sm:col-span-2">
              Mobile / WhatsApp
              <span className="mt-1 flex flex-col gap-2 sm:flex-row">
                <select
                  required
                  aria-label="Country dial code"
                  value={phoneDial}
                  onChange={(e) => setPhoneDial(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 sm:max-w-[14rem]"
                >
                  {PHONE_DIAL_OPTIONS.map((option) => (
                    <option key={`${option.iso}-${option.dial}`} value={option.dial}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="Local mobile number"
                  value={phoneNational}
                  onChange={(e) => setPhoneNational(e.target.value)}
                  className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-2"
                />
              </span>
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Include your country code so we can reach you on Mobile / WhatsApp. Stored as an
                international number (for example +447700900123).
              </span>
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
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-outline-dark" onClick={() => go("guests")}>
              Back
            </button>
            <button type="button" className="btn-primary" onClick={onContinueFromDetails}>
              Continue to review
            </button>
          </div>
        </section>
      ) : null}

      {step === "review" ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-surface-muted p-5">
          <h2 className="text-xl font-bold text-slate-900">4. Review &amp; request</h2>
          <p className="text-sm text-slate-600">
            Payment receives your request — it does not confirm the excursion.
            Confirmation is emailed separately after we arrange your places.
          </p>
          <dl className="grid gap-3 text-sm text-slate-800 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-500">Excursion</dt>
              <dd>
                {PRODUCT.name} · {PRODUCT.durationLabel}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Date</dt>
              <dd>{excursionDate ? formatScheduleDate(excursionDate) : "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Cruise ship</dt>
              <dd>
                {shipName || "—"}
                {cruiseLine ? ` · ${cruiseLine}` : ""}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Guests</dt>
              <dd>
                {adults} adult · {children} child · {infants} infant
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Price breakdown</dt>
              <dd>
                Adults {adults} × {formatEuro(PRODUCT.adultEur)}
                <br />
                Children {children} × {formatEuro(PRODUCT.childEur)}
                <br />
                Infants {infants} × FREE
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Total (EUR)</dt>
              <dd className="text-lg font-bold">{formatEuro(totalEur)}</dd>
            </div>
          </dl>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>{oldenCommercialConfig.cancellation}</li>
            <li>{oldenCommercialConfig.paymentNotConfirmation}</li>
            <li>{oldenCommercialConfig.unableToConfirm}</li>
          </ul>

          <label className="flex items-start gap-3 text-sm text-slate-800">
            <input
              type="checkbox"
              className="mt-1"
              checked={walkingAck}
              onChange={(e) => setWalkingAck(e.target.checked)}
            />
            <span>
              <strong>Walking suitability:</strong> I understand this excursion
              includes about 45–60 minutes walking towards the glacier viewpoint,
              with the first section the most challenging, and that suitable
              footwear and weather clothing are recommended.
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
          <label className="flex items-start gap-3 text-sm text-slate-800">
            <input
              type="checkbox"
              className="mt-1"
              checked={requestAck}
              onChange={(e) => setRequestAck(e.target.checked)}
            />
            <span>
              I understand payment takes my request and does not confirm the
              excursion. Confirmation will be emailed separately when my places
              are confirmed. If the excursion cannot be confirmed, the amount paid
              will be refunded in full to my original payment method.
            </span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-outline-dark" onClick={() => go("details")}>
              Back
            </button>
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
            <Link href={`mailto:${siteConfig.contactEmail}`} className="btn-outline-dark">
              Email {siteConfig.contactEmail}
            </Link>
          </div>
        </section>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </form>
  );
}
