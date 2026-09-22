# Qavyo Intelligence — AI Features & Requirements

## 1. Purpose

Qavyo Intelligence is the AI-driven business analysis layer of Qavyo.

It should not be positioned as a chatbot. Its purpose is to continuously read business data, identify important patterns, predict problems, and recommend actions to the business owner.

The core principle is:

> Qavyo should not wait for the owner to ask a question. Qavyo should analyze the business and proactively tell the owner what matters and what action should be considered.

---

# 2. Core AI Experience

## Daily Morning Business Brief

Every morning, Qavyo sends the owner an AI-generated business report by email.

The report should summarize:

- Yesterday's sales
- Order/transaction volume
- Average order value
- Sales change versus comparable historical periods
- Best-selling products/services
- Poor-performing products/services
- Products likely to run out
- Recommended purchases
- Unusual changes or anomalies
- Potential profit leaks
- Important customer trends
- Today's expected sales
- Recommended actions

Example:

> **Good morning. Here's what needs your attention today.**
>
> - Sales yesterday: ৳184,500
> - Sales were 8% lower than the comparable previous Monday.
> - Chicken inventory is expected to run out in approximately 3 days.
> - Recommended purchase: 40 kg chicken.
> - Chicken consumption is 14% above the normal pattern.
> - Today's expected sales: ৳195,000–৳210,000.
>
> **Priority:** Review chicken usage and place the recommended purchase.

The report should focus on decisions and actions rather than simply displaying raw statistics.

---

# 3. AI Purchase Recommendations

Qavyo should analyze purchasing requirements and recommend what the business should buy.

The recommendation should consider:

- Current stock
- Historical consumption
- Recent sales
- Day-of-week patterns
- Seasonality
- Upcoming holidays/events where relevant
- Supplier lead time
- Minimum stock levels
- Purchase history
- Branch-level demand
- Expected future demand

Example:

| Product | Current Stock | Expected Need | Recommended Purchase |
|---|---:|---:|---:|
| Chicken | 18 kg | 53 kg | 40 kg |
| Cooking Oil | 12 L | 28 L | 20 L |
| Rice | 75 kg | 60 kg | 0 kg |

Qavyo should explain why an item is being recommended.

Where appropriate, the recommendation should be convertible into a draft purchase order.

---

# 4. Stock-Out Prediction

Qavyo should predict when products or ingredients are likely to run out before the actual stock reaches zero.

Example:

> **Chicken may run out in approximately 3.2 days.**
>
> Expected stock-out: Thursday.

The prediction should use:

- Current stock
- Historical consumption
- Recent consumption
- Predicted demand
- Day-of-week patterns
- Supplier lead time
- Open purchase orders
- Branch-level demand where applicable

The system should prioritize products that could materially affect sales or operations.

---

# 5. Overstock Detection

Qavyo should identify products where the current stock is significantly higher than expected future demand.

Example:

> **Cooking oil is overstocked.**
>
> Current stock: 180 L  
> Expected 30-day consumption: 92 L
>
> **Recommendation:** Do not purchase additional cooking oil for approximately 28 days.

The goal is to help businesses reduce unnecessary working capital tied up in inventory.

---

# 6. Dead Stock & Slow-Moving Stock Detection

Qavyo should identify:

### Dead Stock
Products with no meaningful sales for a defined period.

### Slow-Moving Stock
Products selling substantially below their normal rate.

### Healthy Stock
Products with normal turnover.

### Fast-Moving Stock
Products with unusually strong demand.

The system should recommend actions where appropriate.

Examples:

- Discount
- Promotion
- Bundle
- Stop purchasing
- Transfer between branches
- Review product pricing
- Remove/discontinue product

Example:

> **17 products have not sold in 45 days.**
>
> 5 products appear suitable for a 10–15% promotional discount.

---

# 7. Sales Forecasting

Qavyo should predict expected sales for upcoming periods.

Example:

