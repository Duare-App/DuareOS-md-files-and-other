import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import * as api from '../services/api';
import { CheckCircle2, Frown, Clock, Banknote, Wallet, CreditCard, Navigation, Home, Bike } from 'lucide-react';

const PAYMENT_LABELS = {
  cash:  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Banknote size={14} /> Cash on Delivery</span>,
  bkash: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Wallet size={14} color="#E11471" /> bKash</span>,
  nagad: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Wallet size={14} color="#F97316" /> Nagad</span>,
  card:  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CreditCard size={14} /> Card</span>,
};

export default function OrderSuccessPage() {
  const { orderId }       = useParams();
  const { state }         = useLocation();
  const [order, setOrder]   = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);

  useEffect(() => {
    if (!state?.order) {
    api.getOrderById(orderId)
      .then(d => { if (d.success) setOrder(d.order); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderId, state]);

  if (loading) {
    return (
      <div className="success-page">
        <div style={{ textAlign: 'center' }}>
          <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3, borderTopColor: 'var(--brand)', borderColor: 'var(--bdr-2)' }} />
          <p style={{ marginTop: 16, color: 'var(--txt-3)' }}>Loading your order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="success-page">
        <div className="success-card" style={{ textAlign: 'center' }}>
          <Frown size={64} style={{ marginBottom: 16, color: 'var(--txt-3)' }} />
          <h2 style={{ marginBottom: 8 }}>Order not found</h2>
          <p style={{ color: 'var(--txt-3)', marginBottom: 24 }}>
            We couldn't find order <strong>{orderId}</strong>.
          </p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const placed = new Date(order.placedAt).toLocaleString('en-BD', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="success-page">
      <div className="success-card">
        {/* Icon */}
        <div className="success-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={40} /></div>

        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-subtitle">
          Thank you, <strong>{order.customer.name}</strong>!<br />
          Your order has been received and is being prepared.
        </p>

        {/* Order info grid */}
        <div className="order-info-grid">
          <div className="order-info-item">
            <span>Order ID</span>
            <span id="success-order-id" style={{ fontSize: 12, wordBreak: 'break-all' }}>{order.id}</span>
          </div>
          <div className="order-info-item">
            <span>Total</span>
            <span>৳{order.total?.toLocaleString()}</span>
          </div>
          <div className="order-info-item">
            <span>Payment</span>
            <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
          </div>
          <div className="order-info-item">
            <span>Est. Delivery</span>
            <span style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {order.estimatedDelivery}</span>
          </div>
          <div className="order-info-item" style={{ gridColumn: '1 / -1' }}>
            <span>Delivery Address</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{order.customer.address}</span>
          </div>
          <div className="order-info-item" style={{ gridColumn: '1 / -1' }}>
            <span>Placed At</span>
            <span style={{ fontSize: 13 }}>{placed}</span>
          </div>
        </div>

        {/* Items Invoice */}
        <div style={{
          background: 'var(--bg-page)', borderRadius: 'var(--r-lg)', padding: 'var(--s-5)',
          marginBottom: 'var(--s-6)', textAlign: 'left',
          border: '1px solid var(--bdr-1)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt-1)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Detailed Invoice
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, textAlign: 'left', marginBottom: 24 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bdr-2)', color: 'var(--txt-3)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                <th style={{ paddingBottom: 10, fontWeight: 700 }}>Product</th>
                <th style={{ paddingBottom: 10, fontWeight: 700, textAlign: 'center' }}>Qty</th>
                <th style={{ paddingBottom: 10, fontWeight: 700, textAlign: 'right' }}>Unit Price</th>
                <th style={{ paddingBottom: 10, fontWeight: 700, textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={item.cartId || idx} style={{ borderBottom: '1px solid var(--bdr-1)' }}>
                  <td style={{ padding: '14px 0', fontWeight: 600, color: 'var(--txt-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{item.emoji}</span>
                    <span>
                      {item.displayName || item.name}
                      {item.variation && <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 400, marginTop: 2 }}>{item.variation.label}</div>}
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', textAlign: 'center', color: 'var(--txt-2)' }}>{item.quantity}</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', color: 'var(--txt-2)' }}>৳{item.price.toLocaleString()}</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, color: 'var(--txt-1)' }}>
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, marginLeft: 'auto', width: '100%', maxWidth: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--txt-2)' }}>
              <span>Sub Total</span>
              <span style={{ fontWeight: 600 }}>
                ৳{(order.subtotal || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0).toLocaleString()}
              </span>
            </div>
            
            {((order.discount || 0) + (order.couponDiscount || 0)) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803D' }}>
                <span>Discount</span>
                <span style={{ fontWeight: 600 }}>-৳{((order.discount || 0) + (order.couponDiscount || 0)).toLocaleString()}</span>
              </div>
            )}
            
            {(order.deliveryFee > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--txt-2)' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 600 }}>৳{order.deliveryFee?.toLocaleString()}</span>
              </div>
            )}
            
            {(order.riderTip > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--txt-2)' }}>
                <span>Rider Tip</span>
                <span style={{ fontWeight: 600 }}>৳{order.riderTip?.toLocaleString()}</span>
              </div>
            )}
            
            <div style={{
              borderTop: '2px solid var(--bdr-2)', marginTop: 10, paddingTop: 10,
              display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 18, color: 'var(--txt-1)'
            }}>
              <span>Grand Total</span>
              <span>৳{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery tracker */}
        <div style={{
          background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--r-lg)',
          padding: 'var(--s-4)', marginBottom: 'var(--s-8)',
          display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        }}>
          <span style={{ display: 'flex' }}><Bike size={32} color="#15803D" /></span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#15803D' }}>On its way!</div>
            <div style={{ fontSize: 13, color: 'var(--txt-2)' }}>
              Estimated arrival: <strong style={{ color: 'var(--txt-1)' }}>{order.estimatedDelivery}</strong>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <Link to={`/track/${order.id}`} className="btn-primary" style={{ flex: 1, padding: 14, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={18} /> Track Order
          </Link>
          <Link to="/" className="btn-secondary" id="back-home-btn" style={{ flex: 1, padding: 14, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={18} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
