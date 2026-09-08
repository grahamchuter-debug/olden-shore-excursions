import type { BookableProductConfig, BookingCruiseContext, DestinationBookingCore, GuestCounts } from "./types";
import { CUSTOMER_EMAIL } from "./copy";
import {
  firstNameFromFullName,
  formatHumanBookingDate,
  type BookingSummaryRow,
  type CustomerEmailShellInput,
  type EmailStatusTone,
  type OpsEmailShellInput,
} from "./email-shell";
import { partySize, usesFlatGuestPricing } from "./pricing";

export type RequestReceiptContent = {
  subject: string;
  customerHeading: string;
  bodyLines: string[];
  shell: CustomerEmailShellInput;
};

export type OperationalRequestEmail = {
  subject: string;
  body: string;
  shell: OpsEmailShellInput;
};

export function guestCommunicationLines(product: BookableProductConfig, guests: GuestCounts): string[] {
  if (usesFlatGuestPricing(product)) {
    const n = partySize(guests);
    return [`Guests: ${n}`];
  }
  return [
    `Adults: ${guests.adults}`,
    `Children: ${guests.children}`,
    `Infants: ${guests.infants}`,
  ];
}

export function guestCountLabel(product: BookableProductConfig, guests: GuestCounts): string {
  if (usesFlatGuestPricing(product)) {
    const n = partySize(guests);
    return n === 1 ? "1 guest" : `${n} guests`;
  }
  const parts = [
    guests.adults ? `${guests.adults} adult${guests.adults === 1 ? "" : "s"}` : null,
    guests.children ? `${guests.children} child${guests.children === 1 ? "" : "ren"}` : null,
    guests.infants ? `${guests.infants} infant${guests.infants === 1 ? "" : "s"}` : null,
  ].filter(Boolean);
  return parts.join(", ") || "0 guests";
}

function customerBrand(brand: CustomerEmailShellInput["brand"]): CustomerEmailShellInput["brand"] {
  return brand;
}

function destinationBrandFromCore(core: Pick<DestinationBookingCore, "siteName" | "siteUrl" | "bookingEmail" | "contactPath">): CustomerEmailShellInput["brand"] {
  return {
    siteName: core.siteName,
    siteUrl: core.siteUrl,
    bookingEmail: core.bookingEmail,
    contactPath: core.contactPath,
  };
}

export { destinationBrandFromCore };

/**
 * Avoid awkward greetings when the lead name starts with the brand word
 * (e.g. "Olden Test Guest" → not "Thanks Olden").
 */
export function customerGreetingFirstName(
  fullName: string | undefined,
  brandSiteName: string,
): string {
  const first = firstNameFromFullName(fullName ?? "");
  if (first === "there") return "there";
  const brandLead = brandSiteName.trim().split(/\s+/)[0]?.toLowerCase();
  if (brandLead && first.toLowerCase() === brandLead) return "there";
  return first;
}

function thanksReceivedLine(fullName: string | undefined, brandSiteName: string): string {
  const first = customerGreetingFirstName(fullName, brandSiteName);
  if (first === "there") return "Thanks — we've received your request and payment.";
  return `Thanks ${first}. We've received your request and payment.`;
}

function confirmedIntroLine(fullName: string | undefined, brandSiteName: string): string {
  const first = customerGreetingFirstName(fullName, brandSiteName);
  if (first === "there") return "Great news — your places are confirmed.";
  return `Great news, ${first} — your places are confirmed.`;
}

function baseSummaryRows(input: {
  reference: string;
  productName: string;
  cruise: BookingCruiseContext;
  guestsLabel: string;
  amountLabel?: string;
}): BookingSummaryRow[] {
  const rows: BookingSummaryRow[] = [
    { label: "Booking reference", value: input.reference },
    { label: "Excursion", value: input.productName },
    { label: "Cruise date", value: formatHumanBookingDate(input.cruise.date) },
    { label: "Cruise ship", value: input.cruise.shipName },
    { label: "Guests", value: input.guestsLabel },
  ];
  if (input.amountLabel) {
    rows.push({ label: "Amount paid", value: input.amountLabel });
  }
  return rows;
}