> **Expected sales today: ৳195,000–৳215,000**

Forecasting should consider:

- Historical sales
- Day of week
- Recent growth/decline
- Seasonality
- Holidays
- Product trends
- Branch trends
- Customer behavior
- Historical comparable periods

The system should provide a range rather than pretending that a forecast is perfectly accurate.

It should also explain the main factors behind major forecast changes.

---

# 8. Sales Change Explanation

Qavyo should automatically investigate meaningful changes in sales.

Example:

> **Sales decreased 12% yesterday.**

Instead of stopping there, Qavyo should analyze potential causes:

- Customer/transaction volume
- Average order value
- Product availability
- Product mix
- Branch performance
- Discounts
- Refunds
- Payment issues
- Operational downtime
- Unusual product-level changes

Example output:

> Sales decreased 12% primarily because customer transactions fell 18%. Two high-selling drinks were also unavailable for approximately 6 hours.

This converts raw reporting into business intelligence.

---

# 9. Profit Leak Detection

Qavyo should identify situations where the business may be losing profitability.

Potential signals:

- Ingredient/product cost increases
- Selling price unchanged
- Increased waste
- Increased discounts
- Increased refunds
- Vendor price changes
- Product mix changes
- Payroll increases
- Expense increases
- Margin deterioration

Example:

> **Estimated gross margin decreased from 31% to 26%.**
>
> Main contributor: chicken purchase cost increased 11% while the selling price remained unchanged.

Qavyo should recommend reviewing pricing, purchasing, waste, or product mix where appropriate.

---

# 10. Waste & Consumption Analysis

This is especially important for restaurants and businesses with consumable inventory.

Qavyo should compare expected consumption against actual inventory movement.

Example:

> 500 burgers sold.
>
> Expected chicken usage: 75 kg  
> Actual chicken usage: 91 kg
>
> **Variance: +16 kg / +21%**

Potential explanations:

- Waste
- Portion size
- Incorrect recipe
- Inventory entry error
- Shrinkage
- Theft
- Incorrect stock adjustment

The system should flag the variance without automatically accusing staff of wrongdoing.

---

# 11. Vendor Intelligence

Qavyo should analyze vendor purchasing history.

For each important vendor, it can track:

- Average purchase price
- Price changes
- Delivery time
- Late deliveries
- Purchase frequency
- Total spending
- Payment/due status
- Product-specific pricing
- Price volatility

Example:

> **ABC Foods**
>
> - Average price increased 8%.
> - Average delivery time: 2.7 days.
> - 3 of the last 10 deliveries were late.
> - Chicken pricing has become more volatile.
>
> **Recommendation:** Compare alternative suppliers before the next chicken purchase.

Qavyo should also identify when the same product is being purchased at materially different prices.

---

# 12. Product & Menu Intelligence

Qavyo should classify products/services using combinations of sales, profitability, and demand.

### High Sales + High Margin
Recommend promoting.

### High Sales + Low Margin
Recommend reviewing pricing/cost.

### Low Sales + High Margin
Potentially promote or reposition.

### Low Sales + Low Margin
Consider discontinuing or replacing.

Example:

> **Burger X is your highest-selling product but its margin is below the business average.**
>
> Consider reviewing its price or ingredient cost.

For restaurants, this can also analyze:

- Menu items
- Ingredients
- Add-ons
- Modifiers
- Recipe costs

---

# 13. Pricing Recommendations

Qavyo can detect when cost changes materially affect margins.

Example:

> Chicken purchase cost increased 9%.
>
> Current Chicken Burger margin: 26%
>
> Previous margin: 31%
>
> **Suggested review:** Consider increasing price from ৳220 to approximately ৳230.

The AI should recommend price changes, not automatically change prices.

The business owner remains in control.

---

# 14. Customer Intelligence

Qavyo should analyze customer behavior and produce reports rather than relying on conversational interaction.

Useful metrics:

