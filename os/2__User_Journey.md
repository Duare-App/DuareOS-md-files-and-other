# User Journey Document

## 1. Restaurant Owner (Tenant Onboarding & Management)

### 1.1 Onboarding
1. Lands on marketing/landing page
2. Clicks **Get Started** → Registration form (restaurant name, email, password, branch info)
3. Email verification sent → clicks link → account activated; isolated tenant database schema created
4. **Trial period begins automatically** – full platform access for the configured trial duration; no payment required
5. At any point during trial (or on expiry) → redirected to **Subscription Plan Selection** page
6. Selects plan → enters payment details (Stripe / bKash / PayPal / SSLCommerz)
7. Payment success → subscription status updated to ACTIVE
8. Lands on **Admin Dashboard** with setup checklist

### 1.2 Initial Setup
1. Creates menu categories (e.g., Burgers, Drinks, Sides)
2. Adds menu items with images, prices, descriptions, modifier groups, and upsell recommendations
3. Configures modifier groups (e.g., Add-ons, Sides, Drinks) with min/max selection rules
4. Sets up tax rates per item/category
5. Configures discount and promo rules (coupon codes with financial caps, usage limits, and time schedules)
6. Adds initial Manager account(s) and assigns to branch(es) — Manager then creates Waiter, Kitchen, and Delivery staff
7. Sets up tables using the 2D Canvas Builder's "Create First, Place Second" workflow (defining table capacity and numbers first, then dragging them from an "Unplaced" sidebar onto the visual floor map) and generates QR codes per table
8. Configures delivery fee settings – base fee, per-km rate, and maximum delivery distance
9. Connects third-party delivery platforms (UberEats, Foodpanda, etc.)
10. Optionally configures loyalty program, auto gratuity rules, and menu schedules – can also be configured or updated later by the Manager

### 1.3 Daily Operations Monitoring
1. Logs in → views Admin Dashboard (daily sales, active orders, low-stock alerts, revenue)
2. Reviews Sales Analytics – top-selling items, payment method breakdown, channel comparison
3. Reviews Financial P&L reports – gross profit, net profit, expense breakdown
4. Reviews staff schedules; has final oversight of salary payouts processed by Manager
5. Monitors vendor dues and receives payment reminders
6. Downloads PDF/Excel reports or receives email summaries

### 1.4 Subscription Management
1. Navigates to **Billing** page
2. Views current plan, usage, and renewal date
3. Upgrades, downgrades, or renews plan
4. Views payment history and invoices

---

## 2. Manager

### 2.1 Daily Operations
1. Logs in → lands on Manager Dashboard (branch-specific view)
2. Reviews open orders, table occupancy, and kitchen status
3. Manages staff shift scheduling and tracks working hours
4. Handles expense logging (daily/weekly/monthly)
5. Reviews inventory levels, acts on low-stock alerts, raises purchase orders to suppliers
6. Reviews purchase invoices and logs vendor payments
7. Monitors delivery performance and ratings
8. Reviews staff hours and processes salary payouts

### 2.2 Menu & Inventory Control
1. Updates menu item availability (enable/disable items)
2. Adjusts pricing and modifier groups as needed
3. Logs new stock arrivals and updates inventory quantities
4. Reviews restocking suggestions and places supplier orders
5. Configures or updates delivery fee settings – base fee, per-km rate, and maximum delivery distance for the branch
6. Configures or updates loyalty program settings – earning rules, redemption value, tier thresholds, referral rewards, and expiry policy
7. Configures auto gratuity rule – sets party size threshold (e.g., 6+ guests) and gratuity percentage (e.g., 18%); system auto-applies gratuity to large group bills
8. Configures menu schedules – sets time windows for when each category or item is available (e.g., Breakfast menu 6am–11am, Lunch 11am–3pm, Dinner 5pm–10pm, seasonal specials by date range)
9. Configures or updates coupon codes – sets discount type, minimum spend, maximum discount cap, usage limits, and applicable items/categories

### 2.3 Staff Account Management
1. Navigates to **Staff Management** in Manager Dashboard
2. Clicks **Add Staff Member** → fills in name, email, password, and role (Waiter / Kitchen / Delivery)
3. Submits → system creates staff account and sends welcome email with login credentials
4. Staff member logs in immediately using provided email and password
5. Manager can edit staff details (name, email, role) or reset their password at any time
6. Manager deactivates a staff account → account blocked from login immediately; any active JWT for that staff is blacklisted server-side via Redis

---

## 3. Waiter

### 3.1 Table Order Flow
1. Logs in with email and password (credentials created by Manager)
2. Views **Floor Map** – sees occupied, reserved, and available tables
3. Selects a table → opens order input interface
4. Browses menu by category → adds items with customizations and special instructions
   - If item is age-restricted (e.g., alcohol) → age verification prompt appears on POS screen
   - Waiter verbally confirms customer meets minimum age → clicks **Confirm Age** to proceed
   - If customer cannot verify age → item is blocked and cannot be added to the order
