import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import ProductCard from '../components/ProductCard';
import { NavLink } from 'react-router-dom';
import { Star, Rocket } from 'lucide-react';

// Mocks for components showcase
const mockProduct = {
  id: 'mock1', category: 'grocery', name: 'Fresh Hass Avocado', description: 'Ripe and ready to eat avocados.', price: 120, unit: 'per piece', emoji: '🥑', rating: 4.8, reviews: 342, tag: 'Best Seller',
};

const mockRestaurant = {
  id: 'mock_rest', name: 'Dhaka Kitchen', tagline: 'Authentic Bangladeshi cuisine since 1985', emoji: '🍛', rating: 4.9, reviewCount: 4500, deliveryTime: '30–45 min', deliveryFee: 50, promoted: true, tags: ['Biriyani', 'Halim', 'Bengali'], bgColor: '#FEF2F2', accentColor: '#DC2626'
};

const mockCategory = {
  id: 'grocery', name: 'Grocery', bengali: 'মুদিখানা', emoji: '🥬', bg: 'var(--gray-light)', accent: 'var(--brand)', desc: '45–60 min'
};

export default function DesignSystemPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh', padding: '48px 24px', fontFamily: 'var(--font-family-primary)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 40 }}>
          <NavLink to="/" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: 16 }}>
            ← Back to Home
          </NavLink>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: 'var(--txt-1)' }}>Duare Design System</h1>
          <p style={{ color: 'var(--txt-2)', fontSize: 18, marginTop: 8 }}>
            A centralized playground for all atomic UI components. Update the CSS tokens or the component files directly in <code>src/ui/</code> and watch them update everywhere across the platform.
          </p>
        </div>

        {/* ── TYPOGRAPHY ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--txt-1)', borderBottom: '2px solid var(--bdr-1)', paddingBottom: 12, marginBottom: 24 }}>
            1. Typography
          </h2>
          <Card padding="32px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              <div>
                <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 8, fontWeight: 700 }}>Primary Typeface</h3>
                <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--txt-1)', fontFamily: 'var(--font-family-primary)', lineHeight: 1.1 }}>
                  DuareOne / Outfit
                </div>
                <div style={{ color: 'var(--txt-2)', fontSize: 16 }}>Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 1234567890</div>
              </div>

              <div>
                <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16, fontWeight: 700 }}>Typescale Guidelines</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--txt-3)', fontSize: 14 }}>Heading (H1)</span>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>The quick brown fox</h1>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--txt-3)', fontSize: 14 }}>Subheading (H2)</span>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>The quick brown fox</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--txt-3)', fontSize: 14 }}>Body</span>
                    <p style={{ fontSize: '16px', fontWeight: 400, margin: 0, color: 'var(--txt-2)' }}>The quick brown fox jumps over the lazy dog. A swift movement over the sleepy canine.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--txt-3)', fontSize: 14 }}>Caption</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, margin: 0, color: 'var(--txt-3)' }}>THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</span>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </section>

        {/* ── BUTTONS ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--txt-1)', borderBottom: '2px solid var(--bdr-1)', paddingBottom: 12, marginBottom: 24 }}>
            2. Buttons
          </h2>
          <Card padding="32px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              <div>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16, fontWeight: 700 }}>Variants</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16, fontWeight: 700 }}>Sizes</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Button variant="primary" size="sm">Small Button</Button>
                  <Button variant="primary" size="md">Medium Button</Button>
                  <Button variant="primary" size="lg">Large Button</Button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16, fontWeight: 700 }}>States</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Button variant="primary" disabled>Disabled Primary</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                </div>
              </div>

            </div>
          </Card>
        </section>

        {/* ── BADGES ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--txt-1)', borderBottom: '2px solid var(--bdr-1)', paddingBottom: 12, marginBottom: 24 }}>
            3. Badges
          </h2>
          <Card padding="32px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              <div>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16, fontWeight: 700 }}>Semantic Variants</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Badge variant="default">Default Label</Badge>
                  <Badge variant="primary">Primary Brand</Badge>
                  <Badge variant="success">Completed / Success</Badge>
                  <Badge variant="danger">Cancelled / Alert</Badge>
                  <Badge variant="purple">Premium Feature</Badge>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--txt-3)', marginBottom: 16, fontWeight: 700 }}>Sizes</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Badge variant="primary" size="sm">Small Text</Badge>
                  <Badge variant="primary" size="md">Medium Text</Badge>
                  <Badge variant="primary" size="lg">Large Text</Badge>
                </div>
              </div>

            </div>
          </Card>
        </section>

        {/* ── CARDS ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--txt-1)', borderBottom: '2px solid var(--bdr-1)', paddingBottom: 12, marginBottom: 24 }}>
            4. Surfaces (Cards)
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            
            <Card>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--txt-1)' }}>Standard Card</h3>
              <p style={{ color: 'var(--txt-2)' }}>This is a default static card used for displaying information or lists without hover interactions.</p>
            </Card>

            <Card interactive padding="32px">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--txt-1)' }}>Interactive Card</h3>
              <p style={{ color: 'var(--txt-2)', marginBottom: 16 }}>Hover over me! This card elevates on mouse-over, perfect for clicking onto new routes.</p>
              <Button variant="outline" size="sm">Click Card</Button>
            </Card>

          </div>
        </section>

        {/* ── COMPLEX COMPONENTS & LIST CARDS ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--txt-1)', borderBottom: '2px solid var(--bdr-1)', paddingBottom: 12, marginBottom: 24 }}>
            5. Complex Components & List Cards
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            
            {/* Category Pill */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--txt-1)' }}>A. Category List Card</h3>
              <p style={{ color: 'var(--txt-2)', marginBottom: 16 }}>Used repeatedly on the Landing Page.</p>
              <div className="cat-pill" style={{ '--cp-bg': mockCategory.bg, '--cp-accent': mockCategory.accent, width: 180, cursor: 'pointer' }}>
                <span className="cp-emoji">{mockCategory.emoji}</span>
                <div className="cp-text">
                  <div className="cp-bengali">{mockCategory.bengali}</div>
                  <div className="cp-name">{mockCategory.name}</div>
                  <div className="cp-desc">{mockCategory.desc}</div>
                </div>
              </div>
            </div>

            {/* Restaurant Card */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--txt-1)' }}>B. Store/Restaurant Card</h3>
              <p style={{ color: 'var(--txt-2)', marginBottom: 16 }}>Used in featured sliders to showcase vendors.</p>
              <div className="rc-card" style={{ '--rc-bg': mockRestaurant.bgColor, '--rc-accent': mockRestaurant.accentColor, width: 280, cursor: 'pointer' }}>
                {mockRestaurant.promoted && <span className="rc-badge">Promoted</span>}
                <div className="rc-header" style={{ background: mockRestaurant.bgColor }}><span className="rc-emoji">{mockRestaurant.emoji}</span></div>
                <div className="rc-body">
                  <div className="rc-name">{mockRestaurant.name}</div>
                  <div className="rc-tagline">{mockRestaurant.tagline}</div>
                  <div className="rc-tags">{mockRestaurant.tags.slice(0, 2).map(t => <span key={t} className="rc-tag">{t}</span>)}</div>
                  <div className="rc-meta"><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star fill="currentColor" size={14} color="#F59E0B" /> {mockRestaurant.rating}</span><span className="rc-dot" /><span><Rocket size={14} /> {mockRestaurant.deliveryTime}</span></div>
                </div>
              </div>
            </div>

            {/* Product Card */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--txt-1)' }}>C. Product Catalog Card</h3>
              <p style={{ color: 'var(--txt-2)', marginBottom: 16 }}>The atomic building block of all store menus and featured items.</p>
              <div style={{ maxWidth: 350 }}>
                <ProductCard product={mockProduct} onCardClick={() => {}} />
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
