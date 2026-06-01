import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const DELIVERY_FEES = {
  grocery: 60, medicine: 40, restaurant: 50, laundry: 30, electronics: 100,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      // cartId is unique per product+variation combo
      const { cartId, quantity: addQty = 1 } = action.payload;
      const existing = state.items.find(i => i.cartId === cartId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + addQty } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.cartId !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.cartId !== action.payload.cartId) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.cartId === action.payload.cartId ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: (() => {
      try { return JSON.parse(localStorage.getItem('duare_cart') || '[]'); }
      catch { return []; }
    })(),
  });

  useEffect(() => {
    localStorage.setItem('duare_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Compute delivery fee from dominant category
  const catCounts = state.items.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + i.quantity;
    return acc;
  }, {});
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const deliveryFee = state.items.length > 0 ? (DELIVERY_FEES[topCat] || 60) : 0;

  const subtotal  = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total     = subtotal + deliveryFee;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  /**
   * addItem — adds a product (with optional variation) to the cart.
   * @param {object} product   — full product object
   * @param {object|null} variation — { key, label, price } or null
   * @param {number} quantity  — how many to add (default 1)
   */
  const addItem = (product, variation = null, quantity = 1) => {
    const cartId      = variation ? `${product.id}-${variation.key}` : product.id;
    const price       = variation ? variation.price : product.price;
    const displayName = variation
      ? `${product.name} — ${variation.label}`
      : product.name;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        cartId,
        productId:   product.id,
        name:        product.name,
        variation:   variation || null,
        displayName,
        price,
        quantity,
        emoji:       product.emoji,
        category:    product.category,
      },
    });
  };

  const removeItem = (cartId) => dispatch({ type: 'REMOVE_ITEM',    payload: cartId });
  const updateQty  = (cartId, qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity: qty } });
  const clearCart  = () => dispatch({ type: 'CLEAR_CART' });

  /** Returns total quantity across ALL variations of a product */
  const getProductQty = (productId) =>
    state.items.filter(i => i.productId === productId).reduce((s, i) => s + i.quantity, 0);

  /** Returns quantity for a specific cartId (product + variation) */
  const getCartItemQty = (cartId) =>
    state.items.find(i => i.cartId === cartId)?.quantity || 0;

  return (
    <CartContext.Provider value={{
      items: state.items, subtotal, deliveryFee, total, itemCount,
      addItem, removeItem, updateQty, clearCart,
      getProductQty, getCartItemQty,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