- New customers
- Returning customers
- Repeat purchase rate
- Average customer spend
- Purchase frequency
- Customer lifetime value
- Customer retention
- Customer inactivity
- High-value customer segments
- Product affinity

Example:

> Returning customers decreased from 42% to 38% this month.

Or:

> Customers who purchase Product A are 2.3× more likely to purchase Product B.

Qavyo can use these insights to recommend promotions or product bundles.

---

# 15. Branch Performance Intelligence

For multi-branch businesses, Qavyo should automatically compare branches.

Example:

| Branch | Sales | Growth | Margin |
|---|---:|---:|---:|
| Branch A | ৳450k | +12% | 28% |
| Branch B | ৳380k | +4% | 24% |
| Branch C | ৳510k | -9% | 19% |

Then Qavyo should identify the branch requiring attention.

Example:

> **Branch C requires attention.**
>
> Sales declined 9% and gross margin declined 4 percentage points.
>
> The main contributing factors were lower transaction volume and increased product costs.

The system should allow owners to compare:

- Sales
- Profitability
- Inventory
- Staff performance
- Customers
- Purchasing
- Expenses
- Product performance

---

# 16. Staff & Operational Intelligence

Qavyo should use operational data to identify patterns without making unsupported accusations.

Examples:

> Average order processing time increased 18% during 7–9 PM.

> Saturday transaction volume has increased 24%, but staffing has remained unchanged.

> Cash variance is consistently higher during one operating period.

Potential analysis areas:

- Time clock
- POS activity
- Order processing time
- Sales by staff
- Till variance
- Attendance
- Payroll
- Productivity

The purpose is to identify operational issues and opportunities.

---

# 17. Anomaly Detection

Qavyo should continuously look for unusual behavior.

Potential anomalies:

- Sudden sales drop
- Sudden sales spike
- Refund spike
- Inventory loss
- Purchase price spike
- Cash variance
- Expense spike
- Product demand spike
- Unusual staff activity
- Unusual discounting
- Sudden margin decline
- Unexpected customer behavior

Example:

> 🚨 **Unusual activity detected**
>
> Refunds were 3.4× higher than your normal daily average.

The owner should receive an alert when the anomaly is sufficiently important.

---

# 18. Weekly Business Review

Every week, Qavyo should generate a structured business review.

## Fix

Problems requiring attention.

Example:

1. Chicken waste increased 21%.
2. Branch C margin decreased 4%.
3. 8 products are becoming dead stock.

## Opportunities

Potential improvements.

Example:

1. Burger demand increased 18%.
2. Product A and Product B are frequently purchased together.
3. Product C has high margin but low sales.

## Purchases

Recommended purchases.

Example:

1. Chicken — 40 kg
2. Cooking Oil — 25 L
3. Packaging — 1,000 units

## Money

Potential financial impact.

Example:

> Estimated avoidable cost this week: ৳18,400.

---

# 19. Monthly Business Health Score

Qavyo should provide a monthly business health score.

Example:

# Qavyo Business Health
## 82 / 100

| Area | Score |
|---|---:|
| Sales | 91 |
| Inventory | 74 |
| Profitability | 83 |
| Staff | 88 |
| Customers | 79 |
| Purchasing | 76 |

Then provide the single most important conclusion:

> **Your biggest opportunity this month is inventory management.**

The score should be based on measurable historical business data and should explain why the score changed.

---

# 20. Historical Baseline Intelligence

Qavyo should increasingly compare the business against its own historical behavior.

Examples:

> Sales are 14% above your 12-week baseline.

> Inventory turnover improved 8% compared with the previous quarter.

> Customer retention is 5 percentage points below your six-month average.

The system should avoid generic statements such as "sales are good."

It should provide context based on the business's own historical data.

---

# 21. AI Action Recommendations

The most valuable AI output should be an action, not just an observation.

Instead of:

> Chicken stock is low.

Use:

