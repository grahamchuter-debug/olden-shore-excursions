# OLDEN WORLD 2.0 — PHASE O-1

## Briksdal Glacier direct-commercial audit / content + image upgrade plan / booking implementation readiness

**Status:** AUDIT ONLY — no live money, no supplier booking, no deploy, no Stripe/D1/Worker changes  
**Date:** 2026-09-08  
**Page URL preserved:** `/excursions/briksdal-glacier-olden-lake`

---

## INTERNAL COMMERCIAL RECORD (DO NOT PUBLISH)

```yaml
fulfilment_mode: DIRECT_SUPPLIER_MANUAL
supplier: Norway Excursions
supplier_product_url: https://www.norwayexcursions.com/en/tour/olden-the-amazing-briksdal-glacier/
adult_sell_eur: 96
adult_cost_eur: 82
adult_gp_eur: 14
child_sell_eur: 56
child_cost_eur: 41
child_gp_eur: 15
infant_sell_eur: 0
infant_cost_eur: 0 # verify in supplier booking flow before treating as contractual
supplier_relationship: DIRECT_SITE_INITIAL_PERIOD
commercial_review: AFTER_6_MONTHS
future_action: REQUEST_COMMISSION_OR_TRADE_MODEL
fx_buffer: NONE # customer EUR + supplier EUR
```

Public pricing only: Adult €96 (12+), Child €56 (3–11), Infant FREE (0–2).  
Never expose costs, margins, “cheapest”, SEG undercut, or supplier net.

---

## 1. REPO / DEPLOYMENT

| Field | Value |
| --- | --- |
| Path | `/Users/graham.chuter/Desktop/Norway-World-2.0/olden-shore-excursions` |
| Remote | `https://github.com/grahamchuter-debug/olden-shore-excursions.git` |
| Branch | `main` tracking `origin/main` |
| HEAD (start/end O-1) | `d41dc4f707474826823e18f325b8c87ab26073b6` |
| Clean | **DIRTY** — pre-existing local edit to `scripts/sync-olden-schedules.mjs` (3 deletions). Untouched by O-1. |
| Framework | Next.js 16.2.6 (App Router), React 19, Tailwind 4, TypeScript |
| Build | `next build` → static `output: "export"` → `./out` |
| Deploy | `npm run deploy` = build + `wrangler deploy` |
| Cloudflare | Worker/assets project `olden-shore-excursions` (`wrangler.jsonc`) |
| Domain | `oldenshoreexcursions.com` custom domain route |
| Images | Hotlinked Wikimedia URLs; `images.unoptimized: true` (no AVIF/WebP pipeline yet) |

---

## 2. CURRENT PAGE AUDIT

**Live:** https://oldenshoreexcursions.com/excursions/briksdal-glacier-olden-lake  
**Source:** `src/lib/excursions/briksdal-glacier-olden-lake.ts` + `ExcursionDetailPage`

| Element | Current |
| --- | --- |
| Title / H1 | Briksdal Glacier and Olden Lake Discovery for Cruise Passengers |
| Meta description | Headline Olden shore excursion to Briksdal Glacier, Olden Lake, waterfalls, and valley scenery. Cruise-friendly timing for first-time visitors. |
| Canonical | `/excursions/briksdal-glacier-olden-lake` (via `metadataBase` + path) |
| Hero | Glacier Wikimedia hero; badge “Headline Olden shore excursion”; return-to-ship pill |
| Duration | Approx. 4 to 5 hours |
| Meeting | Olden village centre near cruise pier |
| Return | Coach timings designed for typical cruise port schedules |
| Best for | First-time visitors / definitive Briksdal + Olden Lake |
| Fitness | **Easy to moderate, short walks at glacier** ← too soft vs supplier |
| Included / not | Generic guided tour / scenic drive / commentary; food & drinks excluded |
| FAQ | Distance, “best for first-timers”, duration 4–5h, cruise pier scheduling |
| Schema | WebPage + BreadcrumbList + FAQPage only (no Product/Offer/AggregateRating) |
| CTA | “Explore this excursion” → `/excursions` (non-commercial) |
| Commercial | Informational only (terms/privacy/about/contact all state no booking/payment) |
| Gallery | 4 hotlinked Wikimedia images |

### Classification

| Accurate enough | Too vague / soft | Unsupported / incorrect for direct product | Conversion-weak |
| --- | --- | --- | --- |
| Glacier + Oldedalen focus | Fitness “short walks” | Duration 4–5h vs supplier **4 hours** | No price |
| Food not included | Meeting “village centre” | No Little Red Church (supplier includes) | CTA not bookable |
| Cruise timing intent | Return wording soft | No 45–60 min walk / steep first section | No walking truth |
| ~25 km distance FAQ | “Operators schedule…” | No clothing / difficulty 2–3 | Editorial “best” FAQ |

