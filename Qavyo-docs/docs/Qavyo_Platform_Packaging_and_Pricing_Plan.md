# Qavyo Platform Packaging and Pricing Plan

## Executive Decision

Qavyo should be sold as one operating platform for retail, hospitality, and
service businesses. It should not become separate restaurant, retail, salon,
repair, grocery, and farm products with separate plan ladders.

Use the same four core plans for every supported industry:

1. Starter
2. Growth
3. Business
4. Enterprise

The selected business type changes onboarding, terminology, defaults, themes,
and the modules that are relevant. It does **not** change the plan names or
create a second pricing page. This keeps the buying decision understandable:
choose a business type, choose a plan, then add only specialist capabilities.

## Current State

Qavyo already has the right raw ingredients, but they are not yet organized as
one commercial platform.

| Area | What exists | Gap to close |
|---|---|---|
| Business types | Restaurant & Food, Retail & Clothing, Grocery & Convenience, Hardware & Sanitary, Salon & Spa, Electronics & Repair, Broiler Farm, Other | The list is duplicated as strings across apps and is not a shared product catalogue. |
| Product apps | Inventory, POS, KDS, customer website, website admin, staff portal, platform admin | Product names and module gates are not consistently tenant-neutral. |
| Pricing data | Regional plan and add-on price tables, tenant pricing profile, subscription items | Core plan seed data is legacy USD-only; most add-ons have no approved price rows. |
| Entitlements | Server-side feature gate and add-on model | Plan, vertical, and add-on eligibility need one authoritative configuration. |
| Marketing site | Four-plan pricing page and central copy registry | Pricing displays generic regional text rather than a verified price for the visitor's selected country. |

The codebase should use **business**, **tenant**, and **branch** at the platform
layer. Restaurant, menu, kitchen, recipe, and table language belongs only to
the hospitality preset.

## Product Architecture

### One Core, Vertical Presets

Create a server-owned product catalogue with three independent dimensions:

| Dimension | Purpose | Examples |
|---|---|---|
| Core plan | Commercial level and broad capability | Starter, Growth, Business, Enterprise |
| Vertical preset | Relevant terminology, onboarding, defaults, and eligible modules | Food, Retail, Service, Farm |
| Add-on | Optional specialist capability | Coupons, Loyalty, Payroll, AI Analytics, Mobile App, SMS Marketing, Custom Domain, Extra Branch |

This prevents pricing duplication. A cafe and a clothing shop can both buy
Growth; Qavyo simply enables different relevant modules and copy.

### Vertical Presets

| Preset | Existing business types | Starter configuration | Growth changes | Business changes |
|---|---|---|---|---|
| Food & Hospitality | Restaurant & Food, cafe, bakery, takeaway, hotel food service | POS, inventory, KDS, tills, returns, floor map, reservations | Customer website, online ordering, delivery settings, selected online gateways | Multi-branch, advanced reports, central operations |
| Retail | Retail & Clothing, Hardware & Sanitary, Grocery & Convenience | POS, inventory, barcode/SKU, purchase receiving, returns | Customer website, catalogue, click-and-collect or delivery where supported | Multi-branch, advanced reports, central catalogue |
| Service & Repair | Salon & Spa, Electronics & Repair | POS, customer records, service catalogue; warranty for repair | Booking or service website only when the workflow is ready | Multi-branch and central reporting |
| Farm & Production | Broiler Farm | Inventory, unit of measure, expiry, flock tracking | No customer website by default | Multi-site and advanced operational reporting |
| General | Other | Inventory and POS only | Website only when explicitly enabled | Multi-branch and advanced reports |

Do not claim a capability on the public site until its workflow is complete.
For example, salon booking, repair tickets, and farm workflows should appear as
"coming soon" only if there is a funded delivery plan. Otherwise they should
not appear in navigation or pricing.

### What Every Core Plan Means