> **Buy 40 kg chicken today.**
>
> Current stock is expected to last 3 days and supplier lead time is 2 days.

Instead of:

> Sales decreased.

Use:

> **Investigate beverage availability.**
>
> Beverage sales decreased 32% yesterday and two top-selling drinks were unavailable for 6 hours.

Instead of:

> Product is slow-moving.

Use:

> **Consider a 10% promotion for Product X.**
>
> It has sold only 4 units in the last 45 days and current stock covers approximately 7 months of expected demand.

The AI should always distinguish between:

- **Observation**
- **Reason**
- **Prediction**
- **Recommendation**
- **Expected impact**

---

# 22. Delivery Channels

Qavyo Intelligence should not require a chatbot.

Primary delivery:

### Email
Daily morning report.

### Qavyo Dashboard
Dedicated Intelligence section showing:

- Today
- Alerts
- Recommendations
- Forecasts
- Weekly review
- Monthly review

### Push Notifications
Only for important events:

- Imminent stock-out
- Major anomaly
- Large margin decline
- Significant sales change
- Critical purchase recommendation

### Scheduled Reports
- Daily
- Weekly
- Monthly

---

# 23. Qavyo Intelligence Architecture Concept

```text
                         QAVYO DATA
                             |
        ┌────────────────────┼────────────────────┐
        |                    |                    |
      SALES              INVENTORY            PURCHASES
        |                    |                    |
     CUSTOMERS            STAFF               VENDORS
        |                    |                    |
     EXPENSES              PAYROLL             BRANCHES
        |                    |                    |
        └────────────────────┼────────────────────┘
                             |
                     DATA / ANALYTICS LAYER
                             |
              ┌──────────────┼──────────────┐
              |              |              |
          Forecasting     Anomaly       Pattern
          & Prediction    Detection     Detection
              |              |              |
              └──────────────┼──────────────┘
                             |
                    QAVYO INTELLIGENCE
                             |
       ┌─────────────┬───────┼───────┬─────────────┐
       |             |       |       |             |
    Daily Brief   Alerts  Actions  Reports    Predictions
       |             |       |       |             |
       └─────────────┴───────┼───────┴─────────────┘
                             |
                    OWNER / MANAGER
```

---

# 24. Priority Roadmap

## Phase 1 — Core Intelligence

1. Morning Business Brief
2. Sales analysis
3. Stock-out prediction
4. Purchase recommendations
5. Sales forecasting
6. Basic anomaly detection

## Phase 2 — Business Optimization

7. Dead/slow stock
8. Overstock detection
9. Profit leak detection
10. Waste analysis
11. Vendor intelligence
12. Product/menu intelligence

## Phase 3 — Advanced Intelligence

13. Customer intelligence
14. Branch intelligence
15. Staff/operational intelligence
16. Pricing recommendations
17. Advanced anomaly detection
18. Business health score

## Phase 4 — Autonomous Recommendations

19. Generate draft purchase orders
20. Generate recommended promotions
21. Recommend product transfers between branches
22. Recommend pricing changes
23. Recommend staffing adjustments
24. Estimate financial impact of recommended actions

The AI should **recommend and prepare actions**, while the owner remains responsible for approving consequential business changes.

---

# 25. Core Product Philosophy

Qavyo Intelligence should follow five rules:

### 1. Don't make the owner search for insights.
Find important information automatically.

### 2. Don't show numbers without context.
Compare against historical baselines and relevant periods.

### 3. Don't stop at problems.
Explain the likely reason and recommended action.

### 4. Don't pretend predictions are certain.
Use confidence levels and ranges where appropriate.

### 5. Don't build a chatbot as the primary experience.
Qavyo Intelligence should work proactively in the background and deliver concise, actionable business intelligence.

## Final Product Positioning

> **Qavyo doesn't just record what happened.**
>
> **Qavyo understands what is happening, predicts what is likely to happen next, and tells the owner what deserves attention.**