function productFulfilmentMode(
  product: BookableProductConfig,
): "DIRECT_SUPPLIER_MANUAL" | "SEG_MANUAL" | "UNKNOWN" {
  const notes = (product.supplierReferenceNotes ?? []).join(" ");
  if (/DIRECT_SUPPLIER_MANUAL/i.test(notes)) return "DIRECT_SUPPLIER_MANUAL";
  if (/SEG_MANUAL|SEG_FULFILMENT|SEG affiliate/i.test(notes)) return "SEG_MANUAL";
  return "UNKNOWN";
}

function opsActionSteps(
  mode: ReturnType<typeof productFulfilmentMode>,
  override?: string[],
): string[] {
  if (override?.length) return override;
  if (mode === "DIRECT_SUPPLIER_MANUAL") {
    return [
      "Place the corresponding booking manually with the direct supplier using the INTERNAL supply reference (do not share supplier portals or costs with the customer).",
      "When supplier confirmation is obtained, confirm this booking in the operator portal (payment alone is not confirmation).",
      "If unavailable, decline and refund the customer in full to the original payment method.",
    ];
  }
  return [
    "Place the corresponding booking manually via the established SEG affiliate / white-label route using the INTERNAL supply reference (do not send the customer to SEG).",
    "When SEG/supplier confirmation is obtained, confirm this booking (payment alone is not confirmation).",
    "If unavailable, decline and refund the customer in full to the original payment method.",
  ];
}

function opsInternalSupplyNotes(product: BookableProductConfig): string {
  return (product.supplierReferenceNotes ?? [])
    .filter(
      (note) =>
        /INTERNAL|SEG|shoreexcursionsgroup|CASLJUNSOUVAN|CASLSAIL|fulfilment_mode=|supplier=|supplier_product_url=|adult_cost|child_cost/i.test(
          note,
        ) && !/^INTERNAL ONLY — never publish|^NEVER expose/i.test(note),
    )
    .join(" | ");
}

export function requestedCustomerEmail(input: {
  reference: string;
  product: BookableProductConfig;
  cruise: BookingCruiseContext;
  guests: GuestCounts;
  amountLabel: string;
  customerName?: string;
  brand: CustomerEmailShellInput["brand"];
}): RequestReceiptContent {
  const guestsLabel = guestCountLabel(input.product, input.guests);
  const shell: CustomerEmailShellInput = {
    brand: customerBrand(input.brand),
    preheader: "Payment received — excursion request awaiting confirmation.",
    eyebrow: input.brand.siteName,
    headline: "We've received your excursion request",
    statusLabel: "Payment received · Awaiting confirmation",
    statusTone: "awaiting",
    introParagraphs: [
      thanksReceivedLine(input.customerName, input.brand.siteName),
      "We're now arranging your excursion. We'll email you again as soon as it is confirmed.",
    ],
    summaryRows: baseSummaryRows({
      reference: input.reference,
      productName: input.product.name,
      cruise: input.cruise,
      guestsLabel,
      amountLabel: input.amountLabel,
    }),
    infoPanel: {
      title: "Your booking status",
      paragraphs: [
        "This excursion is not confirmed yet.",
        "Your payment has been received and we're arranging your excursion. If we cannot confirm your places, your payment will be refunded in full to your original payment method.",
      ],
    },
  };

  return {
    subject: CUSTOMER_EMAIL.requestedSubject,
    customerHeading: shell.headline,
    bodyLines: [
      shell.introParagraphs[0],
      shell.introParagraphs[1],
      ...shell.summaryRows.map((row) => `${row.label}: ${row.value}`),
      shell.infoPanel?.paragraphs.join(" ") ?? "",
    ],
    shell,
  };
}