| Plan | Commercial job | Included for every relevant vertical |
|---|---|---|
| Starter | Run one location | Inventory, POS, basic reports, tills/cash, returns, unlimited staff, one branch; KDS/floor map/reservations only for food businesses |
| Growth | Sell online | Everything in Starter plus customer website, online ordering or catalogue, selected payment methods, delivery settings where applicable |
| Business | Run multiple locations | Everything in Growth plus multi-branch management, advanced reports, central visibility, priority support |
| Enterprise | Solve a specialized operating problem | Business plus negotiated rollout, migration, integrations, SLA, and custom support |

Unlimited staff remains a product promise. Do not reintroduce per-seat pricing
through a hidden user pack. Competitors often price per location or add advanced
POS capabilities as a separate module; Shopify, for example, lists POS Pro per
location, while Lightspeed separates advanced restaurant capabilities and KDS
from its basic tiers.^1 ^2 Qavyo should use branch count and specialist product
value, not headcount, as its primary expansion levers.

## Add-On Catalogue

These remain global add-ons, with vertical eligibility and country eligibility
controlled by configuration.

| Add-on | Eligible verticals | Billing model | Important rule |
|---|---|---|---|
| Coupons | Growth and above, website-enabled businesses | Flat recurring | Do not sell to a tenant without online checkout. |
| Loyalty | Retail, Food, Service | Flat recurring | Gate points earning, redemption, rules, and reports at API level. |
| Payroll + Staff Portal | Any business with payroll workflow | Flat recurring | Staff Portal is included with Payroll, never a separate staff charge. |
| AI Analytics | Business and Enterprise initially | Recurring with a fair-use allowance | Meter model/API usage internally; do not market it as unrestricted AI. |
| Mobile App | Growth and above | Setup fee plus recurring support | Store fees, push services, and releases are ongoing costs. |
| SMS / WhatsApp Marketing | Bangladesh first; other countries only after gateway and legal review | Prepaid usage, optionally a small platform fee | Do not show it in unsupported countries. |
| Custom Domain | Growth and above | Annual or recurring pass-through plus management fee | Domain registration, DNS, and renewal must be explicit. |
| Extra Branch | Starter and Growth | Per branch recurring | Not relevant where a Business contract includes the needed branches. |

Coupons are a conversion tool, not a core plan feature. Loyalty is a paid
retention product. Payroll is a paid operational product. This is the cleanest
way to preserve the value of Growth and Business while keeping the main plan
comparison short.

## Regional Pricing Policy

### Commercial Tiers

Use the World Bank country income classification as the starting input, not
browser locale, IP address, or a self-entered currency. The Bank updates the
classification each July 1 and keeps a classification fixed for the fiscal year;
that gives Qavyo an auditable annual refresh point.^3 ^4

Map the four official bands to three Qavyo commercial tiers:

| Qavyo tier | World Bank income group | Example intent | Currency shown |
|---|---|---|---|
| Tier 1 | Low + lower-middle | Bangladesh, India, Pakistan and comparable markets | BDT for Bangladesh; USD equivalent elsewhere until local settlement exists |
| Tier 2 | Upper-middle | Mid-market countries | USD by default; add local settlement only when supported |
| Tier 3 | High | US, Canada, UK, Eurozone and comparable markets | EUR in Eurozone; USD elsewhere initially |
| Custom | Manual commercial approval | Negotiated or unsupported country | Quote only |

"Pakistan gets Bangladesh pricing" should mean **the same Tier 1 commercial
level**, not that a Pakistani business is charged BDT. Display the local
commercial currency supported by the payment gateway. If Qavyo cannot collect
PKR or INR reliably, display a Tier 1 USD amount and clearly state the amount
before checkout. Never convert a stored BDT price live with an exchange-rate
widget and call it a price.

The World Bank's classification is a useful objective input, but it is not a
complete willingness-to-pay model: it is based on GNI per capita and does not
measure income distribution or every local operating condition.^5 Treat it as
the default; allow Super Admin to apply a documented customer-specific override.

### Recommended Launch Price Book

These are proposed launch prices, not approved production prices. They are a
coherent starting matrix for validation with 20-30 sales conversations in each
target tier. Prices below are per branch unless stated otherwise; staff remain
unlimited.

