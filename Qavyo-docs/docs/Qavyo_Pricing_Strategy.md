# Qavyo Pricing Strategy

## Purpose

This document is the product source of truth for Qavyo software packaging. It
describes what customers see, what is included in each plan, and which
capabilities are sold separately.

## Commercial Principles

- Every new business receives a 30-day, full-access trial with no card required.
- The trial includes every plan capability and every add-on. There are no
  artificial feature, staff, product, or transaction limits during the trial.
- Qavyo never charges by staff count. Staff are unlimited on every plan.
- Branches, capability, and specialist products are the primary pricing levers.
- Hardware is separate from the software subscription.
- Prices vary by the customer's income-region group, not by a single global
  price list.

## Full-Access Trial

### Offer

**Try all of Qavyo free for 30 days.**

The trial includes Inventory, POS, KDS, website, online ordering, payments,
coupons, loyalty, payroll, staff portal, Qavyo AI Intelligent, mobile app, SMS
or WhatsApp where available, multi-branch capabilities, and all other
supported features.

### Conversion

- Remind owners when 7, 3, and 1 day remain.
- On expiry, preserve all business data but lock paid capabilities until the
  business chooses a plan and any required add-ons.
- A business can upgrade during the trial or after it expires.

## Core Plans

Qavyo sells exactly four core plans: Starter, Growth, Business, and Enterprise.
There is no Basic plan.

The free trial is an offer and subscription state, not a fifth plan card sold
alongside them — it must never appear as a plan competing for the same choice
as Starter/Growth/Business/Enterprise (that dilutes the four real plans and
creates "which one do I pick" confusion). It is displayed as "Trial", not
"Free" — an owner on it has full, unrestricted access to everything, and
"Free" undersells that. The trial is shown prominently wherever a pricing
page or Billing & Plan page is rendered: a customer already on it sees an
unmissable status banner stating everything is unlocked and how many days are
left; a prospect who hasn't started one sees a clear call to start it. Either
way it is presented as an offer sitting above the plan grid, not as a card
inside it.

### Starter

For a single business location that needs the core operating system.

Included:

- A full functional website
- Inventory
- POS
- KDS for food-service businesses
- Floor map and table management
- Reservations
- Tills and cash management
- Returns
- Basic reports
- Unlimited staff
- One branch

### Growth

For businesses that want to sell and manage orders online.

Everything in Starter, plus:

- Online ordering
- Online payment methods
- Delivery settings

### Business

For established businesses operating across locations.

Everything in Growth, plus:

- Multi-branch capability
- Advanced reports
- Priority support
- Central operational visibility

### Plan Prices

Tier 3 (High income) monthly prices are the source figures. Tier 2 and Tier 1
are derived at 50% and 20% of Tier 3 — the same ratio the SMS/add-on pricing
already uses ($10 / $5 / $2), applied here for one consistent discount curve
across the whole product rather than a separate one per pricing surface.
Lifetime is priced at roughly 24× the matching monthly price (a 2-year
payback), rounded to a clean number.

| Plan     | Tier 3 (given) | Tier 2 (derived, 50%) | Tier 1 (derived, 20%) |
|----------|-----------------|------------------------|-------------------------|
| Starter  | $29/mo          | $15/mo                 | $6/mo                   |
| Growth   | $79/mo          | $39/mo                 | $16/mo                  |
| Business | $149/mo         | $75/mo                 | $30/mo                  |

| Plan     | Lifetime, Tier 3 | Lifetime, Tier 2 | Lifetime, Tier 1 |
|----------|-------------------|--------------------|---------------------|
| Starter  | $699              | $359               | $149                |
| Growth   | $1,899            | $949               | $379                |
| Business | $3,599            | $1,799             | $699                |

Only the Tier 3 monthly column above was directly specified; every other
number in these two tables is derived from it and should be reviewed before
being treated as final. Enterprise has no listed price — see its section
above: pricing and implementation are agreed individually, shown as
"Contact us" wherever plans are priced.

### Enterprise

For large or specialized operations.

Everything in Business, with pricing and implementation agreed individually.
Enterprise can include centralized management, migration, custom integrations,
dedicated support, SLA, and custom requirements.

## Add-Ons

These products are optional and can be added to an eligible core plan. A trial
includes all of them temporarily.

| Add-on | Includes / purpose |
|---|---|
| Coupons | Owner-created discount codes for customer checkout |
| Loyalty | Customer points and rewards |
| Payroll | Payroll tools; Staff Portal is included with Payroll |
| Qavyo AI Intelligent | AI-assisted sales and operational insight — see Qavyo_Intelligence_AI_Features.md for the full feature set. **Not built yet** — the add-on card lists the committed roadmap so a buyer knows what's coming, not a shipped capability. |
| Mobile App | A separately priced customer or business app package |
| SMS / WhatsApp Marketing | Local messaging campaigns; show only where Qavyo supports a local gateway, initially Bangladesh |
| Custom Domain | Connect and manage a branded domain — a one-time setup fee, not a recurring charge |
| Extra Branch | Additional branch capacity when not included in the core plan |

