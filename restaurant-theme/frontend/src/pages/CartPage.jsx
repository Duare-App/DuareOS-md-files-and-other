import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CAT_LABELS = {
  grocery:     '🥬 Grocery',
  medicine:    '💊 Medicine',
  restaurant:  '🍛 Restaurant',
  laundry:     '👔 Laundry',
  electronics: '⚡ Electronics',
};

export default function CartPage() {
  const navigate  = useNavigate();
  const { items, subtotal, deliveryFee, total, removeItem, updateQty, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Add items from any category to get started.</p>
            <Link to="/" className="btn-primary" style={{ marginTop: 8 }}>
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s-8)' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            🛒 Cart
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--txt-3)', marginLeft: 10 }}>
              ({items.length} item{items.length !== 1 ? 's' : ''})
            </span>
          </h1>
          <button className="btn-danger" id="clear-cart-btn" onClick={clearCart}>
            🗑 Clear all
          </button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items-list">
            {items.map(item => (
              <div key={item.cartId} className="cart-item" id={`cart-item-${item.cartId}`}>
                <div className="cart-item-emoji">{item.emoji}</div>

                <div className="cart-item-info">
                  {/* displayName already contains "Product — Variation" */}
                  <div className="cart-item-name">{item.name}</div>
                  {item.variation && (
                    <div className="cart-item-var">Size / weight: {item.variation.label}</div>
                  )}
                  <div className="cart-item-price">
                    ৳{(item.price * item.quantity).toLocaleString()}
                    {item.quantity > 1 && (
                      <span style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 400, marginLeft: 6 }}>
                        (৳{item.price.toLocaleString()} × {item.quantity})
                      </span>
                    )}
                  </div>
                  <span style={{
                    display: 'inline-block', marginTop: 4, padding: '2px 8px',
                    borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 700,
                    background: 'var(--bg-page)', color: 'var(--txt-3)',
                    border: '1px solid var(--bdr-2)',
                  }}>
                    {CAT_LABELS[item.category] || item.category}
                  </span>
                </div>

                <div className="cart-item-actions">
                  <button
                    className="cart-remove-btn"
                    id={`remove-${item.cartId}`}
                    onClick={() => removeItem(item.cartId)}
                    title="Remove item"
                  >✕</button>
                  <div className="qty-ctrl">
                    <button
                      className="qty-btn"
                      id={`cart-dec-${item.cartId}`}
                      onClick={() => updateQty(item.cartId, item.quantity - 1)}
                    >−</button>
                    <span className="qty-count">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      id={`cart-inc-${item.cartId}`}
                      onClick={() => updateQty(item.cartId, item.quantity + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery fee</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span>৳{total.toLocaleString()}</span>
            </div>

            <button
              id="proceed-checkout-btn"
              className="btn-primary btn-full"
              onClick={() => navigate('/checkout')}
              style={{ marginTop: 'var(--s-5)' }}
            >
              Proceed to Checkout →
            </button>
            <Link
              to="/"
              style={{
                display: 'block', textAlign: 'center', marginTop: 'var(--s-3)',
                fontSize: 13, color: 'var(--txt-3)',
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
