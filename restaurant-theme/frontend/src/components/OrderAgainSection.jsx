import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderHistory from '../data/orderHistory';

/**
 * OrderAgainSection — reusable horizontal scroll strip.
 * Shows the last N orders with product name + restaurant name subtitle.
 * Can be placed on any page by passing a custom `items` prop (defaults to mock history).
 */
export default function OrderAgainSection({ items = orderHistory, limit = 6 }) {
  const navigate = useNavigate();
  const { addItem, getCartItemQty } = useCart();

  if (!items || items.length === 0) return null;
  const visible = items.slice(0, limit);

  const handleAddAgain = (e, histItem) => {
    e.stopPropagation();
    // Re-use the stored variation so the same SKU is re-added
    const product = {
      id:       histItem.productId,
      name:     histItem.name,
      emoji:    histItem.emoji,
      category: histItem.category,
      price:    histItem.price,
      restaurantId: histItem.restaurantId,
    };
    addItem(product, histItem.variation, 1);
  };

  return (
    <section className="mp-section" id="order-again-section">
      <div className="container">
        <div className="mp-section-hdr">
          <div>
            <h2 className="mp-section-title">Order Again</h2>
            <p className="mp-section-sub">Pick up where you left off</p>
          </div>
        </div>

        <div className="h-scroll">
          {visible.map((item, i) => {
            const cartId  = item.variation
              ? `${item.productId}-${item.variation.key}`
              : item.productId;
            const inCart  = getCartItemQty(cartId) > 0;

            return (
              <div
                key={`${item.productId}-${i}`}
                id={`order-again-${item.productId}`}
                className="oa-card"
                onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
                role="button"
                tabIndex={0}
              >
                {/* Emoji image */}
                <div className="oa-img">{item.emoji}</div>

                {/* Info */}
                <div className="oa-body">
                  <div className="oa-name">{item.name}</div>
                  {item.variation && (
                    <div className="oa-variation">{item.variation.label}</div>
                  )}
                  {/* Restaurant source — the key "Order Again" UX requirement */}
                  <div className="oa-restaurant">
                    <span>{item.restaurantEmoji}</span>
                    <span>{item.restaurantName}</span>
                  </div>
                  <div className="oa-price">৳{item.price.toLocaleString()}</div>
                </div>

                {/* Add Again CTA */}
                <button
                  id={`oa-add-${item.productId}`}
                  className={`oa-add-btn${inCart ? ' added' : ''}`}
                  onClick={(e) => handleAddAgain(e, item)}
                  title="Add to cart again"
                >
                  {inCart ? '✓' : '+'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