/**
 * Internal Wow A Tour operations email.
 * Routed to product.supplier.notificationEmail — never hardcoded in UI.
 */
export function supplierRequestEmail(input: {
  reference: string;
  product: BookableProductConfig;
  cruise: BookingCruiseContext;
  guests: GuestCounts;
  customer?: { name: string; email: string; phone: string };
  amountLabel?: string;
  operationalNotes?: string;
  reviewUrl?: string;
  /** Ops-only destination label — never shown to customers. */
  destinationLabel?: string;
  /** Optional ops-only Stripe identifiers. */
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  /** Override fulfilment action steps (ops-only). */
  actionSteps?: string[];
}): OperationalRequestEmail {
  const guestsLabel = guestCountLabel(input.product, input.guests);
  const guestLines = guestCommunicationLines(input.product, input.guests);
  const fulfilmentMode = productFulfilmentMode(input.product);
  const summaryRows: BookingSummaryRow[] = [
    { label: "Reference", value: input.reference },
    { label: "Excursion", value: input.product.name },
    { label: "Date", value: formatHumanBookingDate(input.cruise.date) },
    { label: "Ship", value: input.cruise.shipName },
    { label: "Guests", value: guestsLabel },
    ...guestLines.map((line) => {
      const [label, value] = line.split(": ");
      return { label: label || "Guests", value: value || line };
    }),
  ];

  if (input.customer) {
    summaryRows.push(
      { label: "Customer", value: input.customer.name },
      { label: "Email", value: input.customer.email },
      { label: "Mobile / WhatsApp", value: input.customer.phone || "Not supplied" },
    );
  }

  if (input.amountLabel) {
    summaryRows.push({ label: "Payment", value: `${input.amountLabel} paid` });
  }

  if (input.operationalNotes?.trim()) {
    summaryRows.push({ label: "Customer notes", value: input.operationalNotes.trim() });
  }

  if (input.stripeCheckoutSessionId?.trim()) {
    summaryRows.push({ label: "Stripe Checkout session", value: input.stripeCheckoutSessionId.trim() });
  }
  if (input.stripePaymentIntentId?.trim()) {
    summaryRows.push({ label: "Stripe PaymentIntent", value: input.stripePaymentIntentId.trim() });
  }

  const internalSupply = opsInternalSupplyNotes(input.product);
  if (internalSupply) {
    summaryRows.push({ label: "INTERNAL supply reference", value: internalSupply });
  }
  summaryRows.push({ label: "Fulfilment mode", value: fulfilmentMode });

  const destinationLabel =
    input.destinationLabel?.trim() ||
    `${input.product.destinationId} — new booking request`;

  const shell: OpsEmailShellInput = {
    destinationLabel,
    headline: "New booking request",
    statusLabel: "PAYMENT RECEIVED · BOOKING NOT YET CONFIRMED",
    summaryRows,
    actionSteps: opsActionSteps(fulfilmentMode, input.actionSteps),
    reviewUrl: input.reviewUrl,
  };

  const bodyLines = [
    shell.destinationLabel,
    shell.headline,
    shell.statusLabel,
    "",
    ...summaryRows.flatMap((row) => [row.label, row.value, ""]),
    "ACTION REQUIRED",
    ...shell.actionSteps.map((step, index) => `${index + 1}. ${step}`),
  ];
  if (input.reviewUrl) {
    bodyLines.push("", "Review booking:", input.reviewUrl);
  }

  return {
    subject: `ACTION REQUIRED — booking request — ${input.reference}`,
    body: bodyLines.join("\n").trim(),
    shell,
  };
}

