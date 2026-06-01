import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, StarHalf } from 'lucide-react';

const CAT_COLORS = {
  grocery:     { bg: '#EDFBF3', accent: '#16A34A', tagBg: '#DCFCE7', tagColor: '#15803D' },
  medicine:    { bg: '#EFF6FF', accent: '#2563EB', tagBg: '#DBEAFE', tagColor: '#1E40AF' },
  restaurant:  { bg: '#FEF2F2', accent: '#DC2626', tagBg: '#FEE2E2', tagColor: '#B91C1C' },
  laundry:     { bg: '#FAF5FF', accent: '#7C3AED', tagBg: '#EDE9FE', tagColor: '#5B21B6' },
  electronics: { bg: '#FFFBEB', accent: '#D97706', tagBg: '#FEF3C7', tagColor: '#92400E' },
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="stars" style={{ display: 'inline-flex', gap: '2px', color: '#F59E0B', alignItems: 'center' }}>
      {Array(full).fill().map((_, i) => <Star key={`f-${i}`} size={14} fill="currentColor" color="currentColor" strokeWidth={1} />)}
      {half && <StarHalf key="h" size={14} fill="currentColor" color="currentColor" strokeWidth={1} />}
      {Array(empty).fill().map((_, i) => <Star key={`e-${i}`} size={14} fill="transparent" color="#D1D5DB" strokeWidth={1} />)}
    </span>
  );
}

export default function ProductCard({ product, onCardClick }) {
  const { getProductQty } = useCart();
  const colors  = CAT_COLORS[product.category] || { bg: '#F5F5F5', accent: '#666', tagBg: '#F5F5F5', tagColor: '#666' };
  const totalQty = getProductQty(product.id);

  // Display price: show base price + "from" hint if has variations
  const hasVariations = product.variations && product.variations.length > 0;
  const displayPrice  = hasVariations
    ? Math.min(...product.variations.map(v => v.price))
    : product.price;

  return (
    <div
      className="product-card"
      id={`product-card-${product.id}`}
      style={{
        '--cat-accent-bg':    colors.tagBg,
        '--cat-accent-color': colors.accent,
      }}
      onClick={() => onCardClick(product)}
    >
      {/* Left: text content */}
      <div className="product-card-body">
        {product.tag && (
          <span className="product-tag">{product.tag}</span>
        )}
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="rating-num">{product.rating}</span>
          <span className="rating-rev">({product.reviews?.toLocaleString()})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">
            {hasVariations && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-3)' }}>from </span>}
            ৳{displayPrice.toLocaleString()}
          </span>
          {totalQty > 0 && (
            <span className="in-cart-badge">✓ {totalQty} in cart</span>
          )}
          {hasVariations && (
            <span className="variation-hint">
              {product.variations.length} sizes
            </span>
          )}
        </div>
      </div>

      {/* Right: emoji image + add button */}
      <div className="product-card-right">
        <div
          className="product-img-box"
          style={{ background: colors.bg }}
        >
          {product.emoji}
        </div>
        <button
          id={`quick-add-${product.id}`}
          className={`quick-add-btn${totalQty > 0 ? ' has-items' : ''}`}
          onClick={(e) => { e.stopPropagation(); onCardClick(product); }}
          aria-label={`Add ${product.name} to cart`}
        >
          {totalQty > 0 ? totalQty : '+'}
        </button>
      </div>
    </div>
  );
}