| Core plan | Tier 1 (BD) | Tier 2 (USD) | Tier 3 (USD) | Eurozone display |
|---|---:|---:|---:|---:|
| Starter | BDT 1,490/mo | $19/mo | $49/mo | EUR 45/mo |
| Growth | BDT 2,490/mo | $39/mo | $99/mo | EUR 89/mo |
| Business | BDT 4,990/mo | $79/mo | $199/mo | EUR 179/mo |
| Enterprise | Quote | Quote | Quote | Quote |

Annual billing: charge 10 months for 12 months of access. Do not add quarterly
billing unless sales evidence shows it is needed; it makes the customer decision
and subscription code unnecessarily complex.

| Add-on | Tier 1 (BD) | Tier 2 (USD) | Tier 3 (USD) | Billing notes |
|---|---:|---:|---:|---|
| Coupons | BDT 290/mo | $5/mo | $12/mo | Growth+ only |
| Loyalty | BDT 490/mo | $9/mo | $19/mo | Flat recurring |
| Payroll + Staff Portal | BDT 590/mo | $12/mo | $29/mo | Flat recurring |
| AI Analytics | BDT 990/mo | $19/mo | $49/mo | Fair-use allowance; usage overage later |
| Mobile App | BDT 25,000 setup + 2,490/mo | $399 setup + $39/mo | $999 setup + $79/mo | Includes release/support baseline only |
| Custom Domain | BDT 190/mo | $4/mo | $9/mo | Domain cost/renewal shown separately |
| Extra Branch | BDT 990/mo | $15/mo | $39/mo | Only below Business included allowance |
| SMS / WhatsApp | Gateway cost + margin | Gateway cost + margin | Gateway cost + margin | Prepaid credits; country-specific |

The price positions are deliberately below comparable mature Western POS
products while remaining high enough to fund support. For reference, Lightspeed
Restaurant publicly lists $69, $189, and $399 tiers and a $30-per-screen KDS
charge; Shopify lists POS Pro as an $89/month per-location add-on.^1 ^6 Qavyo
should not copy those numbers or their payment economics, but they support the
decision to price Qavyo by branch and specialist value rather than staff.

### Lifetime Offers

Offer lifetime only as a controlled launch promotion, not as a permanent
all-inclusive SaaS promise.

1. Lifetime price = 30 times the monthly core-plan price.
2. Include 12 months of hosting, updates, and standard support.
3. After month 12, charge an annual care plan at 20% of the lifetime price, or
   restrict access to security updates and hosted services.
4. Never include SMS, WhatsApp, AI usage, domains, payment processing,
   app-store fees, or custom development in lifetime access.
5. Do not offer lifetime Enterprise.

This preserves the user's requested lifetime option without creating an
unfunded liability for services that incur continuous third-party costs.

## How the Website Should Show Prices

### Public Pricing Journey

1. Visitor selects **business type**: Food & Hospitality, Retail, Service &
   Repair, Farm & Production, or Other.
2. Visitor selects **country** from a searchable list. Do not infer the final
   price from IP; country selection is both more transparent and auditable.
3. Site resolves commercial tier and display currency from the server's pricing
   catalogue.
4. Site shows the same four plan cards, with the relevant feature labels for
   the selected vertical.
5. Site shows only eligible add-ons. Bangladesh may see SMS Marketing; an Irish
   business does not. A food business sees KDS as included; a salon does not.
6. Checkout repeats country, currency, billing period, plan, setup fees, and
   add-ons before payment.

The marketing site must stop showing generic "regional pricing" once the
country selector exists. Replace it with a server response, for example:

```text
Bangladesh | Food & Hospitality
Growth | BDT 2,490 per month per branch
Includes website, online ordering, POS, inventory and KDS
```

For an unsupported country, show "Talk to sales for availability" rather than
an invented currency. Payment providers can support local presentation in many
currencies, but manual price books give Qavyo control over the displayed amount
and exchange-risk policy.^7

### Do Not Build Separate Pricing Pages by Industry

Keep one `/pricing` page with two selectors. Industry landing pages should link
to that same page with a preselected vertical, for example:

