import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Star, Rocket, Banknote } from 'lucide-react';

/**
 * FeaturedRestaurantsSection — reusable horizontal scroll of restaurant cards.
 * Fetches from /api/restaurants by default.
 * Props:
 *   title      — section heading
 *   subtitle   — section sub-heading
 *   apiParams  — query string params for the fetch (e.g. "promoted=true&limit=8")
 *   restaurants — optional pre-loaded array (skips fetch)
 */
export default function FeaturedRestaurantsSection({
  title    = '⭐ Featured Restaurants',
  subtitle = 'Top-rated stores and restaurants near you',
  apiParams = 'limit=8',
  restaurants: preloaded = null,
}) {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState(preloaded || []);
  const [loading, setLoading]         = useState(!preloaded);

  useEffect(() => {
    if (preloaded) return;
    const paramsMap = Object.fromEntries(new URLSearchParams(apiParams).entries());
    api.getRestaurants(paramsMap)
      .then(d => { setRestaurants(d.restaurants || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiParams, preloaded]);

  if (loading) {
    return (
      <section className="mp-section">
        <div className="container">
          <div className="mp-section-hdr">
            <h2 className="mp-section-title">{title}</h2>
          </div>
          <div className="h-scroll">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="rc-skeleton">
                <div className="skeleton" style={{ width: '100%', height: 90, borderRadius: 12 }} />
                <div className="skeleton" style={{ width: '70%', height: 14, marginTop: 10, borderRadius: 6 }} />
                <div className="skeleton" style={{ width: '50%', height: 12, marginTop: 6, borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!restaurants.length) return null;

  return (
    <section className="mp-section" id="featured-restaurants-section">
      <div className="container">
        <div className="mp-section-hdr">
          <div>
            <h2 className="mp-section-title">{title}</h2>
            <p className="mp-section-sub">{subtitle}</p>
          </div>
          <button className="mp-see-all" onClick={() => navigate('/')}>See all →</button>
        </div>

        <div className="h-scroll">
          {restaurants.map(rest => (
            <div
              key={rest.id}
              id={`resto-card-${rest.id}`}
              className="rc-card"
              style={{ '--rc-bg': rest.bgColor, '--rc-accent': rest.accentColor }}
              onClick={() => navigate(`/restaurant/${rest.id}`)}
              role="button"
              tabIndex={0}
            >
              {rest.promoted && <span className="rc-badge">Promoted</span>}

              {/* Card header — category-tinted */}
              <div className="rc-header" style={{ background: rest.bgColor }}>
                <span className="rc-emoji">{rest.emoji}</span>
              </div>

              {/* Card body */}
              <div className="rc-body">
                <div className="rc-name">{rest.name}</div>
                <div className="rc-tagline">{rest.tagline}</div>

                {/* Tags */}
                <div className="rc-tags">
                  {rest.tags.slice(0, 2).map(t => (
                    <span key={t} className="rc-tag">{t}</span>
                  ))}
                </div>

                {/* Meta row */}
                <div className="rc-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star fill="currentColor" size={14} color="#F59E0B" /> {rest.rating}</span>
                  <span className="rc-dot" />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Rocket size={14} /> {rest.deliveryTime}</span>
                  <span className="rc-dot" />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Banknote size={14} /> ৳{rest.deliveryFee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
