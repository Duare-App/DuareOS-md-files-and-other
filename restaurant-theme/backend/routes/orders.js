const express = require('express');
const router = express.Router();

// In-memory order store (resets on server restart)
let orders = [];

const DELIVERY_TIMES = {
  grocery:     '45–60 minutes',
  medicine:    '30–45 minutes',
  restaurant:  '30–45 minutes',
  laundry:     '24–48 hours',
  electronics: '2–4 hours',
};

const DELIVERY_MINUTES = {
  grocery: 52, medicine: 37, restaurant: 35, laundry: 1440, electronics: 180,
};

// Mock rider pool
const RIDERS = [
  { id: 'R1', name: 'Rahim Hossain', phone: '01712345678', avatar: '👨‍🦱' },
  { id: 'R2', name: 'Karim Uddin',   phone: '01823456789', avatar: '👨'   },
  { id: 'R3', name: 'Lovely Begum',  phone: '01934567890', avatar: '👩'   },
  { id: 'R4', name: 'Sumon Ahmed',   phone: '01645678901', avatar: '👨‍🦳' },
  { id: 'R5', name: 'Nasrin Akter',  phone: '01756789012', avatar: '👩‍🦱' },
];

const ORDER_STATUSES = ['placed', 'assigned', 'processing', 'on_the_way', 'delivered'];

// ── POST /api/orders ─────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  const {
    items, customer, paymentMethod,
    subtotal, deliveryFee, total,
    riderTip, discount, couponDiscount, couponCode,
  } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  if (!customer?.name || !customer?.phone || !customer?.address)
    return res.status(400).json({ success: false, message: 'Customer details are incomplete' });

  const dominantCategory = getDominantCategory(items);
  const orderId          = generateOrderId();
  const rider            = RIDERS[Math.floor(Math.random() * RIDERS.length)];
  const estimatedMinutes = DELIVERY_MINUTES[dominantCategory] || 45;

  const order = {
    id: orderId,
    items, customer,
    paymentMethod:    paymentMethod || 'cash',
    subtotal:         subtotal  || 0,
    deliveryFee:      deliveryFee || 0,
    riderTip:         riderTip  || 0,
    discount:         discount  || 0,
    couponDiscount:   couponDiscount || 0,
    couponCode:       couponCode || null,
    total:            total    || 0,
    status:           'placed',
    estimatedDelivery: DELIVERY_TIMES[dominantCategory] || '45–60 minutes',
    estimatedMinutes,
    dominantCategory,
    rider,
    placedAt: new Date().toISOString(),
  };

  orders.push(order);
  console.log(`✅ New order: ${orderId} | ৳${total} | ${customer.name} | ${dominantCategory} | Rider: ${rider.name}`);

  res.status(201).json({ success: true, message: 'Order placed successfully!', order });
});

// ── GET /api/orders/:id ───────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
});

// ── PATCH /api/orders/:id/status  (demo: advance to next step) ───────────────
router.patch('/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const nextStatus = req.body.status;
  if (nextStatus && ORDER_STATUSES.includes(nextStatus)) {
    order.status = nextStatus;
  } else {
    const cur = ORDER_STATUSES.indexOf(order.status);
    if (cur < ORDER_STATUSES.length - 1) order.status = ORDER_STATUSES[cur + 1];
  }
  res.json({ success: true, order });
});

// ── GET /api/orders ───────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({ success: true, count: orders.length, orders });
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateOrderId() {
  return `DU-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,5).toUpperCase()}`;
}
function getDominantCategory(items) {
  const c = {};
  items.forEach(i => { c[i.category] = (c[i.category] || 0) + i.quantity; });
  return Object.entries(c).sort((a,b) => b[1]-a[1])[0]?.[0] || 'grocery';
}

module.exports = router;
