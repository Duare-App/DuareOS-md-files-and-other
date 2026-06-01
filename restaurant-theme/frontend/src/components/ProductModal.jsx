import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const CAT_BG = {
  grocery:     '#EDFBF3',
  medicine:    '#EFF6FF',
  restaurant:  '#FEF2F2',
  laundry:     '#FAF5FF',
  electronics: '#FFFBEB',
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="stars">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function ProductModal({ product, onClose, onAdd }) {
  const hasVariations = product.variations && product.variations.length > 0;

  const [selectedVar, setSelectedVar] = useState(
    hasVariations
      ? (product.variations.find(v => v.key === product.defaultVariation) || product.variations[0])
      : null
  );
  const [qty, setQty] = useState(1);
  const { getCartItemQty } = useCart();

  // When variation changes, reset qty to 1 (or show existing cart qty)
  useEffect(() => {
    const cartId = selectedVar ? `${product.id}-${selectedVar.key}` : product.id;
    const existing = getCartItemQty(cartId);
    setQty(existing > 0 ? existing : 1);
  }, [selectedVar, product.id, getCartItemQty]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const currentPrice = selectedVar ? selectedVar.price : product.price;
  const lineTotal    = currentPrice * qty;
  const catBg        = CAT_BG[product.category] || '#F5F5F5';

  const handleAdd = () => {
    onAdd(product, selectedVar, qty);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      id="product-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-sheet" id={`modal-${product.id}`} role="dialog" aria-modal="true">
        <div className="modal-handle" />

        {/* Header (close btn) */}
        <div className="modal-header">
          <div /> {/* spacer */}
          <button className="modal-close-btn" id="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Product image */}
        <div className="modal-product-img" style={{ background: catBg }}>
          {product.emoji}
        </div>

        {/* Body */}
        <div className="modal-body">
          <h2 className="modal-name">{product.name}</h2>
          <p className="modal-desc">{product.description}</p>
          <div className="modal-rating">
            <StarRating rating={product.rating} />
            <span className="rating-num" style={{ fontSize: 13 }}>{product.rating}</span>
            <span className="rating-rev" style={{ fontSize: 12 }}>({product.reviews?.toLocaleString()} reviews)</span>
          </div>

          {/* Variation chips */}
          {hasVariations && (
            <div>
              <div className="modal-section-title">Choose size / quantity</div>
              <div className="chip-group" id="variation-chip-group">
                {product.variations.map(v => (
                  <button
                    key={v.key}
                    id={`chip-${product.id}-${v.key}`}
                    className={`chip${selectedVar?.key === v.key ? ' selected' : ''}`}
                    onClick={() => setSelectedVar(v)}
                  >
                    <span>{v.label}</span>
                    <span className="chip-price">৳{v.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No variations — just show price */}
          {!hasVariations && (
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--txt-1)', marginBottom: 'var(--s-5)' }}>
              ৳{product.price.toLocaleString()}
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--txt-3)', marginLeft: 8 }}>
                per {product.unit}
              </span>
            </div>
          )}
        </div>

        {/* Sticky footer: qty + add */}
        <div className="modal-footer">
          <div className="modal-qty-ctrl">
            <button
              id="modal-qty-dec"
              className="modal-qty-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
            >−</button>
            <span className="modal-qty-num">{qty}</span>
            <button
              id="modal-qty-inc"
              className="modal-qty-btn"
              onClick={() => setQty(q => q + 1)}
            >+</button>
          </div>

          <button
            id="modal-add-btn"
            className="modal-add-btn"
            onClick={handleAdd}
          >
            <span>Add {qty > 1 ? `${qty} items` : 'to cart'}</span>
            <span>৳{lineTotal.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