export function confirmedCustomerEmail(input: {
  reference: string;
  product: BookableProductConfig;
  cruise: BookingCruiseContext;
  guests: GuestCounts;
  amountLabel: string;
  customerName?: string;
  meetingInstructions?: string | null;
  brand: CustomerEmailShellInput["brand"];
}): RequestReceiptContent {
  const guestsLabel = guestCountLabel(input.product, input.guests);
  const meetingCopy = input.meetingInstructions?.trim()
    ? input.meetingInstructions.trim()
    : "Meeting instructions will be provided with your confirmed excursion details.";

  const shell: CustomerEmailShellInput = {
    brand: customerBrand(input.brand),
    preheader: "Your excursion places are confirmed.",
    eyebrow: input.brand.siteName,
    headline: "Your excursion is confirmed",
    statusLabel: "Confirmed",
    statusTone: "confirmed",
    introParagraphs: [confirmedIntroLine(input.customerName, input.brand.siteName)],
    summaryRows: baseSummaryRows({
      reference: input.reference,
      productName: input.product.name,
      cruise: input.cruise,
      guestsLabel,
      amountLabel: input.amountLabel,
    }),
    closingParagraphs: [
      meetingCopy,
      "If your cruise schedule changes, reply to this email with your booking reference and we'll help.",
    ],
  };

  return {
    subject: CUSTOMER_EMAIL.confirmedSubject,
    customerHeading: shell.headline,
    bodyLines: [
      shell.introParagraphs[0],
      ...shell.summaryRows.map((row) => `${row.label}: ${row.value}`),
      meetingCopy,
    ],
    shell,
  };
}

export function declinedCustomerEmail(input: {
  reference: string;
  product: BookableProductConfig;
  cruise: BookingCruiseContext;
  guests: GuestCounts;
  amountLabel: string;
  customerName?: string;
  refundState?: "refunded" | "refund_pending";
  brand: CustomerEmailShellInput["brand"];
}): RequestReceiptContent {
  const guestsLabel = guestCountLabel(input.product, input.guests);
  const refunded = input.refundState !== "refund_pending";
  const statusLabel = refunded ? "Refunded" : "Refund initiated";
  const statusTone: EmailStatusTone = "declined";
  const refundLine = refunded
    ? `We've refunded ${input.amountLabel} in full to your original payment method.`
    : `We've initiated a full refund of ${input.amountLabel} to your original payment method.`;

  const shell: CustomerEmailShellInput = {
    brand: customerBrand(input.brand),
    preheader: "An update on your excursion request.",
    eyebrow: input.brand.siteName,
    headline: "We're sorry — we couldn't confirm your excursion",
    statusLabel,
    statusTone,
    introParagraphs: [
      "We're sorry — we could not confirm the excursion for your date.",
      refundLine,
      "Your bank or card provider may take a few working days to show the refund on your statement.",
    ],
    summaryRows: [
      { label: "Booking reference", value: input.reference },
      { label: "Excursion", value: input.product.name },
      { label: "Cruise date", value: formatHumanBookingDate(input.cruise.date) },
      { label: "Cruise ship", value: input.cruise.shipName },
      { label: "Guests", value: guestsLabel },
      { label: "Refund amount", value: input.amountLabel },
    ],
    closingParagraphs: [
      "We're sorry we couldn't make this one work.",
      `If you'd like help finding an alternative, reply to this email or contact us at ${input.brand.bookingEmail}.`,
    ],
    helpHeading: "Need help?",
  };

  return {
    subject: CUSTOMER_EMAIL.declinedSubject,
    customerHeading: shell.headline,
    bodyLines: [
      shell.introParagraphs.join(" "),
      ...shell.summaryRows.map((row) => `${row.label}: ${row.value}`),
    ],
    shell,
  };
}

export function refundInitiatedCustomerEmail(
  reference: string,
  product: BookableProductConfig,
  cruise: BookingCruiseContext,
  guests: GuestCounts,
  amountLabel: string,
  brand: CustomerEmailShellInput["brand"],
): RequestReceiptContent {
  return declinedCustomerEmail({
    reference,
    product,
    cruise,
    guests,
    amountLabel,
    refundState: "refund_pending",
    brand,
  });
}
