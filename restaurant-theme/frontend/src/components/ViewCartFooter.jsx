import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Pages where the floating "View Cart" bar should NOT appear
const HIDDEN_ON = ['/checkout', '/cart', '/order-success', '/track'];

export default function ViewCartFooter() {
  const { itemCount, total } = useCart();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Hide when no items in cart
  if (itemCount === 0) return null;

  // Hide on cart/checkout/success/tracking pages
  const hide = HIDDEN_ON.some(path => location.pathname.startsWith(path));
  if (hide) return null;

  return (
    <div className="view-cart-footer" id="view-cart-footer">
      <button
        className="view-cart-btn"
        id="view-cart-footer-btn"
        onClick={() => navigate('/cart')}
      >
        <span className="vc-count">{itemCount > 99 ? '99+' : itemCount}</span>
        <span className="vc-label">View Cart</span>
        <span className="vc-price">৳{total.toLocaleString()}</span>
      </button>
    </div>
  );
}
