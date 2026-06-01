import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, User, Smartphone, Apple, PlayCircle, Star, Folder } from 'lucide-react';
import FeaturedRestaurantsSection from '../components/FeaturedRestaurantsSection';

const CATEGORIES = [
  { id: 'grocery',     name: 'Grocery',     bengali: 'মুদিখানা',    emoji: '🥬', bg: 'var(--cat-grocery-bg)',     accent: 'var(--cat-grocery-accent)',     desc: '45–60 min' },
  { id: 'medicine',   name: 'Medicine',     bengali: 'ওষুধ',         emoji: '💊', bg: 'var(--cat-medicine-bg)',    accent: 'var(--cat-medicine-accent)',    desc: '30–45 min' },
  { id: 'restaurant', name: 'Food',         bengali: 'রেস্তোরাঁ',    emoji: '🍛', bg: 'var(--cat-restaurant-bg)', accent: 'var(--cat-restaurant-accent)',  desc: '30–45 min' },
  { id: 'laundry',    name: 'Laundry',      bengali: 'লন্ড্রি',       emoji: '👔', bg: 'var(--cat-laundry-bg)',    accent: 'var(--cat-laundry-accent)',     desc: '24–48 hrs' },
  { id: 'electronics',name: 'Electronics',  bengali: 'ইলেকট্রনিক্স', emoji: '⚡', bg: 'var(--cat-electronics-bg)',accent: 'var(--cat-electronics-accent)', desc: '2–4 hrs' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  const handleGetStarted = () => {
    if (location) {
      // In a real app, this would save to a context or cookie and fetch local data.
      navigate('/category/restaurant');
    }
  };

  const scrollToDownload = () => {
    const el = document.getElementById('app-download-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">

      {/* ── DoorDash Inspired Hero ── */}
      <section className="doordash-hero">
        <div className="dd-hero-content">
          <h1 className="dd-hero-title">
            Discover restaurants and more near you.
          </h1>

          <div className="dd-search-bar">
            <span className="dd-search-icon" style={{ display: 'flex', alignItems: 'center' }}><MapPin size={20} color="currentColor" /></span>
            <select 
              className="dd-search-input dd-select-reset" 
              value={location} 
              onChange={e => setLocation(e.target.value)}
              required
              style={{ cursor: 'pointer', appearance: 'none', background: 'transparent' }}
            >
              <option value="" disabled hidden>Select your franchise location</option>
              <option value="gulshan">Gulshan Area</option>
              <option value="banani">Banani</option>
              <option value="dhanmondi">Dhanmondi</option>
              <option value="uttara">Uttara</option>
              <option value="mirpur">Mirpur</option>
            </select>
            <button 
              className="dd-search-btn"
              onClick={handleGetStarted}
              disabled={!location}
              style={{ opacity: location ? 1 : 0.6 }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <button style={{ background: '#fff', color: '#333', border: 'none', padding: '10px 16px', borderRadius: '24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> Sign in for saved address
            </button>
            <button onClick={scrollToDownload} style={{ background: '#fff', color: '#333', border: 'none', padding: '10px 16px', borderRadius: '24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} /> Download the App
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Restaurants ── */}
      <FeaturedRestaurantsSection
        title="Featured Stores"
        subtitle="Top-rated restaurants and shops near you"
        apiParams="limit=8"
      />

      {/* ── 3. Browse by Category ── */}
      <section className="mp-section">
        <div className="container">
          <div className="mp-section-hdr">
            <div>
              <h2 className="mp-section-title">Browse by Category</h2>
              <p className="mp-section-sub">Shop all products in a category</p>
            </div>
          </div>

          <div className="cats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--s-4)' }}>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                id={`cat-pill-${cat.id}`}
                className="cat-pill"
                style={{
                  '--cp-bg':     cat.bg,
                  '--cp-accent': cat.accent,
                  animationDelay: `${i * 0.06}s`,
                }}
                onClick={() => navigate(`/category/${cat.id}`)}
              >
                <span className="cp-emoji">{cat.emoji}</span>
                <div className="cp-text">
                  <div className="cp-bengali">{cat.bengali}</div>
                  <div className="cp-name">{cat.name}</div>
                  <div className="cp-desc">{cat.desc}</div>
                </div>
                <span className="cp-arr">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. App Download Section ── */}
      <section id="app-download-section" style={{ backgroundColor: 'var(--brand-light)', padding: '80px 24px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--txt-1)', marginBottom: '16px', fontFamily: 'var(--font-family-primary)' }}>
            Everything at your fingertips
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--txt-2)', marginBottom: '40px', lineHeight: 1.6 }}>
            Download the Duare app for the fastest ordering experience. Get real-time tracking, exclusive offers, and instant access to all your favorite stores.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <button style={{ background: '#000', color: '#fff', borderRadius: '12px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}>
              <Apple size={24} /> Download on the App Store
            </button>
            <button style={{ background: '#000', color: '#fff', borderRadius: '12px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}>
              <PlayCircle size={24} /> Get it on Google Play
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
