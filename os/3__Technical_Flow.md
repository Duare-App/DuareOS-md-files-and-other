# Technical Flow Document

**Stack:** Next.js · Node.js · PostgreSQL · Prisma ORM · Redux · WebSockets

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Clients                            │
│  Next.js Web App │ Mobile App (React Native) │ POS WebApp  │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS / WSS
┌────────────────────────────▼────────────────────────────┐
│               API Layer (Node.js / Express)              │
│   REST API  │  WebSocket Server  │  IPN Webhook Handler  │
└──────┬───────────────┬──────────────────┬───────────────┘
       │               │                  │
┌──────▼──────┐ ┌──────▼──────┐ ┌────────▼────────┐
│  PostgreSQL │ │   Redis    │ │  External APIs │
│  (Prisma)   │ │  (sessions/ │ │  Stripe, bKash, │
│             │ │   pub-sub)  │ │  PayPal,        │
│             │ │             │ │  SSLCommerz,    │
│             │ │             │ │  Maps           │
└─────────────┘ └─────────────┘ └─────────────────┘
```

### Multi-Tenant Isolation
- Each restaurant business (Owner) gets a unique `tenantId` on account creation
- Each branch of that restaurant gets a unique `branchId` linked to the `tenantId`
- **Tenant isolation**: all Prisma queries are scoped with `WHERE tenantId = ?` — no cross-tenant data leakage
- **Branch scoping**: queries further filtered with `AND branchId = ?` for branch-specific data
- Owner sees all branches under their `tenantId`; Manager is assigned to a specific `branchId`
- Middleware enforces `tenantId` (and `branchId` where applicable) on every API request

---

## 2. Authentication & Session Flow

```
Client → POST /api/auth/login (email + password)
       → Node.js validates credentials
       → bcrypt password comparison
       → All roles authenticate via email + password → JWT issued
           - Owner: access token (15min) + refresh token (7d) → auto-refresh cycle
           - Staff roles (Manager, Waiter, Kitchen, Delivery): long-lived token (30d), valid until explicit logout — no refresh cycle needed
       → Tokens stored: access in memory (Redux), refresh in httpOnly cookie
       → Role attached to token payload (Owner | Manager | Waiter | Kitchen | Delivery)

Subsequent requests:
       → Authorization: Bearer <accessToken> header
       → Middleware decodes JWT → attaches user + tenantId + branchId to req
       → Role-based route guards applied per endpoint

Token Refresh (Owner only):
       → Access token expires (15min) → client sends refresh token cookie
       → POST /api/auth/refresh → new access token issued
       → If refresh token expired (7d) → Owner logged out, must re-authenticate
       → Staff tokens (30d) do not use this flow — POST /api/auth/refresh is not applicable to Staff roles

Logout:
       → POST /api/auth/logout
       → JWT token added to Redis blacklist (TTL = remaining token lifetime)
       → Middleware checks blacklist on every request → blacklisted tokens rejected
       → Client clears token from memory (Redux) and httpOnly cookie cleared

OTP Flow (Forgot Password):
       → POST /api/auth/forgot-password → OTP generated → emailed
       → POST /api/auth/verify-otp → OTP validated (5min TTL)
       → POST /api/auth/reset-password → password updated in DB
```

### Staff Account Management

```
Owner creates initial Manager:
       → POST /api/staff/create (Owner-scoped request)
       → Payload: { name, email, password, role: 'Manager', branchId }
       → Owner can assign any role including Manager
       → Password hashed (bcrypt) before storage
       → Welcome email sent with login credentials

Manager creates staff:
       → POST /api/staff/create (Manager-scoped request)
       → Payload: { name, email, password, role, branchId }
       → Role must be one of: Waiter | Kitchen | Delivery
           (Manager cannot create another Manager — role guard enforced server-side)
       → Password hashed (bcrypt) before storage
       → Welcome email sent to staff with login credentials (Nodemailer / SendGrid)
       → Staff logs in via POST /api/auth/login with provided credentials

Manager updates staff:
       → PATCH /api/staff/:id
       → Can update: name, email, role, or trigger a password reset email

