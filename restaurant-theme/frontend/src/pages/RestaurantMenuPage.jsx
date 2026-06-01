import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Rocket, Banknote, Package, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import * as api from '../services/api';

export default function RestaurantMenuPage() {
  const { restaurantId } = useParams();
  const navigate         = useNavigate();
  const { addItem }      = useCart();

  const [restaurant,   setRestaurant]   = useState(null);
  const [allProducts,  setAllProducts]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [sort,         setSort]         = useState('');
  const [activeSection,setActiveSection]= useState('all');    // 'all' or a section name
  const [modalProduct, setModalProduct] = useState(null);
  const [toast,        setToast]        = useState('');
  const searchTimer = useRef(null);
  const sectionRefs = useRef({});  // section name → DOM ref

  // ── Fetch once (no search filter on server — we filter client-side for sections) ──
  const fetchMenu = useCallback(async (q, s) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(q && { search: q }),
        ...(s && { sort: s }),
      });
      const data = await api.getRestaurantProducts(restaurantId, Object.fromEntries(params.entries()));
      if (!data.success) { navigate('/'); return; }
      setRestaurant(data.restaurant);
      setAllProducts(data.products || []);
    } catch {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, navigate]);

  useEffect(() => { fetchMenu('', ''); }, [fetchMenu]);
  useEffect(() => {
    document.body.style.overflow = modalProduct ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalProduct]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchMenu(val, sort);
      setActiveSection('all');
    }, 300);
  };

  const handleSort = (val) => { setSort(val); fetchMenu(search, val); };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const handleModalAdd = (product, variation, quantity) => {
    addItem(product, variation, quantity);
    const label = variation ? `${product.name} — ${variation.label}` : product.name;
    showToast(`✓ ${label} added!`);
  };

  // ── Derive sections from products ──────────────────────────────────────────
  const sections = restaurant?.menuSections || [];

  // Build map: sectionName → products[]
  const sectionMap = {};
  allProducts.forEach(p => {
    const s = p.menuSection || 'Other';
    if (!sectionMap[s]) sectionMap[s] = [];
    sectionMap[s].push(p);
  });

  // Displayed products: if a section is active, only that; else all
  const displayedProducts = activeSection === 'all'
    ? allProducts
    : (sectionMap[activeSection] || []);

  // Sections that have products (ordered as per restaurant.menuSections)
  const activeSections = sections.filter(s => sectionMap[s] && sectionMap[s].length > 0);

  // ── Scroll to section on tab click ─────────────────────────────────────────
  const handleSectionTab = (sec) => {
    setActiveSection(sec);
    if (sec !== 'all' && sectionRefs.current[sec]) {
      sectionRefs.current[sec].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading && !restaurant) {
    return (
      <div className="rest-page">
        <div className="rest-cover-skeleton skeleton" />
        <div className="container" style={{ paddingTop: 90 }}>
          <div className="skeleton" style={{ width: 200, height: 28, borderRadius: 8, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: 300, height: 16, borderRadius: 6 }} />
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  const cover     = restaurant.coverGradient || 'linear-gradient(135deg, #374151 0%, #6B7280 100%)';
  const logoColor = restaurant.logoColor     || '#2563EB';

  return (
    <div className="rest-page">

      {/* ── COVER PHOTO ── */}
      <div className="rest-cover" style={{ background: cover }}>
        <div className="rest-cover-overlay" />
        <div className="container rest-cover-inner">
          <button className="rest-back-btn" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowLeft size={16} /> Back</button>
        </div>
      </div>

      {/* ── LOGO + INFO STRIP ── */}
      <div className="container">
        <div className="rest-info-strip">
          {/* Logo badge — floats up into the cover */}
          <div className="rest-logo-badge" style={{ background: logoColor }}>
            <span className="rest-logo-emoji">{restaurant.emoji}</span>
          </div>

          <div className="rest-info-body">
            <h1 className="rest-name">{restaurant.name}</h1>
            <p className="rest-tagline">"{restaurant.tagline}"</p>

            <div className="rest-meta-row">
              <span className="rest-meta-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="currentColor" color="#F59E0B" /> {restaurant.rating} ({restaurant.reviewCount?.toLocaleString()})</span>
              <span className="rest-meta-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Rocket size={14} /> {restaurant.deliveryTime}</span>
              <span className="rest-meta-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Banknote size={14} /> ৳{restaurant.deliveryFee} delivery</span>
              <span className="rest-meta-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={14} /> Min ৳{restaurant.minOrder}</span>
            </div>

            <div className="rest-tags-row">
              {restaurant.tags.map(t => (
                <span key={t} className="rest-tag" style={{ borderColor: `${logoColor}40`, color: logoColor, background: `${logoColor}12` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY SECTION TABS ── */}
      {activeSections.length > 0 && (
        <div className="rest-section-tabs-wrap">
          <div className="rest-section-tabs">
            <button
              className={`rst-tab${activeSection === 'all' ? ' active' : ''}`}
              onClick={() => setActiveSection('all')}
              style={activeSection === 'all' ? { '--tab-color': logoColor } : {}}
            >
              All
            </button>
            {activeSections.map(sec => (
              <button
                key={sec}
                className={`rst-tab${activeSection === sec ? ' active' : ''}`}
                onClick={() => handleSectionTab(sec)}
                style={activeSection === sec ? { '--tab-color': logoColor } : {}}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── SEARCH + SORT ── */}
      <div className="container">
        <div className="search-sort-bar" style={{ marginTop: 'var(--s-5)' }}>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="restaurant-search"
              className="search-input"
              type="text"
              value={search}
              placeholder={`Search ${restaurant.name} menu…`}
              onChange={e => handleSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => handleSearch('')}>✕</button>}
          </div>
          <select id="restaurant-sort" className="sort-select" value={sort} onChange={e => handleSort(e.target.value)}>
            <option value="">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* ── PRODUCTS: grouped by section or flat ── */}
        {loading ? (
          <div className="loading-grid" style={{ marginTop: 'var(--s-6)' }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-body" style={{ flex: 1 }}>
                  <div className="skeleton skeleton-txt" style={{ width: '50%', marginBottom: 8 }} />
                  <div className="skeleton skeleton-txt" />
                  <div className="skeleton skeleton-txt short" style={{ marginTop: 8 }} />
                </div>
                <div className="skeleton skeleton-img" />
              </div>
            ))}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🔍</span>
            <h3>No items found</h3>
            <p>Try a different search term</p>
            <button className="btn-primary" onClick={() => handleSearch('')} style={{ marginTop: 8 }}>Clear Search</button>
          </div>
        ) : activeSection === 'all' && !search && activeSections.length > 0 ? (
          /* Show sections with sub-headers */
          activeSections.map(sec => (
            <div
              key={sec}
              ref={el => { sectionRefs.current[sec] = el; }}
              className="rest-menu-section"
              style={{ scrollMarginTop: '120px' }}
            >
              <div className="rest-section-header">
                <div className="rest-section-title" style={{ '--sec-color': logoColor }}>{sec}</div>
                <div className="rest-section-count">{sectionMap[sec].length} item{sectionMap[sec].length !== 1 ? 's' : ''}</div>
              </div>
              <div className="products-grid">
                {sectionMap[sec].map(p => (
                  <ProductCard key={p.id} product={p} onCardClick={() => setModalProduct(p)} />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Flat grid for search results or single-section view */
          <>
            <p style={{ fontSize: 13, color: 'var(--txt-3)', margin: 'var(--s-4) 0' }}>
              {displayedProducts.length} item{displayedProducts.length !== 1 ? 's' : ''}
              {activeSection !== 'all' ? ` in ${activeSection}` : ''}
            </p>
            <div className="products-grid">
              {displayedProducts.map(p => (
                <ProductCard key={p.id} product={p} onCardClick={() => setModalProduct(p)} />
              ))}
            </div>
          </>
        )}

        <div style={{ height: 'var(--s-16)' }} />
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
    </div>
  );
}
