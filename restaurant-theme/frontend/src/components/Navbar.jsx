import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const { isLoggedIn, login } = useUser();
  const location      = useLocation();
  const navigate      = useNavigate();
  const isHome        = location.pathname === '/';

  return (
    <nav className={`navbar ${isHome ? 'navbar-home' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link to="/" className="nav-logo" id="nav-logo">
          <img
            src={isHome ? "/duare-logo-white.png" : "/duare-logo.png"}
            alt="Duare logo"
            className="nav-logo-img"
          />
        </Link>

        <div className="nav-actions">
          {!isHome && (
            <button
              id="nav-back-categories"
              className="nav-back-btn"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} /> <span>Categories</span>
            </button>
          )}

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-profile-btn" id="nav-profile-btn" title="My Profile">
                <User size={20} />
              </Link>

              <Link to="/cart" className="nav-cart-btn" id="nav-cart-btn">
                <ShoppingCart size={18} /> Cart
                {itemCount > 0 && (
                  <span className="nav-cart-count">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => login('01711223344')} 
                style={{ background: 'transparent', color: isHome ? '#fff' : 'var(--txt-1)', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '8px 12px' }}
              >
                Sign In
              </button>
              <button 
                className="btn-primary" 
                style={{ padding: '8px 20px', borderRadius: '24px', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                onClick={() => login('01711223344')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