---

## 3. SEO EQUITY

**HIGH PRESERVATION.** Keep URL, canonical path, topic cluster (Briksdal + Olden Lake + cruise), useful FAQ bones, internal links to private Briksdal / Loen / one-day-in-Olden.  
Upgrade accuracy + add commercial path; do not thin-replace the page.

---

## 4. DIRECT SUPPLIER FACTS (Norway Excursions)

**Product:** Olden the Amazing Briksdal Glacier  
**URL:** https://www.norwayexcursions.com/en/tour/olden-the-amazing-briksdal-glacier/

| Fact | Evidence |
| --- | --- |
| Duration | **4 hours** |
| Season | April–September |
| Max people | **45** |
| Min age | Infant (0–2) |
| Route | Olden → Little Red Church → Olden Lake → Rustøen → Briksdal Inn → walk to glacier lake viewpoint → return Olden |
| Stop order | May vary |
| Walking | **~45–60 minutes** to viewpoint; **first section most difficult**, then relatively even |
| Difficulty | Level **2–3**, for physically fit / adventurous guests |
| Meeting | Cruise Terminal / Norway Excursions Olden, 6788 Olden; **15 minutes** before departure; yellow jackets; buses at/near terminal |
| Cruise adapt | Yes — adapt to ship departures; back-in-time guarantee |
| Included | Bus fare, guided tour, back-in-time guarantee, free cancellation (supplier retail), VAT |
| Food/drink | **Not listed** in Olden product inclusions |
| Clothing | Appropriate shoes and clothing; respect track warning signs |
| Accessibility | Contact by email for wheelchair / mobility specifics — **no blanket claim** |
| Child seat | **Not stated** on product page or Section 9 age terms |
| Retail price signal | From €106 / Book Locally €82 (adult local price aligns with Graham’s cost) |
| Age bands (supplier retail) | Infant 0–2 free; Child 3–11 50% off; Youth 12–17 25% off; Graham sells 12+ as Adult €96 |
| Online guest picker | 1–15 and 15+ / 16+ option shown |
| Cancellation (supplier retail) | Full refund if cancel ≥24h before start; &lt;24h / no-show non-refundable; supplier cancel / port miss → full refund |
| Ship miss port | Full refund (FAQ + terms) |

---

## 5. SEG FACTS (comparison only — do not publish solely from SEG)

**URL:** https://www.shoreexcursionsgroup.com/tour/briksdal-glacier-olden-lake-discovery/euodbriksdalglacier

Useful cross-check: 4h; Difficult; pier departure; food not included; 45–60 min walk / hard first section; Little Red Church; Olden Lake; Briksdal Inn; glacier lake; child safety-seat law fields; mobility/stroller ban.

**Conflicts with supplier:** SEG bans wheelchairs/strollers; supplier asks email for wheelchair; a verified supplier guest review claims stroller-reachable. **Do not publish SEG-only bans without Graham/supplier confirmation.**

SEG child-seat collection is a strong **operational warning** but not yet a confirmed Norway Excursions booking field for Graham’s direct fulfilment.

---

## 6. PRICE MODEL (Graham authorised)

| Band | Ages | Sell EUR | Cost EUR (internal) | GP EUR |
| --- | --- | --- | --- | --- |
| Adult | 12+ | 96 | 82 | 14 |
| Child | 3–11 | 56 | 41 | 15 |
| Infant | 0–2 | 0 | 0* | 0 |

\*Infant supplier cost: verify in booking flow.  
**Online max guests:** do not invent. Supplier max 45; online form scales to 15+. Recommend O-2 start with **party max 10** (or match form 15) pending Graham choice — server-side price authority required.

---

## 7. 10 JUNE 2027 LOCAL SCHEDULE

From `src/data/olden-cruise-schedules.generated.json` (local only; no CT scrape; schedules untouched):

| Field | Value |
| --- | --- |
| Ship | **Regal Princess** (Princess Cruises) |
| Arrival | **09:00** |
| Departure | **17:00** |
| All aboard | TBC |
| Window | ~8 hours |
| 4-hour structural fit | **YES** (structurally compatible) |
| Supplier availability | **NOT VERIFIED** |

---

## 8–11. COPY / ITINERARY / WALKING / CHILDREN (PLAN)

### Proposed above-fold

