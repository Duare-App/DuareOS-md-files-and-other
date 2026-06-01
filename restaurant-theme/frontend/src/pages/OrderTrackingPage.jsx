import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { ClipboardList, Bike, ChefHat, Navigation, CheckCircle2, Phone, ArrowLeft } from 'lucide-react';

// ─── Status config ──────────────────────────────────────────────────────────
const STEPS = [
  { key: 'placed',      icon: <ClipboardList size={24} />, label: 'Order Placed',    desc: 'We received your order' },
  { key: 'assigned',    icon: <Bike size={24} />,          label: 'Rider Assigned',  desc: 'A rider has been assigned' },
  { key: 'processing',  icon: <ChefHat size={24} />,       label: 'Processing',      desc: 'Your order is being prepared' },
  { key: 'on_the_way',  icon: <Navigation size={24} />,    label: 'On the Way',      desc: 'Your rider is heading to you' },
  { key: 'delivered',   icon: <CheckCircle2 size={24} />,  label: 'Delivered',       desc: 'Enjoy your order!' },
];

function stepIndex(status) {
  const i = STEPS.findIndex(s => s.key === status);
  return i === -1 ? 0 : i;
}

// Format seconds → MM:SS or HH:MM:SS
function fmtCountdown(secs) {
  if (secs <= 0) return '00:00';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Avatar colours keyed by rider id
const AVATAR_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7'];

export default function OrderTrackingPage() {
  const { orderId }   = useParams();
  const { state }     = useLocation();
  const navigate      = useNavigate();

  const [order,   setOrder]   = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [secsLeft, setSecsLeft] = useState(null);
  const [polled,  setPolled]  = useState(0);   // triggers re-fetch
  const timerRef = useRef(null);
  const pollRef  = useRef(null);

  // ── Fetch / re-fetch order ────────────────────────────────────────────────
  useEffect(() => {
    api.getOrderById(orderId)
      .then(d => { if (d.success) setOrder(d.order); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId, polled]);

  // ── Auto-poll every 15s (simulates real-time status advances in demo) ─────
  useEffect(() => {
    pollRef.current = setInterval(() => {
      api.updateOrderStatus(orderId).then(d => { if (d.success) setPolled(p => p + 1); });
    }, 15000);
    return () => clearInterval(pollRef.current);
  }, []);

  // ── Countdown timer from estimatedMinutes ─────────────────────────────────
  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const placedMs    = new Date(order.placedAt).getTime();
    const totalSecs   = (order.estimatedMinutes || 35) * 60;
    const elapsedSecs = Math.floor((Date.now() - placedMs) / 1000);
    const remaining   = Math.max(0, totalSecs - elapsedSecs);
    setSecsLeft(remaining);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [order]);

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) return (
    <div className="track-page">
      <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3, borderTopColor: 'var(--brand)', borderColor: 'var(--bdr-2)' }} />
        <p style={{ marginTop: 16, color: 'var(--txt-3)' }}>Loading your order…</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="track-page">
      <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 60 }}>😕</div>
        <h2 style={{ marginTop: 16 }}>Order not found</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Back to Home</Link>
      </div>
    </div>
  );

  const currentStep = stepIndex(order.status);
  const isDelivered = order.status === 'delivered';
  const rider       = order.rider;
  const riderColor  = AVATAR_COLORS[(rider?.id?.charCodeAt(1) || 0) % AVATAR_COLORS.length];

  return (
    <div className="track-page">
      <div className="container">

        {/* ── Top bar ── */}
        <div className="track-topbar">
          <button className="back-btn" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div className="track-order-id">Order #{order.id}</div>
            <div className="track-placed-at">
              Placed {new Date(order.placedAt).toLocaleString('en-BD', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
            </div>
          </div>
        </div>

        <div className="track-layout">

          {/* ── LEFT: Progress + Rider ── */}
          <div className="track-left">

            {/* Countdown */}
            {!isDelivered && secsLeft !== null && (
              <div className="track-countdown">
                <div className="countdown-ring">
                  <span className="countdown-time">{fmtCountdown(secsLeft)}</span>
                  <span className="countdown-label">remaining</span>
                </div>
                <div className="countdown-info">
                  <div className="countdown-title">Estimated Delivery</div>
                  <div className="countdown-sub">{order.estimatedDelivery}</div>
                  <div className="countdown-status-badge">
                    {STEPS[currentStep].icon} {STEPS[currentStep].label}
                  </div>
                </div>
              </div>
            )}

            {isDelivered && (
              <div className="track-delivered-banner">
                <span style={{ display: 'flex' }}><CheckCircle2 size={48} color="#15803D" /></span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#15803D' }}>Order Delivered!</div>
                  <div style={{ fontSize: 14, color: 'var(--txt-2)', marginTop: 4 }}>Enjoy your order. Rate your experience below.</div>
                </div>
              </div>
            )}

            {/* Progress steps */}
            <div className="track-steps-card">
              <div className="track-steps-title">Order Progress</div>
              <div className="track-steps">
                {STEPS.map((step, i) => {
                  const done    = i < currentStep;
                  const active  = i === currentStep;
                  return (
                    <div key={step.key} className={`track-step${done ? ' done' : active ? ' active' : ''}`}>
                      {/* Line connector */}
                      {i > 0 && <div className={`track-line${done || active ? ' filled' : ''}`} />}
                      {/* Circle */}
                      <div className="track-circle">
                        {done ? <CheckCircle2 size={20} /> : active ? <span className="step-pulse" /> : step.icon}
                      </div>
                      {/* Label */}
                      <div className="track-step-text">
                        <div className="track-step-label">{step.label}</div>
                        {active && <div className="track-step-desc">{step.desc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rider card */}
            {rider && (
              <div className="rider-card">
                <div className="rider-title">Your Delivery Rider</div>
                <div className="rider-body">
                  {/* Avatar */}
                  <div className="rider-avatar" style={{ background: riderColor }}>
                    <span className="rider-emoji">{rider.avatar || '🧍'}</span>
                    <div className="rider-online-dot" />
                  </div>
                  <div className="rider-info">
                    <div className="rider-name">{rider.name}</div>
                    <div className="rider-role" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Delivery Partner <Bike size={14} /></div>
                    <a href={`tel:${rider.phone}`} className="rider-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={14} /> {rider.phone}
                    </a>
                  </div>
                  <a href={`tel:${rider.phone}`} className="rider-call-btn" title={`Call ${rider.name}`}>
                    <Phone size={18} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="track-right">
            <div className="track-summary-card">
              <div className="track-summary-title">Order Details</div>

              {/* Items */}
              <div className="track-items">
                {order.items?.map((item, idx) => (
                  <div key={item.cartId || idx} className="track-item">
                    <span className="track-item-emoji">{item.emoji}</span>
                    <div className="track-item-info">
                      <div className="track-item-name">{item.displayName || item.name}</div>
                      <div className="track-item-qty">× {item.quantity}</div>
                    </div>
                    <div className="track-item-price">৳{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="track-divider" />

              {/* ── Full invoice breakdown ── */}
              <div className="inv-row">
                <span className="inv-label">Subtotal</span>
                <span>৳{order.subtotal?.toLocaleString()}</span>
              </div>
              {(order.discount > 0) && (
                <div className="inv-row">
                  <span className="inv-label inv-discount">🎁 Discount</span>
                  <span className="inv-discount">-৳{order.discount}</span>
                </div>
              )}
              {(order.couponDiscount > 0) && (
                <div className="inv-row">
                  <span className="inv-label inv-coupon">🏷️ Coupon {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span className="inv-coupon">-৳{order.couponDiscount}</span>
                </div>
              )}
              <div className="inv-row">
                <span className="inv-label">Delivery Fee</span>
                <span>৳{order.deliveryFee}</span>
              </div>
              {(order.riderTip > 0) && (
                <div className="inv-row">
                  <span className="inv-label inv-tip">🤝 Rider Tip</span>
                  <span className="inv-tip">৳{order.riderTip}</span>
                </div>
              )}
              <div className="track-divider" />
              <div className="track-total"><span>Total</span><span>৳{order.total?.toLocaleString()}</span></div>

              <div className="track-divider" />
              {/* Delivery address */}
              <div className="track-addr-label">📍 Delivery Address</div>
              <div className="track-addr">{order.customer?.address}</div>
            </div>

            {/* Actions */}
            <div className="track-actions">
              <Link to="/" className="btn-primary btn-full">🏠 Back to Home</Link>
              <Link to="/profile" className="btn-secondary btn-full">View My Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
