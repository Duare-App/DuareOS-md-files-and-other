import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';
import * as api from '../services/api';

const CAT_COLORS = {
  grocery:     { bg: '#EDFBF3', accent: '#16A34A' },
  medicine:    { bg: '#EFF6FF', accent: '#2563EB' },
  restaurant:  { bg: '#FEF2F2', accent: '#DC2626' },
  laundry:     { bg: '#FAF5FF', accent: '#7C3AED' },
  electronics: { bg: '#FFFBEB', accent: '#D97706' },
};

/**
 * FeaturedProductsSection — reusable 2-col grid of cross-restaurant products.
 * Fetches from /api/featured-products by default, or accepts preloaded `products` prop.
 * Each card shows product name + restaurant name below it.
 */
export default function FeaturedProductsSection({
  title    = 'Featured for You',
  subtitle = 'Best sellers from across all stores',
  limit    = 8,
  categoryId = null,
  products: preloaded = null,
}) {
  const navigate = useNavigate();
  const { addItem, getProductQty } = useCart();

  const [products,     setProducts]     = useState(preloaded || []);
  const [loading,      setLoading]      = useState(!preloaded);
  const [modalProduct, setModalProduct] = useState(null);
  const [toast,        setToast]        = useState('');

  useEffect(() => {
    if (preloaded) return;
    api.getFeaturedProducts({ limit, category: categoryId })
      .then(d => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit, preloaded]);

  // Body scroll lock while modal open
  useEffect(() => {
    document.body.style.overflow = modalProduct ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalProduct]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleModalAdd = (product, variation, quantity) => {
    addItem(product, variation, quantity);
    const label = variation ? `${product.name} — ${variation.label}` : product.name;
    showToast(`✓ ${label} added!`);
  };

  if (loading) {
    return (
      <section className="mp-section">
        <div className="container">
          <div className="mp-section-hdr">
            <h2 className="mp-section-title">{title}</h2>
          </div>
          <div className="fp-grid">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="fp-skeleton">
                <div className="skeleton" style={{ width: '100%', height: 80, borderRadius: 12 }} />
                <div style={{ padding: '12px 14px' }}>
                  <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 6, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '80%', height: 12, borderRadius: 6, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: '40%', height: 16, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="mp-section" id="featured-products-section">
      <div className="container">
        <div className="mp-section-hdr">
          <div>
            <h2 className="mp-section-title">{title}</h2>
            <p className="mp-section-sub">{subtitle}</p>
          </div>
        </div>

        <div className="fp-grid">
          {products.map((product) => {
            const colors   = CAT_COLORS[product.category] || { bg: '#F5F5F5', accent: '#666' };
            const totalQty = getProductQty(product.id);
            const hasVars  = product.variations && product.variations.length > 0;
            const price    = hasVars
              ? Math.min(...product.variations.map(v => v.price))
              : product.price;

            return (
              <div
                key={product.id}
                id={`fp-card-${product.id}`}
                className="fp-card"
                onClick={() => setModalProduct(product)}
                role="button"
                tabIndex={0}
              >
                {/* Image area */}
                <div className="fp-img" style={{ background: colors.bg }}>
                  {product.emoji}
                  {product.tag && (
                    <span
                      className="fp-tag"
                      style={{ background: colors.accent }}
                    >
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="fp-body">
                  <div className="fp-name">{product.name}</div>

                  {/* Restaurant attribution — key requirement */}
                  {product.restaurantName && (
                    <div className="fp-resto">
                      <span>{product.restaurantEmoji}</span>
                      <span>{product.restaurantName}</span>
                      <span
                        className="fp-goto-resto"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restaurant/${product.restaurantId}`);
                        }}
                      >
                        View store →
                      </span>
                    </div>
                  )}

                  <div className="fp-price-row">
                    <span className="fp-price">
                      {hasVars && <span className="fp-from">from </span>}
                      ৳{price.toLocaleString()}
                    </span>
                    <button
                      id={`fp-add-${product.id}`}
                      className={`fp-add-btn${totalQty > 0 ? ' has-items' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setModalProduct(product); }}
                    >
                      {totalQty > 0 ? totalQty : '+'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick-add modal */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAdd={handleModalAdd}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}