### Add-On Pricing

Every add-on is priced Tier 3/Tier 2/Tier 1 at the same 50%/20% ratio the core
plans use. Most add-ons share one flat rate; two are priced differently:

| Add-on | Tier 3 | Tier 2 | Tier 1 | Basis |
|---|---:|---:|---:|---|
| Coupons, Loyalty, SMS Marketing, Payroll, Qavyo AI Intelligent, Extra Branch | $10/mo | $5/mo | $2/mo | Given (SMS/add-on baseline) |
| Mobile App | $30/mo | $15/mo | $6/mo | Tier 3 given directly; Tier 2/Tier 1 derived at 50%/20% |
| Custom Domain | $25 once | $12.50 once | $5 once | One-time fee, no monthly price — DERIVED placeholder, no real number was given, review before relying on it |

**Add-on Lifetime pricing:** every add-on except Custom Domain also offers a
Lifetime (one-time) price equal to **24× its Monthly price** — given directly
("addon price x 24 this is lifetime plan"), the same payback framing the core
plans use. Custom Domain has no separate Lifetime price because its one-time
fee already is a one-time payment — there's nothing to multiply.

## Regional Pricing

Qavyo prices software by purchasing-power tier, not by a single global price
list. Every country is classified using the World Bank's own income
classification (GNI per capita, Atlas method) — not a hand-picked list — so
the tier a country lands in is backed by data, not guesswork. That
classification covers 217 countries and is re-synced whenever the World Bank
publishes its annual update, each July.

The World Bank publishes four income levels (Low, Lower-middle, Upper-middle,
High). Qavyo groups them into three commercial tiers:

| Tier | World Bank levels folded in | Examples | Pricing approach |
|---|---|---|---|
| Tier 1 — Low income | Low income + Lower-middle income | Bangladesh, India, Pakistan | Local-accessible price level |
| Tier 2 — Mid income | Upper-middle income | China and similar markets | Mid-market price level |
| Tier 3 — High income | High income | United States, Canada, Ireland, most of Europe | International price level |
| Custom | — | Negotiated businesses without a resolved country | Manual price and terms |

Low and Lower-middle income are grouped into a single tier deliberately:
Bangladesh, India and Pakistan are all World Bank Lower-middle income, not
spread across two different price levels, so Tier 1 keeps genuinely similar
markets together rather than splitting them apart on a technicality.

A tenant's tier is resolved automatically from their branch address the first
time it's needed — no manual assignment required for the common case. Super
Admin can override a tenant onto Custom terms when negotiated pricing applies.

### Display Currency

A customer sees a price in one of three currencies, decided by country, not
by a free-text field an owner filled in:

| Countries | Currency shown |
|---|---|
| The 20 Eurozone countries (Germany, France, Ireland, Italy, Spain and others that use the euro as legal tender) | EUR |
| Bangladesh | BDT |
| Every other country | USD |

This is deliberately narrower than "all of Europe" — EU and European
countries that do not use the euro (the UK, Switzerland, Poland and others)
are priced in USD like the rest of the non-Eurozone world, not EUR.

## Billing Periods

Each core plan offers two billing choices:

- **Monthly** — billed every month, cancel anytime.
- **Lifetime** — one payment, once, for permanent access to that plan. No
  further bills for the plan itself.

There is no yearly billing period. Lifetime access is priced as a real
one-time cost, not a discount framed against a yearly price — the customer-
facing anchor is a payback period stated against the Monthly price ("pays for
itself in N months, then it's free"), not a percentage.

Support is included for the life of the account either way: a Lifetime
customer does not get less support than a Monthly customer. Both get support
for as long as the business is actively using Qavyo.

Lifetime offers must exclude or separately price continuing third-party costs,
including AI usage, SMS or WhatsApp usage, app-store costs, domains, payment
gateway costs, and other metered services — those keep billing (or metering)
independently of the one-time plan payment.

## Pricing Administration

Super Admin can:

- Set regional prices and currencies
- Assign a manual plan for special customers
- Enable or disable individual add-ons
- Record an override reason
- Review subscription and payment status

Owners can view their current plan, included features, active add-ons, renewal
date, available upgrades, and payment history in Billing & Plan.

## Feature-Gating Rules

- Server-side entitlements are the authority; hiding a feature in the UI is
  never sufficient.
- Every paid capability is checked at the API level.
- Trial entitlements expire automatically after 30 days.
- When a customer buys a plan, trial entitlements are replaced by the paid
  plan's entitlements. Paid add-ons are granted separately.

## Hardware

Hardware is never bundled into the software subscription. Qavyo may sell or
recommend compatible POS terminals, printers, scanners, cash drawers, customer
displays, tablets, and KDS devices separately.