```text
/pricing?businessType=GROCERY_CONVENIENCE&country=BD
```

This gives every industry a relevant price without creating six price books,
six billing flows, and six sets of marketing promises.

## Required Data and API Design

The existing `PlanPrice`, `AddonPrice`, `PricingRegionConfig`, and
`TenantPricingProfile` models are a strong start. Extend them rather than
creating a second billing system.

### Add These Server-Owned Configurations

| Configuration | Purpose |
|---|---|
| `BusinessTypeConfig` | Canonical business type, label, vertical preset, and public status. |
| `VerticalPreset` | Default modules, terminology, onboarding steps, website theme eligibility, and plan feature labels. |
| `PlanEntitlement` | Plan-to-entitlement grants; retain current server authority. |
| `AddonEligibility` | Minimum plan, eligible business types, allowed countries, billing model, and visibility. |
| `CountryCommercialPolicy` | ISO country, World Bank source version, Qavyo tier, display currency, gateway availability, and manual override rules. |
| `PriceBookVersion` | Effective date, status, creator, approval, and rollback reference. |
| `Price` | Product, tier/country, currency, billing interval, setup fee, tax behavior, effective window, and amount in minor units. |

Use amounts in currency minor units and store ISO currency separately. Do not
assume every currency has the same decimal precision. Keep every subscription
line's captured price and price-book version so historical invoices remain
correct after a future price change.

### Public APIs

```ts
GET /public/pricing?businessType=RESTAURANT_FOOD&country=BD
POST /billing/quote
POST /billing/checkout
GET /billing/subscription
```

The public pricing response should contain display-only data, selected currency,
prices, visible plans, eligible add-ons, billing intervals, and the country
source/version. Checkout must resolve price again on the server. The browser
must never decide entitlement or final price.

### Admin Controls

Super Admin needs a controlled price-book interface:

1. Draft a price book.
2. Enter core-plan and add-on prices per tier/currency.
3. Add country exceptions and a reason.
4. Preview a business type and country as a customer would see them.
5. Approve and schedule an effective date.
6. Publish atomically.
7. Preserve previous price books and subscriptions at their contracted price.

The owner billing page should show the selected country, commercial tier,
currency, active plan, included modules, active add-ons, next bill, and an
itemized upgrade quote.

## Codebase Organization

Do not do a large repository merger now, and do not introduce root-level shared
UI. The current product repos can remain independent while Qavyo keeps
commercial and entitlement authority in the server/API.

| Area | Owns | Consumers |
|---|---|---|
| App-local UI/token files | Design tokens, admin primitives, wrappers, and workflow-specific UI inside each app | The owning app only |
| Server `product-catalogue` module | Authoritative vertical, pricing, eligibility, entitlement configuration | All apps through API only |
| API responses / generated local types | Business types, entitlement codes, module codes, API DTOs, price display types | Server and every product app |
| Marketing `content/site-copy.json` | Marketing copy only | Marketing website |

The immediate issue is duplicated `businessType` strings in Inventory, Customer
Website, and Server. The canonical values should come from the server/API or
generated local type files. Each frontend may keep presentation-specific labels,
but it must not invent a new value. Add a CI check that validates every
configured business type against the server configuration or generated type
source.

Suggested long-term layout if the team later chooses a workspace:

```text
apps/
  server  inventory  pos  kds  customer-website  platform-admin  marketing
docs/
  product  pricing  architecture  runbooks
```

Do not move repositories merely for tidiness. A monorepo can follow only when
releases are coordinated often enough to justify it. UI and token code should
stay app-local unless the owner explicitly re-approves root-level shared UI.

## Delivery Plan

### Phase 0: Commercial Decisions - 1 week

- Approve or revise the proposed price matrix.
- Confirm launch countries and payment gateways.
- Confirm which verticals are sellable now versus hidden roadmap.
- Decide whether the limited lifetime policy is acceptable.
- Write tax, refund, cancellation, and renewal policies with legal advice.

Exit criterion: one approved price book, one owner, one effective date.

### Phase 1: Canonical Product Catalogue - 1-2 weeks

