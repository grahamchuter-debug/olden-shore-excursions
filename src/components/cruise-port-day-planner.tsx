"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  oldenPortDayPlannerConfig,
  calculatePortMinutes,
  formatPortDuration,
  getConfidenceTone,
  getReturnGuidance,
  getTierForPortMinutes,
  type CruisePortDayPlannerConfig,
} from "@/lib/cruise-port-day-planner";

type CruisePortDayPlannerProps = {
  config?: CruisePortDayPlannerConfig;
};

function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--norway-blue)]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function RecommendationCard({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  const className =
    "block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-snug text-slate-800 shadow-sm transition hover:border-[var(--norway-blue)] hover:shadow-md";

  if (href) {
    return (
      <Link href={href} className={`${className} font-medium text-[var(--norway-blue)]`}>
        {label}
        <span className="mt-1 block text-xs font-normal text-slate-500">
          View details →
        </span>
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}

export function CruisePortDayPlanner({
  config = oldenPortDayPlannerConfig,
}: CruisePortDayPlannerProps) {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  const result = useMemo(() => {
    if (!arrival || !departure) {
      return null;
    }

    const totalMinutes = calculatePortMinutes(arrival, departure);

    if (totalMinutes === null) {
      return { error: "Enter valid arrival and departure times." as const };
    }

    const tier = getTierForPortMinutes(totalMinutes, config.tiers);
    const returnGuidance = getReturnGuidance(departure);
    const confidenceTone = getConfidenceTone(tier.confidenceScore);

    return {
      totalMinutes,
      durationLabel: formatPortDuration(totalMinutes),
      tier,
      returnGuidance,
      confidenceTone,
    };
  }, [arrival, config.tiers, departure]);

  return (
    <section
      aria-labelledby="port-day-planner-heading"
      className="overflow-hidden rounded-2xl border border-slate-200 border-t-[3px] border-t-[var(--norway-blue)] bg-gradient-to-br from-slate-50 via-white to-[#f0f7fc] p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--norway-blue)]">
          Cruise planning tool
        </p>
        <h2
          id="port-day-planner-heading"
          className="!mt-2 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          {config.heading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          {config.subtitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {config.supportingCopy}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Arrival time</span>
          <input
            type="time"
            value={arrival}
            onChange={(event) => setArrival(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-[var(--norway-blue)] focus:outline-none focus:ring-2 focus:ring-[#0066b3]/20"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Departure time
          </span>
          <input
            type="time"
            value={departure}
            onChange={(event) => setDeparture(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-[var(--norway-blue)] focus:outline-none focus:ring-2 focus:ring-[#0066b3]/20"
          />
        </label>
      </div>

      {result ? (
        <div className="mt-6 space-y-4">
          {"error" in result ? (
            <div className="rounded-xl border border-red-200 bg-white/90 p-4 text-sm text-red-700">
              {result.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ResultCard title="Time in port">
                  <p className="text-3xl font-bold text-slate-900">
                    {result.durationLabel}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{result.tier.label}</p>
                </ResultCard>

                <ResultCard title="Confidence score">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${result.confidenceTone.badge}`}
                    >
                      {result.tier.confidenceScore}/100
                    </span>
                    <span className="text-lg font-semibold text-slate-900">
                      {result.tier.confidenceLabel}
                    </span>
                  </div>
                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
                    role="presentation"
                  >
                    <div
                      className={`h-full rounded-full transition-all ${result.confidenceTone.bar}`}
                      style={{
                        width: `${result.tier.confidenceScore}%`,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {result.tier.confidenceMessage}
                  </p>
                </ResultCard>
              </div>

              <ResultCard title="Return buffer guidance">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Ship departure time
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-slate-900">
                      {result.returnGuidance.departureLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Recommended return to port
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-[var(--norway-blue)]">
                      {result.returnGuidance.recommendedReturn ?? "Not set"}
                    </dd>
                    <dd className="text-xs text-slate-500">45 minutes before departure</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Latest comfortable return
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-slate-900">
                      {result.returnGuidance.latestComfortableReturn ?? "Not set"}
                    </dd>
                    <dd className="text-xs text-slate-500">30 minutes before departure</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {config.returnBufferNote}
                </p>
              </ResultCard>

              <ResultCard title="Recommended excursions">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {result.tier.excursions.map((excursion) => (
                    <li key={excursion.label}>
                      <RecommendationCard
                        label={excursion.label}
                        href={excursion.href}
                      />
                    </li>
                  ))}
                </ul>
                {result.tier.conversionNote ? (
                  <p className="mt-4 rounded-lg border border-slate-200 border-l-[3px] border-l-[var(--norway-red)] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    {result.tier.conversionNote}
                  </p>
                ) : null}
              </ResultCard>

              <ResultCard title={`Suggested ${config.portName} day plan`}>
                <ol className="space-y-2">
                  {result.tier.dayPlan.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-3 text-sm leading-6 text-slate-700 sm:text-base"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f4fc] text-xs font-semibold text-[var(--norway-blue)]">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </ResultCard>
            </>
          )}
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-600">
          Add your ship&apos;s arrival and departure times to see your confidence
          score, return guidance, and excursion recommendations.
        </p>
      )}
    </section>
  );
}
