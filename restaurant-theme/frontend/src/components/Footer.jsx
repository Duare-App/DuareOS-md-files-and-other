import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'grocery',     label: '🥬 Grocery' },
  { id: 'medicine',   label: '💊 Medicine' },
  { id: 'restaurant', label: '🍛 Restaurant' },
  { id: 'laundry',    label: '👔 Laundry' },
  { id: 'electronics',label: '⚡ Electronics' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">

          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/duare-logo.png" alt="Duare" className="footer-logo-img" />
            </div>
            <p className="footer-tagline">
              Bangladesh's fastest home delivery — groceries, medicines, hot food,
              laundry & electronics, right at your doorstep.
            </p>
          </div>

          <div className="footer-links">
            <h4>Categories</h4>
            <div className="footer-cats">
              {CATEGORIES.map(c => (
                <Link key={c.id} to={`/category/${c.id}`} className="footer-cat-pill">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:16247">📞 16247</a></li>
              <li><a href="mailto:support@duare.com.bd">✉️ support@duare.com.bd</a></li>
              <li>
                <span style={{ fontSize: 13, color: 'var(--txt-3)' }}>
                  📍 Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2024 Duare | দুয়ারে. All rights reserved.</p>
          <p className="footer-made">Made with ❤️ in Bangladesh 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}