- Create or generate local type definitions from the server/API for
  `BusinessType`, `ModuleCode`, `EntitlementCode`, and `AddonCode`.
- Replace duplicated string lists in Server, Inventory, and Customer Website
  with server-sourced values or generated local types.
- Create `BusinessTypeConfig` and `VerticalPreset` server configuration.
- Mark each vertical and feature as `live`, `roadmap`, or `hidden`.

Exit criterion: a new tenant can only select a validated business type and
receives the correct vertical defaults.

### Phase 2: Price Book and Quote API - 2-3 weeks

- Complete plan and add-on price seed data for every approved tier/currency.
- Add price book versioning and effective dates.
- Build `GET /public/pricing` and server-side quote calculation.
- Resolve country from branch address; allow Super Admin override with reason.
- Add gateway availability per country.

Exit criterion: the same country/business-type request always produces the same
server-calculated quote and no unconfigured region is shown as purchasable.

### Phase 3: Billing and Entitlements - 2-3 weeks

- Finish plan and add-on purchase flows.
- Capture price, currency, price-book version, and tax on subscription items.
- Enforce all paid features at API level.
- Add trial expiry, failed payment, cancellation, renewal, and upgrade tests.
- Add owner Billing & Plan and Super Admin price-book controls.

Exit criterion: changing a plan or add-on changes both UI and API access, and
historical invoices retain their original amounts.

### Phase 4: Marketing and Onboarding - 1-2 weeks

- Replace static pricing labels with the public pricing API.
- Add vertical and country selectors to the marketing pricing page.
- Publish only live vertical pages; roadmap pages remain hidden.
- Make signup select business type, country, branch count, and desired modules.
- Use the selected vertical to choose the customer-website theme and onboarding
  checklist.

Exit criterion: a visitor can understand the correct product and a verified
price without reading restaurant-specific material that does not apply.

### Phase 5: Measurement and Iteration - ongoing

Track country, vertical, plan viewed, add-on viewed, trial started, trial
activated, trial converted, upgrade, downgrade, and churn reason. Review price
and conversion by vertical and commercial tier quarterly. Do not change a live
price book silently; publish a new version with grandfathering rules.

## Decisions Needed Before Implementation

1. Approve, revise, or replace the proposed monetary price matrix.
2. Confirm the first live verticals. Recommended: Food & Hospitality, Retail,
   Grocery & Convenience, and Electronics & Repair; keep Salon and Farm hidden
   until their workflow is complete.
3. Confirm Bangladesh's live gateway list and the first supported country list.
4. Decide whether prices are tax-inclusive or tax-exclusive in each country.
5. Approve the lifetime policy or remove lifetime from the public site.
6. Decide whether Growth's website is an included module for every vertical or
   only for businesses that choose an online catalogue/order workflow.

## Sources

1. Lightspeed Commerce. [Restaurant POS Systems Prices](https://www.lightspeedhq.com/pos/restaurant/pricing/). Accessed September 15, 2026.
2. Shopify. [Pricing](https://www.shopify.com/pricing?branded_enterprise=1). Accessed September 15, 2026.
3. World Bank Data Help Desk. [How does the World Bank classify countries?](https://datahelpdesk.worldbank.org/knowledgebase/articles/378834-how-does-the-world-bank-classify-countries). Accessed September 15, 2026.
4. World Bank Data Help Desk. [Country and Lending Groups](https://datahelpdesk.worldbank.org/knowledgebase/articles/906519-world-bank-country-and-lending-groups). Accessed September 15, 2026.
5. World Bank Data Help Desk. [Why use GNI per capita to classify economies into income groupings?](https://datahelpdesk.worldbank.org/knowledgebase/articles/378831-why-use-gni-per-capita-to-classify-economies-into). Accessed September 15, 2026.
6. Shopify. [Shopify POS Pricing](https://apps.shopify.com/shopify-pos). Accessed September 15, 2026.
7. Stripe. [Localize Prices](https://docs.stripe.com/payments/currencies/localize-prices). Accessed September 15, 2026.