- **Title:** Briksdal Glacier & Olden Lake  
- **Subhead:** Guided shore excursion from Olden cruise port: Oldedalen valley, Olden Lake, and the walk to the Briksdal glacier lake viewpoint.  
- **Duration:** 4 hours  
- **Price:** Adult €96 · Child €56 · Infant FREE  
- **Activity:** Scenic coach journey + glacier walk (~45–60 minutes; first section the most challenging)  
- **CTA (O-2 only):** Request to book  

### Proposed itinerary (supplier-backed)

1. Leave Olden cruise terminal / meeting point  
2. Travel through Olden / Oldedalen; pass the Little Red Church (museum; early 1900s)  
3. Follow Olden Lake toward Rustøen (farms, waterfalls)  
4. Arrive Briksdal area / Briksdal Inn  
5. Walk to Briksdal Glacier lake viewpoint (photo stops)  
6. Return through the valley to Olden  

Note: stop order may vary.

### Walking / suitability (replacement for soft copy)

Tell customers before payment: ~45–60 minutes walking; first section most challenging; then relatively even; wear proper footwear and weather layers; difficulty 2–3 / physically fit; respect warning signs; mobility — ask before booking; do not claim stroller OK/not OK until supplier confirms for Graham’s fulfilment.

### Children

Collect Adult / Child / Infant counts with ages. Child-seat age/weight/height fields: **design optional in O-2 only after Graham confirms Norway Excursions requires them when he books directly.**

---

## 12–14. IMAGES

### Current gallery (4) — KEEP with attribution hardening