Manager deactivates staff:
       → PATCH /api/staff/:id/deactivate
       → Account flagged inactive → login blocked at middleware level
       → If staff has an active JWT → server-side blacklist triggered (Redis)
       → Staff is immediately locked out with no grace period
```

---

## 3. Subscription & Payment Flow

```
Access guard (Owner only):
       → All /api/subscriptions/* endpoints are scoped to Owner role
       → Manager and below receive 403 Forbidden on any billing request

Owner selects plan → POST /api/subscriptions/checkout
       → Creates Stripe/bKash/PayPal/SSLCommerz payment session
       → Client redirected to payment gateway

On Success:
       → Gateway redirects to /payment/success?session_id=xxx
       → Server verifies session with gateway API
       → Prisma updates subscription record (plan, status, expiry)
       → Tenant account activated

On IPN (Webhook):
       → POST /api/webhooks/payment-ipn
       → Signature verified (gateway secret)
       → Payment status updated in DB
       → Subscription status synced

On Failure/Cancel:
       → Redirected to /payment/failure or /payment/cancel
       → Subscription remains inactive or previous plan retained

Trial Period:
       → On new tenant registration → subscription record created with status: TRIAL and trialEndsAt timestamp
       → Full platform access during trial; no payment required
       → Cron job checks daily → sends reminder email to Owner 3 days and 1 day before expiry
       → On trial expiry → tenant access restricted to read-only; Owner redirected to plan selection page
       → Owner selects plan → enters standard subscription checkout flow
       → Trial is one-time per tenant; not re-applicable after a paid subscription has been activated

Plan Upgrade/Downgrade:
       → Prorated billing calculated
       → New plan activated immediately
       → Subscription record updated in Prisma
```

---

## 4. Menu & Ordering Flow (Customer)

```
Customer opens menu:
       → GET /api/menu?branchId=xxx
       → Server resolves current time and day-of-week (server-side)
       → Prisma fetches categories, items, modifier groups, upsells
           WHERE branchId = ? AND (
               schedule IS NULL                              -- no schedule = always available
               OR (
                   schedule.startTime <= currentTime AND
                   schedule.endTime   >= currentTime AND
                   schedule.daysOfWeek INCLUDES currentDay
                   AND (schedule.startDate IS NULL OR schedule.startDate <= today)
                   AND (schedule.endDate   IS NULL OR schedule.endDate   >= today)
               )
           )
       → Items outside their active schedule are excluded from response
       → Response cached in Redis (TTL 5min; cache key includes branchId + time slot)
       → Next.js renders menu with Redux cart state

Customer adds item to cart:
       → Item + selected modifiers + special instructions stored in Redux
       → Cart total calculated client-side (base price + modifier prices)
       → Offer/discount badges evaluated against active promo rules
       → If item.isAgeRestricted = true → age gate prompt shown on frontend
           Customer must accept: "I confirm I am 18+ years old" to add item to cart
           ageConfirmed: true included per restricted item in order payload
           Physical ID verification required at pickup / by delivery staff on arrival

Menu Schedule Configuration (Manager / Owner):
       → POST /api/menu/schedules
       → Payload: { branchId, targetType: 'CATEGORY'|'ITEM', targetId, label,
                    startTime, endTime, daysOfWeek[], startDate?, endDate? }
           Example (breakfast): { label: 'Breakfast', startTime: '06:00', endTime: '11:00',
                                   daysOfWeek: ['MON'...'SUN'] }
           Example (seasonal): { label: 'Summer Special', startDate: '2026-06-01', endDate: '2026-08-31' }
       → PATCH /api/menu/schedules/:id → update time window or dates
       → DELETE /api/menu/schedules/:id → remove schedule (item becomes always available)

Customer proceeds to checkout:
       → POST /api/orders/create
       → Payload: { branchId, customerId, items[], orderType, paymentMethod, couponCode?, loyaltyPoints? }
       → Server validates:
           - Menu item is active and within its scheduled time window (if schedule exists)
           - Coupon/loyalty point validity
           - Modifier rules (min/max selections)
           Note: there is no per-item stock count. Item availability is schedule/toggle based.
                 Ingredient deduction happens post-confirmation (see Section 10).
       → Order record created in PostgreSQL (status: PENDING)
       → Payment processed (if online payment)
       → Order status updated to CONFIRMED
       → If loyaltyPoints redeemed → deduct from customer.loyaltyBalance in DB
       → If couponCode applied → increment coupon.usageCount; mark INACTIVE if maxUses reached
       → WebSocket event emitted → KDS and Waiter Dashboard notified
       → Push notification sent to customer
       → On order SERVED or DELIVERED, if order.source = app / website / QR scan and customer is logged in
           → accrue new points: floor(orderTotal × accrualRate) added to customer.loyaltyBalance
           Waiter-placed POS orders do NOT accrue loyalty points (no customer account session)
       → If order source = app / website / QR scan → push rating prompt to customer's device
           Rating prompt NOT sent for POS / waiter-placed orders (no customer session to address)

Order Modification (before Kitchen confirms):
       → PUT /api/orders/:id/items
       → Allowed only while order.status = PENDING (before Kitchen marks COOKING)
       → Who can modify:
           Staff (Waiter / Manager) — any order type
           Customer (dine-in / QR scan orders only) — online/delivery orders cannot be modified by the customer
       → Can add/remove items, change quantities, update modifiers or special instructions
       → Order total recalculated server-side
       → WebSocket event emitted to KDS with updated order details

Order Cancellation (with reason logging):
       → PATCH /api/orders/:id/cancel
       → Payload: { reason: string }
       → Allowed while order.status = PENDING or CONFIRMED (before Kitchen marks COOKING)
       → Customer can cancel any order type (dine-in, QR, delivery, pickup) before cooking starts
       → Staff (Waiter / Manager) can also cancel any order type at the same stage
       → Order status updated to CANCELLED; reason stored on order record in DB
       → If payment was pre-collected → refund triggered via payment gateway
       → Ingredient quantities are NOT restored — cancellations are treated as wastage
       → WebSocket event removes order card from KDS display
       → Customer notified via push notification
```

---

## Loyalty & Rewards Flow

```
Loyalty Configuration (Owner / Manager, set once per tenant):
       → PUT /api/loyalty/config
       → Payload: {
           earningRules: [
             { type: 'PER_SPEND',   pointsPerUnit: 1, currencyUnit: 1.00 },
             { type: 'PER_ITEM',    itemId: 'xxx',    bonusPoints: 5     },
             { type: 'ORDER_TYPE',  orderType: 'DINE_IN', multiplier: 2  }
           ],
           minimumOrderValue: 5.00,
           pointValue: 0.01,
           minimumRedemption: 100,
           maxRedemptionPercent: 20,
           tiers: [
             { name: 'Bronze', minPoints: 0,    earningMultiplier: 1.0  },
             { name: 'Silver', minPoints: 500,  earningMultiplier: 1.25 },
             { name: 'Gold',   minPoints: 2000, earningMultiplier: 1.5  }
           ],
           referralReward: { referrerPoints: 50, refereePoints: 30 },
           pointExpiry:    { enabled: true, inactivityDays: 365 }
         }
       → Stored in tenant.loyaltyConfig (Prisma)
       → GET /api/loyalty/config → returns current config (Owner / Manager only)

Points Accrual (automatic, on order SERVED or DELIVERED):
       → Triggered only when order.source = app / website / QR scan and customer is authenticated
       → Waiter-placed POS orders do not trigger accrual (no customer account linked to the order)
       → Fetch tenant.loyaltyConfig.earningRules for this tenant
       → Apply matching rule(s): PER_SPEND base + PER_ITEM bonus + ORDER_TYPE multiplier
       → Apply tier multiplier based on customer's current tier
       → earnedPoints = floor(calculated total)
       → UPDATE customer SET loyaltyBalance = loyaltyBalance + earnedPoints
       → Push notification: "You earned X points on this order!"
       → Transaction logged in loyalty_ledger table (type: EARN)

Points Redemption (at checkout):
       → Customer submits loyaltyPoints value in order payload
       → Server validates:
           loyaltyPoints ≤ customer.loyaltyBalance
           loyaltyPoints ≥ tenant.loyaltyConfig.minimumRedemption
           discount value ≤ orderTotal × (maxRedemptionPercent / 100)
       → Discount: loyaltyPoints × tenant.loyaltyConfig.pointValue
       → Discount applied to order total before payment
       → On order CONFIRMED → deduct redeemed points from customer.loyaltyBalance
       → Transaction logged in loyalty_ledger table (type: REDEEM)
Coupon Configuration API (Owner / Manager):
       → POST /api/coupons
       → Payload: {
           code: 'DELIVERY20',
           discountType: 'PERCENTAGE', // PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING
           discountValue: 20,
           minOrderValue: 15.00,
           maxDiscountAmount: 5.00,  // Prevents abuse on percentage discounts
           limits: { maxUsesTotal: 50, maxUsesPerCustomer: 1, customerType: 'ALL' },
           applicability: { targetScope: 'ENTIRE_ORDER', orderType: ['DELIVERY'] },
           validity: { startDate: '2026-06-01T00:00:00Z', endDate: '2026-06-30T23:59:59Z' },
           status: 'ACTIVE'
         }
       → Stored in tenant DB with branchId association

Coupon Validation & Lifecycle:
       → couponCode submitted in order payload
       → GET /api/coupons/validate?code=xxx
       → Server checks: code exists, status ACTIVE, not expired, usageCount < maxUses
       → If valid → apply discount (flat amount or percentage, per coupon config)
       → On order CONFIRMED → increment coupon.usageCount
       → If coupon.usageCount >= coupon.maxUses → status set to INACTIVE automatically

Referral Flow:
       → Customer shares referral link containing unique referralCode
       → New customer registers via link → referralCode stored on their account
       → On new customer's first order DELIVERED:
           referrer receives tenant.loyaltyConfig.referralReward.referrerPoints
           referee  receives tenant.loyaltyConfig.referralReward.refereePoints
           Both logged in loyalty_ledger table (type: REFERRAL)

Point Expiry (if enabled in config):
       → Cron job runs nightly
       → Finds customers with no loyalty activity for loyaltyConfig.inactivityDays
       → Expired points logged in loyalty_ledger (type: EXPIRE)
       → customer.loyaltyBalance reset to 0

Balance & History API:
       → GET /api/loyalty/balance     → { loyaltyBalance, tier, pointsToNextTier }
       → GET /api/loyalty/history     → list of earn/redeem/referral/expire transactions
       → GET /api/coupons/my-coupons  → list of available coupons for the customer
```

---

## 5. Real-Time Order Flow (WebSockets)

```
Connection Setup:
       → Client connects via WSS with JWT token
       → Server authenticates and assigns to tenant room

Order Created (Customer/POS/Third-party):
       → Server emits to room: { event: 'NEW_ORDER', order }
       → KDS receives → displays with alert
       → Waiter Dashboard receives → updates table status

Kitchen Updates Order:
       → PATCH /api/orders/:id/status { status: 'COOKING' }
       → Server emits: { event: 'ORDER_STATUS', orderId, status }
       → Waiter Dashboard updates
       → Customer app updates live tracking

Order Ready:
       → Kitchen marks READY
       → WebSocket event → Waiter notified
       → Customer notified via push notification

Order Served / Delivered:
       → Waiter/Delivery marks SERVED or DELIVERED
       → Final WebSocket event → all parties updated
       → Order closed in DB
```

---

## 6. POS Flow

```
Staff authenticates:
       → Email + password → POST /api/auth/login (same flow as all roles)
       → JWT issued with role: Waiter — valid until logout

Order creation:
       → Staff selects table or customer
       → Browses menu (fetched from cache)
       → Adds items, modifiers, tips
       → If customer wishes to redeem loyalty points → staff enters points amount on their behalf
           Server validates: loyaltyPoints ≤ customer.loyaltyBalance, ≥ minimumRedemption,
                             discount ≤ orderTotal × (maxRedemptionPercent / 100)
           Discount applied to order total before payment
           On order CONFIRMED → points deducted from customer.loyaltyBalance
           Transaction logged in loyalty_ledger (type: REDEEM)
       → If item.isAgeRestricted = true → POS prompts age verification
           Waiter verbally confirms customer meets minimum age → clicks Confirm Age
           ageVerified: true + verifiedBy: staffId recorded on the order item in DB
           If not confirmed → item is blocked; cannot be added to the order
       → POST /api/pos/orders/create → same order pipeline as customer flow

Bill generation (auto gratuity):
       → Waiter clicks "Generate Bill" → GET /api/pos/orders/:id/bill
       → Server checks partySize against tenant.settings.autoGratuity
           If enabled AND partySize >= threshold:
               gratuityAmount = orderSubtotal × (gratuityPercent / 100)
               gratuityAmount added as separate line item on the bill
       → Waiter can override gratuity freely → override applied immediately
           Logged for audit: { staffId, orderId, originalGratuity, overriddenAmount, timestamp }
       → Final bill total = subtotal + gratuity + taxes

Auto Gratuity Configuration (Manager / Owner):
       → PATCH /api/settings/auto-gratuity
       → Payload: { enabled: true, partySize: 6, gratuityPercent: 18 }
       → Stored in tenant.settings.autoGratuity (Prisma)

Payment:
       → Cash: logged directly, cash drawer opened via hardware signal
       → Card/Wallet: payment terminal integration
       → Split billing: order split into sub-payments, each recorded separately

Returns/Refunds:
       → Search original invoice → POST /api/pos/returns
       → Return type: VOID (same session) or REFUND (post-payment)
       → Ingredient quantities are NOT restored on return — returned food is treated as wastage; the deducted ingredients remain consumed
       → Refund is financial only: reverse/void payment transaction via gateway if applicable
```

---

## Reservation System Flow

```
Customer Reservation (Online – App / Website):
       → POST /api/reservations/create
       → Payload: { branchId, customerId, date, time, partySize, notes }
       → Server checks table availability for requested date/time/partySize
           SELECT tables WHERE branchId = ? AND capacity >= partySize
               AND NOT EXISTS (reservation overlapping the time slot)
       → If available → reservation record created (status: PENDING)
       → Automated confirmation sent: push notification + email to customer
       → Reservation visible on Waiter / Manager floor map calendar

Walk-in Reservation (Waiter / Manager Dashboard):
       → POST /api/reservations/walk-in
       → Payload: { branchId, customerName, phone, date, time, partySize, notes }
       → No availability pre-check required — staff handles table assignment manually
       → Status: CONFIRMED immediately
       → Appears on floor map and daily reservation calendar

Automated Reminder (Cron Job):
       → Runs X hours before each reservation (configurable per tenant)
       → Sends push notification + email to customer:
           "Your reservation at [Restaurant] is confirmed for [Time] today"

Status Management:
       → PATCH /api/reservations/:id/status
       → Status transitions:
           PENDING → CONFIRMED (staff confirms)
           CONFIRMED → ARRIVED (party arrives, waiter marks on floor map)
           ARRIVED → COMPLETED (party leaves, table freed)
           PENDING / CONFIRMED → CANCELLED (by customer or staff)
       → On ARRIVED → table marked occupied on floor map
       → On CANCELLED → customer notified via push + email

Reservation Calendar (Staff View):
       → GET /api/reservations?branchId=xxx&date=yyyy-mm-dd
       → Returns: [ { time, partySize, customerName, phone, tableId, status } ]
       → Rendered as calendar / list view in Waiter and Manager dashboards
```

---

## 7. Kitchen Display System (KDS) Flow

```
KDS App connects via WebSocket (read-only role)

On new order:
       → Receives NEW_ORDER event
       → Items parsed and routed to station by item.stationTag
           (e.g., "grill", "cold-prep", "fryer")
       → Visual alert + audio ping triggered
       → Order card displayed with: table, items, customizations, priority level

Prep time tracking:
       → Timer starts on order receive
       → Color coding: green (normal) → yellow (approaching limit) → red (overdue)

Status updates:
       → Kitchen taps COOKING → PATCH /api/orders/:id/status
       → WebSocket broadcasts to Waiter + Customer
       → Kitchen taps READY → same broadcast chain

Cuisine color coding:
       → Each menu item carries a cuisineTag (e.g., 'Grill', 'Cold Prep', 'Asian', 'Bakery')
       → KDS renders each order card with a background color mapped to the item's cuisineTag
       → Color-to-cuisine mapping configured per tenant in admin settings
       → Allows kitchen staff to visually identify cuisine type at a glance without reading item names
       → If an order contains multiple cuisines → card uses the primary item's cuisineTag color
```

---

## 8. Delivery Flow

```
Delivery Fee Configuration (Owner / Manager):
       → PATCH /api/settings/delivery-fee
       → Payload: { branchId, baseFee, perKmRate, maxDeliveryKm? }
           baseFee: flat fee applied to every delivery order
           perKmRate: additional charge per km of road distance (e.g., $0.50/km)
           maxDeliveryKm: optional cap — orders beyond this distance are rejected at checkout
       → Settings stored in tenant.settings.deliveryFee (Prisma)

       On delivery order checkout:
           Customer provides delivery address → geocoded via Maps API
           Road distance from branch to customer address calculated via Google Maps / OpenRouteService
           deliveryFee = baseFee + (distanceKm × perKmRate)
           If distanceKm > maxDeliveryKm → "delivery not available to your location" shown to customer
           Fee displayed to customer at checkout before payment is taken

Order assigned to delivery staff:
       → POST /api/delivery/assign { orderId, staffId }
       → Staff app receives WebSocket event

Route optimization:
       → GET /api/delivery/route?orderId=xxx
       → Calls Google Maps / OpenRouteService API
       → Returns optimized route → rendered in staff app

Live GPS tracking:
       → Delivery staff app sends location every 10s
       → POST /api/delivery/location { orderId, lat, lng }
       → Server stores in Redis (fast TTL)
       → Customer polls GET /api/delivery/track/:orderId
         or receives WebSocket push

Order delivered:
       → If order contains age-restricted items → staff app displays ID check alert
           Staff verifies customer age in person before handing over
           Staff taps Confirm Age in app → ageVerifiedAtDoor: true logged on order
           If customer fails ID check → restricted items withheld; refusal logged (reason, timestamp, staffId)
       → Staff marks DELIVERED → PATCH /api/orders/:id/status
       → Customer prompted for rating (delivery order)
       → Delivery metrics updated in DB
```

---

## 9. Third-Party Delivery Integration Flow

```
External platforms (UberEats, Foodpanda, DoorDash):
       → POST to /api/integrations/webhook/:platform
       → Middleware maps platform order format to internal schema
       → Order created in DB with source tag (e.g., source: 'UBEREATS')
       → Enters same order pipeline (KDS → Kitchen → Delivery)

Order status sync:
       → On internal status change → POST to platform's status webhook
       → Platform reflects status in their app

Unified dashboard:
       → GET /api/orders?source=all → returns all orders regardless of source
       → Filtered views by source available for analytics
```

---

## 10. Inventory & Stock Flow

Inventory tracks **raw ingredients** (e.g., chicken breast, flour, olive oil) by unit or weight.
Menu items do not have a stock count — their availability is governed by schedule windows and manual enable/disable toggles, not a quantity field.

```
On order confirmed:
       → Each ordered item's recipe is looked up → its ingredient quantities deducted
       → Prisma: UPDATE ingredients SET quantity = quantity - used WHERE ingredientId = ?
       → Multiple ingredients can be linked to one menu item via the recipe table

Low-stock check:
       → Runs after every ingredient deduction
       → If ingredient.quantity < ingredient.lowStockThreshold
           → push notification + dashboard alert to Manager
           → ingredient flagged in inventory view

Purchase order:
       → Manager creates purchase order → POST /api/purchases
       → On delivery received → ingredient stock quantities updated
       → Vendor payment logged, due dates tracked

Restocking suggestions:
       → Based on average daily ingredient usage × supplier lead time
       → Surfaced on dashboard as actionable alerts

Cost of Production (per menu item):
       → Each ingredient in the Recipe DB carries a unitCost (price per unit/weight, updated on each purchase delivery)
       → Production cost = Σ (ingredientQuantity × ingredientUnitCost) for all recipe ingredients of a menu item
       → GET /api/menu/items/:id/cost → returns calculated production cost
       → Admin dashboard displays: production cost vs. selling price → gross margin % per item
       → Cost auto-recalculates when ingredient unitCost is updated after a new purchase
       → Aggregated food cost % and COGS data fed into P&L financial reports
```

---

## 11. Notification Flow

```
Push Notifications:
       → FCM (Firebase Cloud Messaging) for mobile
       → Web Push API for browser
       → Triggered by: order status change, promo broadcast, low stock

Email Notifications:
       → Nodemailer or SendGrid
       → Triggered by: report generation, billing events, OTP, vendor due reminders

In-app Notifications:
       → Stored in DB → fetched on dashboard load
       → Real-time delivery via WebSocket event

Scheduled Notifications (Cron Jobs):
       → Daily/weekly/monthly sales email → runs at midnight
       → Vendor payment reminders → runs at 9am
       → Tax/salary reminders → runs on configured dates
       → Reservation reminders → runs X hours before each reservation (configurable per tenant); sends push notification + email to customer
       → Trial expiry reminders → cron runs daily; sends email to Owner 3 days before trialEndsAt and again 1 day before; on expiry account restricted to read-only
```

---

## 12. Data & State Management

```
Server State:
       → All persistent data stored in PostgreSQL via Prisma ORM
       → Prisma schema uses tenantId on all models for isolation; branchId for branch-level scoping
       → Redis for: sessions, real-time location, caching (menu, reports)

Client State (Redux):
       → auth slice: user, role, token, tenantId, branchId
       → cart slice: items, modifiers, totals, coupon
       → order slice: active orders, status
       → ui slice: loading states, modals, alerts

Next.js Data Fetching:
       → SSR (getServerSideProps): dashboard pages, order details
       → ISR: menu pages (revalidate every 60s)
       → Client-side: real-time pages (KDS, tracking, POS)
       → API routes: /api/* proxied to Node.js backend or handled in Next.js API layer
```

---

## 13. Security & Compliance

```
Authentication:    JWT (RS256) with short-lived access tokens
Authorization:     Role-based middleware on every protected route
Multi-tenancy:     tenantId enforced at ORM query level (Prisma middleware); branchId scopes branch-level data within tenant
Payments: PCI-DSS compliant via Stripe; raw card data never stored 
on server — Stripe tokens stored for reusable future payments 
(saved cards, subscriptions, one-click checkout)
Data Privacy:      GDPR-compliant data retention policies; soft-delete on user data
API Security:      Rate limiting (express-rate-limit), input sanitization, CORS policy
Transport:         HTTPS enforced; WSS for WebSocket connections
Secrets:           Environment variables via .env; rotated via CI/CD secrets manager
Backups:           Automated PostgreSQL dumps to object storage (daily + on-demand)
```

---

## 14. CI/CD & Deployment

```
Version Control:   Git (GitHub / GitLab)
CI Pipeline:       GitHub Actions
       → On PR: lint, unit tests, integration tests
       → On merge to main: build Next.js app, run Prisma migrations

Deployment:
       → Next.js frontend → Hostinger VPS (PM2)
       → Node.js API → Hostinger VPS (Nginx reverse proxy)
       → PostgreSQL → Managed DB on Hostinger or self-hosted with daily backups
       → Redis → Hostinger managed or self-hosted

Environment Strategy:
       → development → staging → production
       → Prisma migrate deploy run on each environment on deployment
       → Feature flags for gradual rollout of new features
```

---

## 15. Multi-Currency Support

```
Currency Configuration (Owner):
       → Tenant sets a base currency (e.g., BDT, USD, GBP) stored in tenant.settings.baseCurrency
       → Supported display currencies configured per tenant

Customer-Facing Display:
       → Customer selects preferred display currency in app / website settings
       → Menu prices fetched from DB in base currency → converted client-side using cached exchange rates
       → Exchange rates fetched from external API (e.g., Open Exchange Rates) → cached in Redis (TTL: 1 hour)
       → Currency selector shown in customer app header and at checkout

Transactions:
       → All order totals recorded in the tenant base currency in DB
       → Stripe and PayPal handle multi-currency natively; charge in customer's selected currency
       → bKash and SSLCommerz operate in BDT only; shown only when BDT is the active currency

Reporting:
       → All P&L reports and analytics generated in tenant base currency
       → Multi-currency order values converted to base currency at the exchange rate captured at time of transaction
```

---

## 16. Financial Management Flow

```
P&L Report Generation (Owner):
       → GET /api/reports/pl?branchId=xxx&range=daily|weekly|monthly
       → Server aggregates from three sources:
           Revenue:  sum of order totals (status CONFIRMED / SERVED / DELIVERED)
           COGS:     aggregated food cost from ingredient deductions (see Section 10)
           Expenses: pulled from Expense Logs DB, categorized (staff, rent, utilities, supplies)
       → Calculates:
           grossProfit = revenue - COGS
           netProfit   = grossProfit - operatingExpenses
           margin      = netProfit / revenue × 100
       → Response: { revenue, cogs, grossProfit, operatingExpenses, netProfit, margin }
       → Downloadable as PDF / Excel via report generation service
       → Scheduled report auto-emailed to Owner + Accountant (daily/weekly/monthly cron — see Section 11)

Expense Logging (Manager):
       → POST /api/expenses
       → Payload: { branchId, category, amount, date, recurring: bool, notes }
           categories: staff | rent | utilities | supplies | other
       → Stored in Expense Logs DB with tenantId + branchId scope
       → GET /api/expenses?branchId=xxx&range=xxx → returns categorized expense breakdown for dashboard
       → Recurring flag used to distinguish fixed vs one-time costs in P&L view

Salary Payout (Manager processes, Owner has final oversight):
       → Manager reviews staff hours (from shift tracking DB) → POST /api/payroll/process
       → Payload: { branchId, staffId, periodStart, periodEnd, hoursWorked, amount }
       → Salary record stored in Staff & Salary DB; payment status tracked
       → Owner views all payroll records → GET /api/payroll?branchId=xxx
       → Owner marks payout as approved / disbursed

Vendor Payment Tracking (Manager):
       → Manager logs payment against a purchase order → POST /api/vendor-payments
       → Payload: { vendorId, purchaseOrderId, amount, dueDate, status: PENDING | PAID }
       → Stored in Vendor Payments DB
       → Overdue check: daily cron at 9am → any record where dueDate < today AND status = PENDING
           → dashboard alert + email reminder to Manager and Owner (see Section 11)

Financial Calendar & Reminders:
       → Tax filing reminders: Owner configures reminder dates → stored in tenant settings
           → Cron fires on configured dates → email to Owner + Accountant
       → Salary cycle reminders: payroll period end dates → alert to Manager to process payout
       → Monthly goal tracking: Owner sets revenue target → dashboard compares actual vs target in real-time
       → All reminders routed through Section 11 Notification Flow (cron → PN4 → EmailSvc)
```

---

## 17. Floor Mapping System (2D Canvas Builder)

```
Visual Builder (Admin/Manager - "Create First, Place Second" Workflow):
       → Implemented using a 2D canvas library (react-konva or fabric.js)
       → User first creates Table records (number, shape, seating capacity) via modal; stored locally in "Unplaced Tables" list
       → User drags tables from "Unplaced Tables" onto the canvas; system generates correct visual shape based on capacity
       → Selecting a placed table opens a Property Sidebar for dynamic resizing and rotation
       → Entire scene is exported as a JSON object

Database Storage:
       → Exported scene JSON stored in tenant.floorPlans (Prisma)
       → Extracted table entities synced to tables DB for order tracking

Client Rendering (Waiter / Customer):
       → Scene JSON fetched and rendered in read-only interactive mode
       → Tables reflect real-time status (available, reserved, occupied) via WebSockets
```
