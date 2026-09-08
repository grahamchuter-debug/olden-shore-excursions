/**
 * O-6 PREVIEW ONLY — renders Olden transactional emails to /tmp.
 * Does not send. Does not touch EMAIL_SENDING_ENABLED.
 *
 *   npx tsx scripts/preview-olden-emails.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { oldenBookingCore } from "../shared/destinations/olden";
import {
  findOldenBookingProduct,
  OLDEN_CANCELLATION_COPY,
} from "../shared/destinations/olden-products";
import {
  confirmedCustomerEmail,
  declinedCustomerEmail,
  destinationBrandFromCore,
  renderCustomerBookingEmailHtml,
  renderCustomerBookingEmailText,
  renderOpsRequestEmailHtml,
  renderOpsRequestEmailText,
  requestedCustomerEmail,
  supplierRequestEmail,
} from "../shared/world-booking";

const outDir = "/tmp/olden-o6-email-previews";
const product = findOldenBookingProduct("briksdal-glacier-olden-lake");
if (!product) throw new Error("Briksdal product missing");

const brand = destinationBrandFromCore(oldenBookingCore);
const cruise = {
  date: "2027-07-15",
  shipName: "Sky Princess",
  shipSlug: "not-listed",
  cruiseLine: "Princess Cruises",
  isCustomShip: true,
  scheduleMatched: false,
};
const guests = { adults: 2, children: 1, infants: 1 };
const reference = "W2ODE-O6PREV1";
const amountLabel = "EUR €248";
const customerName = "Alex Traveller";

mkdirSync(outDir, { recursive: true });

const requested = requestedCustomerEmail({
  reference,
  product,
  cruise,
  guests,
  amountLabel,
  customerName,
  brand,
});
const ops = supplierRequestEmail({
  reference,
  product,
  cruise,
  guests,
  customer: {
    name: customerName,
    email: "alex@example.com",
    phone: "+447700900123",
  },
  amountLabel,
  operationalNotes:
    "Walking suitability acknowledged: yes\n\nChild seat / booster request:\n  Seat 1: age 4y · weight 18 kg · height 105 cm",
  destinationLabel: "Olden Shore Excursions — new booking request",
  stripeCheckoutSessionId: "cs_test_o6_preview",
  stripePaymentIntentId: "pi_test_o6_preview",
});
const confirmed = confirmedCustomerEmail({
  reference,
  product,
  cruise,
  guests,
  amountLabel,
  customerName,
  meetingInstructions: OLDEN_CANCELLATION_COPY.meetingInstructions,
  brand,
});
const declined = declinedCustomerEmail({
  reference,
  product,
  cruise,
  guests,
  amountLabel,
  customerName,
  refundState: "refund_pending",
  brand,
});

const files: Array<[string, string]> = [
  ["customer_requested.html", renderCustomerBookingEmailHtml(requested.shell)],
  ["customer_requested.txt", renderCustomerBookingEmailText(requested.shell)],
  ["ops_request.html", renderOpsRequestEmailHtml(ops.shell)],
  ["ops_request.txt", renderOpsRequestEmailText(ops.shell)],
  ["customer_confirmed.html", renderCustomerBookingEmailHtml(confirmed.shell)],
  ["customer_confirmed.txt", renderCustomerBookingEmailText(confirmed.shell)],
  ["customer_declined.html", renderCustomerBookingEmailHtml(declined.shell)],
  ["customer_declined.txt", renderCustomerBookingEmailText(declined.shell)],
];

for (const [name, content] of files) {
  writeFileSync(join(outDir, name), content, "utf8");
}

const requestedHtml = renderCustomerBookingEmailHtml(requested.shell);
writeFileSync(
  join(outDir, "mobile-wrap-requested.html"),
  `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>375px preview</title><style>body{margin:0;background:#ddd}iframe{width:375px;height:920px;border:1px solid #999;background:#fff;display:block;margin:12px auto}</style></head><body><iframe srcdoc="${requestedHtml.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"></iframe></body></html>`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      outDir,
      EMAIL_SENDING: "not invoked",
      subjects: {
        customer_requested: requested.subject,
        ops_request: ops.subject,
        customer_confirmed: confirmed.subject,
        customer_declined: declined.subject,
      },
      checks: {
        requestedNotConfirmed:
          !/confirmed/i.test(requested.subject) &&
          /not confirmed/i.test(requested.bodyLines.join(" ")),
        opsNoSegAffiliate: !/SEG affiliate/i.test(ops.body),
        opsDirectSupplier: /DIRECT_SUPPLIER_MANUAL/i.test(ops.body),
        brandOlden: requested.shell.eyebrow === "Olden Shore Excursions",
        noBelize: !/Belize|W2BZE/i.test(requested.bodyLines.join(" ") + ops.body),
      },
    },
    null,
    2,
  ),
);