| # | Subject | Source | Creator | Licence | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Briksdal glacier terminus (hero/gallery) | [File:Briksdalsbreen Glacier -Norway.jpg](https://commons.wikimedia.org/wiki/File:Briksdalsbreen_Glacier_-Norway.jpg) | Yair Haklai | CC BY-SA 3.0 | KEEP |
| 2 | Waterfall / turquoise glacial lake | [File:Briksdal Glacier Norway (213014897).jpeg](https://commons.wikimedia.org/wiki/File:Briksdal_Glacier_Norway_(213014897).jpeg) | Simo87vr | CC BY 3.0 | KEEP |
| 3 | Oldedalen / lakes overview | [File:Oldedalen.jpg](https://commons.wikimedia.org/wiki/File:Oldedalen.jpg) | Sindre | CC BY 2.0 | KEEP (valley; not pure Oldevatnet close-up) |
| 4 | Olden harbour | [File:Olden - Norway - panoramio.jpg](https://commons.wikimedia.org/wiki/File:Olden_-_Norway_-_panoramio.jpg) | Kris Van Achter | CC BY-SA 3.0 | KEEP cruise context |

Provenance registry (`src/lib/image-provenance.ts`) marks KEEP but “rights later-hardening” — attributions not yet surfaced on page.

### New candidates (do not download in O-1)

1. **Oldevatnet northern part** — [File:Oldevatnet (northern part) in Oldedalen, 2011 August.jpg](https://commons.wikimedia.org/wiki/File:Oldevatnet_(northern_part)_in_Oldedalen,_2011_August.jpg) — Ximonic / Simo Räsänen — CC BY-SA 3.0 (+ GFDL) — true Olden Lake story  
2. **Kleivafossen on Briksdal route** — [File:Kleivafossen in Briksdalen, Stryn, Vestland, Norway, 2025 June.jpg](https://commons.wikimedia.org/wiki/File:Kleivafossen_in_Briksdalen,_Stryn,_Vestland,_Norway,_2025_June.jpg) — Simo Räsänen — CC BY-SA 4.0 — trail waterfall context  
3. **Trail bridge near glacier** — [File:Awesome "monkey bridge" near briksdalsbreen glacier.jpg](https://commons.wikimedia.org/wiki/File:Awesome_%22monkey_bridge%22_near_briksdalsbreen_glacier.jpg) — Leif — CC BY 2.0 — walking context  
4. **Little Red Church / Olden gamle kyrkje** — [File:Olden Old Church…JPG](https://commons.wikimedia.org/wiki/File:Olden_Old_Church_Sogn_og_Fjordane_exterior01_2015-04-28..JPG) — Wolfmann — CC BY-SA 4.0 — only if stop retained (supplier supports)  
5. **Volefossen detail** — [File:Volefossen.JPG](https://commons.wikimedia.org/wiki/File:Volefossen.JPG) — Simo Räsänen — CC BY 2.5 / CC BY-SA 3.0 — optional waterfall variety  

**Target final count:** 6–8 strong images (keep 4 + add 2–4). Prefer local self-hosted WebP later; lazy-load gallery; eager hero; width/height reserved; caption + attribution footer. No AVIF pipeline in current Next export config — recommend O-2 local WebP if hosting assets.

**Forbidden without rights:** SEG / Norway Excursions / GYG / Viator / Google Images copies.

---

## 15–17. BOOKING ARCHITECTURE

### Existing Norway mechanism

**None.** Olden (and Norway World 2.0 generally) is informational. QA actively fails if Stripe patterns appear. No D1, Resend, booking Worker, or product catalogue checkout.

### Proven reference (outside Norway)

**Belize Shore Excursion** (also St Lucia) shared `world-booking` + `workers/bookings`:

- Tour → date/ship → guests → details → review → Stripe Checkout  
- Payment success → **`requested`** (not confirmed)  
- Operator review confirm/decline  
- Decline → refund path  
- D1 + Resend-style email + operator tokens  

Lifecycle already matches DIRECT_SUPPLIER_MANUAL: pay → requested → Graham books Norway Excursions → confirm; else full refund.

### Recommended Olden journey

```
TOUR → DATE / SHIP → GUESTS → DETAILS → REVIEW → STRIPE (EUR) → REQUESTED/PAID
  → Graham manual Norway Excursions booking
  → CONFIRMED  |  DECLINED + FULL REFUND
```

| Need | Recommendation |
| --- | --- |
| Payment | Stripe Checkout EUR (charge then refund if unfulfilled) |
| Confirmation | Manual operator / Graham |
| D1 | Yes (booking records) |
| Worker | Yes (bookings API + webhook) |
| Email | Yes (customer + ops) |
| Operator review | Yes |

Do not copy Belize destination-specific products; reuse lifecycle/pricing/security patterns only.

---

## 18. CANCELLATION DECISION

| Source | Policy |
| --- | --- |
| Norway Excursions retail | ≥24h free cancel; &lt;24h / no-show no refund; supplier cancel / port miss full refund |
| Graham local / Olden site | **No booking terms** — site says no booking/payment |
| SEG | Separate retail (not Graham’s) |

**Recommendation (customer-facing once commercial):**

1. Payment = **request paid**, not tour confirmation.  
2. If Graham cannot secure supplier booking → **full refund**.  
3. Ship misses port / supplier or weather cancel after confirmation → **full refund**.  
4. Customer cancellation after confirmation → **Graham must decide** whether to mirror supplier 24h rule or offer a stricter/looser Graham policy (cannot silently paste supplier terms unless they are Graham’s contract with the customer).

**Status: GRAHAM DECISION REQUIRED** before live CTA.

---

## 19. EMAIL

| Item | Status |
| --- | --- |
| Public | `hello@oldenshoreexcursions.com` (`contactEmailVerified: true` in site-config) |
| Transactional sender | **None** in Norway repos |
| Recommend (O-2) | request received (customer), ops alert (Graham), confirmed, declined/refunded |
| O-1 | No DNS/MX/TXT changes; no sends |

---

## 20. FIRST CUSTOMER (10 JUNE 2027)

**Safe operational next step for Graham (manual, outside site):**

1. Open Norway Excursions product and check **10 June 2027 / Regal Princess** availability (or contact supplier booking office).  
2. If seats exist, **hold/book** at supplier cost (€82 adult / €41 child) for the party size.  
3. Only then confirm price and meeting details to the customer offline.  
4. Do not take card payment on oldenshoreexcursions.com until O-2+ is live and cancellation policy is set.  
5. Do not promise confirmation until supplier booking succeeds.

This audit did **not** place a supplier booking or contact the customer.

---

## 21. SEO / SCHEMA (later)

Keep WebPage + Breadcrumb + FAQ. When genuinely requestable, optional `Product`/`Offer` with EUR prices and `availability: PreOrder` or equivalent **request** semantics — never fake AggregateRating, Review stars, inventory, discounts, or price comparisons.

---

## 22. SCOPE BOUNDARIES (O-1 observed)

No URL/canonical change; no other Olden excursions; no other Norway sites; no schedule edits; no Stripe/D1/Worker/secrets; no live money; no emails; no supplier/customer contact; no commercial deploy.

---

## MISSING FACTS (implementation blockers)

1. Customer-facing **cancellation policy** (Graham decision).  
2. Norway Excursions **child-seat / booster** requirements for Graham’s direct bookings.  
3. Stroller / mobility **publishable** rule (supplier email vs SEG ban).  
4. Online **max party size** choice.  
5. **Supplier availability** for 10 June 2027 (ops, not engineering).  
6. Infant cost **€0** confirmation in supplier checkout.  
7. Transactional **email sending domain** choice for Olden.

---

## VERDICT

**GREEN for Phase O-2 planning** (page accuracy upgrade + request-to-book architecture, production-locked until blockers cleared).  
**NOT GREEN for live money.**
