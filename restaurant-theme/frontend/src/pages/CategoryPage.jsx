import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Star, Rocket, Banknote, Package } from 'lucide-react';
import OrderAgainSection from '../components/OrderAgainSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import orderHistory from '../data/orderHistory';

const CAT_META = {
  grocery:     { name: 'Grocery',      bengali: 'মুদিখানা',     emoji: '🥬', hdrBg: '#EDFBF3', accent: '#16A34A', storeLabel: 'grocery stores',    prompt: 'Choose your grocery store' },
  medicine:    { name: 'Medicine',     bengali: 'ওষুধ',          emoji: '💊', hdrBg: '#EFF6FF', accent: '#2563EB', storeLabel: 'pharmacies',         prompt: 'Choose your pharmacy'       },
  restaurant:  { name: 'Food',         bengali: 'রেস্তোরাঁ',     emoji: '🍛', hdrBg: '#FEF2F2', accent: '#DC2626', storeLabel: 'restaurants',        prompt: 'Where do you want to eat?'  },
  laundry:     { name: 'Laundry',      bengali: 'লন্ড্রি',        emoji: '👔', hdrBg: '#FAF5FF', accent: '#7C3AED', storeLabel: 'laundry services',   prompt: 'Choose a laundry service'   },
  electronics: { name: 'Electronics',  bengali: 'ইলেকট্রনিক্স',  emoji: '⚡', hdrBg: '#FFFBEB', accent: '#D97706', storeLabel: 'electronics shops',  prompt: 'Choose a store'             },
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate        = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);

  const meta = CAT_META[categoryId] || {
    name: categoryId, bengali: '', emoji: '🏪', hdrBg: '#F5F5F5', accent: '#555',
    storeLabel: 'stores', prompt: 'Choose a store',
  };

  useEffect(() => {
    setLoading(true); setError(false);
    api.getRestaurants({ category: categoryId })
      .then(d => {
        if (d.success) setRestaurants(d.restaurants || []);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div
      className="category-page"
      style={{ '--cat-hdr-bg': meta.hdrBg, '--cat-accent': meta.accent }}
    >
      {/* ── Category Header ── */}
      <div className="cat-header">
        <div className="container cat-header-inner">
          <button className="back-btn" onClick={() => navigate('/')}>← Home</button>

          <div className="cat-header-content">
            <div className="cat-header-emoji" style={{ background: meta.hdrBg, fontSize: 38 }}>
              {meta.emoji}
            </div>
            <div>
              <div className="cat-header-bengali" style={{ color: meta.accent }}>
                {meta.bengali}
              </div>
              <h1 className="cat-header-title">{meta.name}</h1>
              <div className="cat-header-meta">
                <span style={{ fontSize: 14, color: 'var(--txt-2)' }}>{meta.prompt}</span>
                <span className="cat-header-dot" />
                {!loading && (
                  <span style={{ fontSize: 13, color: 'var(--txt-3)' }}>
                    {restaurants.length} {meta.storeLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Again (Filtered for this category) ── */}
      <OrderAgainSection items={orderHistory.filter(i => i.category === categoryId)} />

      {/* ── Popular Right Now (Filtered for this category) ── */}
      <FeaturedProductsSection 
        title={`Popular in ${meta.name}`} 
        subtitle="Trending items you might like" 
        limit={8} 
        categoryId={categoryId} 
      />

      {/* ── Restaurant / Store Grid ── */}
      <div className="container" style={{ padding: 'var(--s-8) var(--s-6) var(--s-16)' }}>

        {loading && (
          <div className="rl-grid">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rl-skeleton">
                <div className="skeleton" style={{ width: '100%', height: 140, borderRadius: '16px 16px 0 0' }} />
                <div style={{ padding: '16px 20px' }}>
                  <div className="skeleton" style={{ width: '55%', height: 20, borderRadius: 8, marginBottom: 10 }} />
                  <div className="skeleton" style={{ width: '80%', height: 13, borderRadius: 6, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '40%', height: 13, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <span className="empty-emoji">⚠️</span>
            <h3>Couldn't load stores</h3>
            <p>Please try again</p>
            <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: 8 }}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <div className="empty-state">
            <span className="empty-emoji">{meta.emoji}</span>
            <h3>No {meta.storeLabel} yet</h3>
            <p>Check back soon — we're adding more partners!</p>
          </div>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div className="rl-grid">
            {restaurants.map((rest, i) => (
              <div
                key={rest.id}
                id={`rl-card-${rest.id}`}
                className="rl-card"
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => navigate(`/restaurant/${rest.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/restaurant/${rest.id}`)}
              >
                {/* Cover image area */}
                <div className="rl-cover" style={{ background: rest.bgColor || meta.hdrBg }}>
                  <span className="rl-cover-emoji">{rest.emoji}</span>
                  {/* Circular logo badge overlapping the cover bottom */}
                  <div className="rl-logo">{rest.emoji}</div>
                  {rest.promoted && <span className="rl-promoted-badge">Promoted</span>}
                </div>

                {/* Card body */}
                <div className="rl-body">
                  <div className="rl-top-row">
                    <div className="rl-name">{rest.name}</div>
                    <div className="rl-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star fill="currentColor" size={14} color="#F59E0B" /> {rest.rating}
                      <span className="rl-review-count">({rest.reviewCount?.toLocaleString()})</span>
                    </div>
                  </div>

                  <div className="rl-tagline">"{rest.tagline}"</div>

                  {/* Cuisine / service tags */}
                  <div className="rl-tags">
                    {rest.tags.map(t => (
                      <span key={t} className="rl-tag">{t}</span>
                    ))}
                  </div>

                  {/* Delivery meta bar */}
                  <div className="rl-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Rocket size={14} /> {rest.deliveryTime}</span>
                    <span className="rl-meta-dot" />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Banknote size={14} /> ৳{rest.deliveryFee} delivery</span>
                    <span className="rl-meta-dot" />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={14} /> Min ৳{rest.minOrder}</span>
                  </div>

                  <div className="rl-footer">
                    <span className="rl-item-count">{rest.productCount} items</span>
                    <button
                      className="rl-view-btn"
                      style={{ background: rest.accentColor || meta.accent }}
                      onClick={e => { e.stopPropagation(); navigate(`/restaurant/${rest.id}`); }}
                    >
                      View Menu →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