5. Confirms order → sent to **Kitchen Display System (KDS)** in real-time
6. Monitors order status updates (Cooking → Ready → Served)
7. When customer requests bill → generates bill, applies discounts/loyalty points if applicable
   - If party size meets or exceeds auto gratuity threshold → gratuity auto-applied as a separate line item on the bill
   - Waiter can override if customer disputes (override logged for audit with timestamp)
8. Logs tip at checkout
9. Processes payment (cash, card, mobile wallet)
10. Marks table as available after customer leaves

### 3.2 Hold & Split Orders
1. Places order on hold if customer is not ready
2. Retrieves held order when customer is ready
3. Splits bill between multiple customers if requested
4. Merges tables for large groups

### 3.3 Walk-in & Reservation Management
1. Views reservation calendar on the floor map – sees all reservations for the day (Pending, Confirmed, Arrived) with time, party size, and customer name
2. When a reserved party arrives → marks reservation as **Arrived** → assigns table on the floor map
3. Enters walk-in reservation for customers without prior booking (name, phone, party size, preferred time)
4. Cancels or updates a reservation status if needed (e.g., no-show → Cancelled)

---

## 4. Kitchen Staff

### 4.1 Order Receiving & Processing
1. Logs in → KDS screen displays incoming orders in real-time
2. New order triggers sound/visual alert
3. Views order details – items, customizations, special instructions, table number
4. Items are routed to appropriate kitchen station (grill, cold prep, fryer, etc.)
5. Updates order status → **Cooking**
6. Tracks prep time per order
7. Order cards automatically change color based on elapsed prep time – green (on track), yellow (approaching limit), red (overdue)
8. Updates status → **Ready** when complete
9. Waiter is notified → picks up and serves → marks **Served**

---

## 5. Delivery Staff

### 5.1 Delivery Flow
1. Logs in → views assigned delivery orders
2. Accepts order → picks up from kitchen when marked Ready
3. App provides optimized delivery route via GPS
4. Customer receives live GPS tracking link
5. If order contains age-restricted items → app displays alert: **"ID check required"** → delivery staff verifies customer age before handing over
   - If customer cannot verify age → do not hand over restricted items; log refusal in app
6. Marks order as **Delivered** upon completion
7. Customer rates delivery experience

---

## 6. Customer (App & Website)

### 6.1 Browse & Order (Online)
1. Opens app or website (or scans QR code at table)
2. Browses menu – filtered by category, with images, descriptions, and prices
3. Sees offer badges (e.g., Buy 1 Get 1 Free) on eligible items
4. Selects item → if item is age-restricted (e.g., alcohol) → age gate prompt shown: *"I confirm I am 18+ years old"* → must accept to add to cart
5. Views modifier groups (add-ons, sides, drinks, desserts)
6. Adds special instructions (e.g., "no onions")
7. Views upsell recommendations → optionally adds to cart
8. Selects order type – Dine-in / Pickup / Delivery
9. If **Delivery** → enters delivery address → system geocodes address and calculates road distance from branch → delivery fee (base fee + per-km rate) shown at checkout; if distance exceeds maximum delivery range, delivery is unavailable and customer must select Pickup instead
10. Applies coupon code or redeems loyalty points
11. Proceeds to checkout → selects payment method
12. Pays → receives order confirmation with estimated time
13. If order is **Dine-in or QR scan** → can modify order (add/remove items) while status is **Pending**; online (Delivery / Pickup) orders cannot be modified by the customer
14. Can cancel order while status is **Pending** or **Confirmed** (before kitchen starts cooking) for any order type → receives cancellation confirmation notification
15. Tracks live order status (Confirmed → Cooking → Ready → Out for Delivery → Delivered)
16. Receives push notification at each status change
17. Post-order → prompted to rate items and delivery

### 6.2 Table Reservation
1. Opens app/website → navigates to **Reserve a Table**
2. Selects date, time, party size, and branch
3. Submits reservation → receives confirmation notification
4. Receives automated reminder before reservation time
5. Arrives → waiter sees reservation on floor map and assigns table
6. Can cancel reservation via app/website at any point while status is **Pending** or **Confirmed** → receives cancellation confirmation notification

### 6.3 Account & Loyalty
1. Registers/logs in → manages profile and saved addresses
2. Views order history → reorders with one tap
3. Tracks loyalty points balance and available rewards
4. Refers friends via referral link → earns bonus points
5. Redeems points or coupons at checkout

---

## 7. Accountant (Report Recipient)

1. Receives automated email summaries (daily/weekly/monthly)
2. Downloads P&L reports, expense logs, and payment records in PDF/Excel
3. Reviews tax filing reminders and vendor payment due alerts
4. Reviews salary payout schedule from financial calendar
