import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import * as api from '../services/api';
import { ShoppingCart, MapPin, Tag, Check, X, HeartHandshake, CreditCard, Lock, Gift, Banknote, Wallet } from 'lucide-react';

const DIVISIONS = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];

const PAYMENT_OPTIONS = [
  { id: 'cash',  icon: <Banknote size={24} />, label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
  { id: 'bkash', icon: <Wallet size={24} color="#E11471" />, label: 'bKash', sub: 'Mobile banking payment' },
  { id: 'nagad', icon: <Wallet size={24} color="#F97316" />, label: 'Nagad', sub: 'Mobile banking payment' },
  { id: 'card',  icon: <CreditCard size={24} />, label: 'Card',             sub: 'Debit / Credit card' },
];

const VALID_COUPONS = {
  DUARE10: { label: '10% off (max ৳50)', calc: (sub) => Math.min(Math.round(sub * 0.10), 50) },
  SAVE20:  { label: '৳20 off',           calc: ()    => 20 },
  FREE50:  { label: '৳50 cashback',      calc: ()    => 50 },
};

const TIP_PRESETS = [0, 20, 30, 50];

function Field({ id, label, required, error, children }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label}{required && <span className="req">*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--brand)', marginTop: 2 }}>{error}</span>}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, clearCart } = useCart();
  const { isLoggedIn, profile, addresses, addAddress } = useUser();

  // ─── Guest form state ───────────────────────────────────────────────────────
  const [guestForm, setGuestForm] = useState({ name: '', phone: '', division: '', district: '', area: '', address: '', apartment: '' });
  const setG = (f, v) => setGuestForm(g => ({ ...g, [f]: v }));

  // ─── Logged-in address state ────────────────────────────────────────────────
  const defaultAddr = addresses?.find(a => a.isDefault) || addresses?.[0];
  const [selectedAddrId, setSelectedAddrId] = useState(defaultAddr?.id || '');
  const [showNewAddrForm, setShowNewAddrForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', division: '', district: '', area: '', apartment: '', fullAddress: '' });
  const setNA = (f, v) => setNewAddr(a => ({ ...a, [f]: v }));

  // ─── Coupon state ───────────────────────────────────────────────────────────
  const [couponCode,    setCouponCode]    = useState('');
  const [couponData,    setCouponData]    = useState(null);   // null | { label, discount }
  const [couponError,   setCouponError]   = useState('');

  const applyCoupon = () => {
    const key = couponCode.trim().toUpperCase();
    if (!key) return;
    const c = VALID_COUPONS[key];
    if (c) {
      setCouponData({ label: c.label, discount: c.calc(subtotal) });
      setCouponError('');
    } else {
      setCouponData(null);
      setCouponError('Invalid coupon code.');
    }
  };

  // ─── Rider tip state ────────────────────────────────────────────────────────
  const [tipIdx,        setTipIdx]        = useState(0);   // index into TIP_PRESETS, 4 = custom
  const [customTip,     setCustomTip]     = useState('');
  const riderTip = tipIdx < TIP_PRESETS.length ? TIP_PRESETS[tipIdx] : (parseInt(customTip) || 0);

  // ─── Other state ─────────────────────────────────────────────────────────────
  const [payment,  setPayment]  = useState('cash');
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [instructions, setInstructions] = useState('');

  if (items.length === 0) return (
    <div className="checkout-page">
      <div className="container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ color: 'var(--txt-3)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><ShoppingCart size={64} /></div>
        <h2>Cart is empty</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Browse Categories</Link>
      </div>
    </div>
  );

  // ─── Invoice calculations ────────────────────────────────────────────────────
  const discount      = 0;  // future: loyalty discount
  const couponDiscount = couponData?.discount || 0;
  const total          = Math.max(0, subtotal - discount - couponDiscount + deliveryFee + riderTip);

  // ─── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (isLoggedIn) {
      if (!selectedAddrId) e.address = 'Please select a delivery address';
    } else {
      if (!guestForm.name.trim())                     e.name     = 'Required';
      if (!guestForm.phone.match(/^01[3-9]\d{8}$/))  e.phone    = 'Enter valid BD number';
      if (!guestForm.division)                         e.division = 'Required';
      if (!guestForm.district.trim())                  e.district = 'Required';
      if (!guestForm.area.trim())                      e.area     = 'Required';
      if (!guestForm.address.trim())                   e.address  = 'Required';
    }
    return e;
  };

  // ─── Save new address then select it ─────────────────────────────────────────
  const saveNewAddress = () => {
    if (!newAddr.division || !newAddr.district || !newAddr.area || !newAddr.fullAddress) {
      return alert('Please fill all required address fields.');
    }
    const id = addAddress({ ...newAddr, isDefault: false });
    setSelectedAddrId(id);
    setShowNewAddrForm(false);
    setNewAddr({ label: '', division: '', district: '', area: '', apartment: '', fullAddress: '' });
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    let customer;
    if (isLoggedIn) {
      const addr = addresses.find(a => a.id === selectedAddrId);
      customer = {
        name:        profile.name,
        phone:       profile.phone,
        division:    addr.division,
        district:    addr.district,
        area:        addr.area,
        address:     `${addr.apartment ? addr.apartment + ', ' : ''}${addr.fullAddress}`,
        instructions,
      };
    } else {
      customer = {
        name:        guestForm.name,
        phone:       guestForm.phone,
        division:    guestForm.division,
        district:    guestForm.district,
        area:        guestForm.area,
        address:     `${guestForm.apartment ? guestForm.apartment + ', ' : ''}${guestForm.address}, ${guestForm.area}, ${guestForm.district}, ${guestForm.division}`,
        instructions,
      };
    }

    setLoading(true);
    try {
      const data = await api.placeOrder({
        items, customer, paymentMethod: payment,
        subtotal, deliveryFee, riderTip,
        discount, couponDiscount, couponCode: couponData ? couponCode.toUpperCase() : null,
        total,
      });
      if (data.success) {
        clearCart();
        navigate(`/order-success/${data.order.id}`, { state: { order: data.order } });
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">🏠 Checkout</h1>

        {/* Logged-in banner */}
        {isLoggedIn && (
          <div className="co-loggedin-banner">
            <span style={{ fontSize: 20 }}>{profile.avatar}</span>
            <span>Checking out as <strong>{profile.name}</strong> · {profile.phone}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="checkout-layout">

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>

              {/* ── 1. Delivery address ── */}
              <div className="form-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={24} /> Delivery Address</h3>

                {isLoggedIn ? (
                  <>
                    <div className="addr-selector">
                      {addresses.map(addr => (
                        <div
                          key={addr.id}
                          className={`addr-option${selectedAddrId === addr.id ? ' selected' : ''}`}
                          onClick={() => { setSelectedAddrId(addr.id); setShowNewAddrForm(false); }}
                        >
                          <div className="addr-radio">
                            {selectedAddrId === addr.id && <div className="addr-radio-dot" />}
                          </div>
                          <div className="addr-info">
                            <div className="addr-label">
                              {addr.label || '📍 Address'}
                              {addr.isDefault && <span className="addr-default-badge">Default</span>}
                            </div>
                            <div className="addr-text">{addr.fullAddress}</div>
                          </div>
                        </div>
                      ))}

                      {/* Add new address */}
                      {!showNewAddrForm ? (
                        <button
                          type="button"
                          className="addr-add-btn"
                          onClick={() => setShowNewAddrForm(true)}
                        >
                          <div className="addr-add-icon">+</div>
                          Add New Address
                        </button>
                      ) : (
                        <div className="new-addr-form">
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 'var(--s-4)', color: 'var(--txt-1)' }}>
                            ➕ New Address
                          </div>
                          <div className="form-row">
                            <Field id="addr-label" label="Label (e.g. Home, Work)">
                              <input id="addr-label" className="form-input" placeholder="🏠 Home"
                                value={newAddr.label} onChange={e => setNA('label', e.target.value)} />
                            </Field>
                            <Field id="addr-div" label="Division" required>
                              <select id="addr-div" className="form-select" value={newAddr.division}
                                onChange={e => setNA('division', e.target.value)}>
                                <option value="">Select Division</option>
                                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </Field>
                          </div>
                          <div className="form-row">
                            <Field id="addr-dist" label="District" required>
                              <input id="addr-dist" className="form-input" placeholder="e.g. Dhaka"
                                value={newAddr.district} onChange={e => setNA('district', e.target.value)} />
                            </Field>
                            <Field id="addr-area" label="Area / Thana" required>
                              <input id="addr-area" className="form-input" placeholder="e.g. Dhanmondi"
                                value={newAddr.area} onChange={e => setNA('area', e.target.value)} />
                            </Field>
                          </div>
                          <div className="form-row">
                            <Field id="addr-apt" label="Apt / Floor">
                              <input id="addr-apt" className="form-input" placeholder="Flat 4A"
                                value={newAddr.apartment} onChange={e => setNA('apartment', e.target.value)} />
                            </Field>
                            <Field id="addr-full" label="Street Address" required>
                              <input id="addr-full" className="form-input" placeholder="House/Road, landmark"
                                value={newAddr.fullAddress} onChange={e => setNA('fullAddress', e.target.value)} />
                            </Field>
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-4)' }}>
                            <button type="button" className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }} onClick={saveNewAddress}>
                              Save Address
                            </button>
                            <button type="button" className="btn-secondary" style={{ padding: '9px 16px', fontSize: 13 }} onClick={() => setShowNewAddrForm(false)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.address && <span style={{ fontSize: 12, color: 'var(--brand)', marginTop: 6 }}>{errors.address}</span>}

                    {/* Delivery instructions */}
                    <div style={{ marginTop: 'var(--s-5)' }}>
                      <Field id="instructions" label="Delivery Instructions (optional)">
                        <textarea id="instructions" className="form-textarea" rows={2}
                          placeholder="e.g. Ring the bell twice, leave at door…"
                          value={instructions} onChange={e => setInstructions(e.target.value)} />
                      </Field>
                    </div>
                  </>
                ) : (
                  /* Guest form — full address inputs */
                  <>
                    <div className="form-row">
                      <Field id="name" label="Full Name" required error={errors.name}>
                        <input id="name" className="form-input" placeholder="e.g. Rafiqul Islam"
                          value={guestForm.name} onChange={e => setG('name', e.target.value)} />
                      </Field>
                      <Field id="phone" label="Phone" required error={errors.phone}>
                        <input id="phone" className="form-input" placeholder="01XXXXXXXXX"
                          value={guestForm.phone} onChange={e => setG('phone', e.target.value)} maxLength={11} />
                      </Field>
                    </div>
                    <div className="form-row">
                      <Field id="division" label="Division" required error={errors.division}>
                        <select id="division" className="form-select" value={guestForm.division}
                          onChange={e => setG('division', e.target.value)}>
                          <option value="">Select Division</option>
                          {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </Field>
                      <Field id="district" label="District" required error={errors.district}>
                        <input id="district" className="form-input" placeholder="e.g. Dhaka"
                          value={guestForm.district} onChange={e => setG('district', e.target.value)} />
                      </Field>
                    </div>
                    <div className="form-row">
                      <Field id="area" label="Area / Thana" required error={errors.area}>
                        <input id="area" className="form-input" placeholder="e.g. Dhanmondi"
                          value={guestForm.area} onChange={e => setG('area', e.target.value)} />
                      </Field>
                      <Field id="apartment" label="Apt / Floor">
                        <input id="apartment" className="form-input" placeholder="Flat 4A"
                          value={guestForm.apartment} onChange={e => setG('apartment', e.target.value)} />
                      </Field>
                    </div>
                    <Field id="address" label="Full Street Address" required error={errors.address}>
                      <textarea id="address" className="form-textarea" rows={2}
                        placeholder="House/Road number, street, landmark…"
                        value={guestForm.address} onChange={e => setG('address', e.target.value)} />
                    </Field>
                    <Field id="instructions" label="Delivery Instructions (optional)">
                      <textarea id="instructions" className="form-textarea" rows={2}
                        placeholder="e.g. Ring the bell twice…"
                        value={instructions} onChange={e => setInstructions(e.target.value)} />
                    </Field>
                  </>
                )}
              </div>

              {/* ── 2. Coupon ── */}
              <div className="form-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={24} /> Coupon Code</h3>
                <div className="cpn-row">
                  <input
                    id="coupon-input"
                    className={`cpn-input${couponData ? ' valid' : ''}`}
                    placeholder="Enter code (try DUARE10)"
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponData(null); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                  />
                  <button type="button" className="cpn-apply" onClick={applyCoupon}>Apply</button>
                </div>
                {couponData  && <div className="cpn-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={16} /> {couponData.label} applied! -৳{couponData.discount}</div>}
                {couponError && <div className="cpn-error" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><X size={16} /> {couponError}</div>}
              </div>

              {/* ── 3. Rider Tip ── */}
              <div className="form-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HeartHandshake size={24} /> Rider Tip</h3>
                <p style={{ fontSize: 13, color: 'var(--txt-3)', marginBottom: 2 }}>
                  100% goes to your delivery rider. They'll appreciate it!
                </p>
                <div className="tip-chips">
                  {TIP_PRESETS.map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      className={`tip-chip${tipIdx === i ? ' selected' : ''}`}
                      onClick={() => setTipIdx(i)}
                    >
                      {t === 0 ? 'No tip' : `৳${t}`}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`tip-chip${tipIdx === TIP_PRESETS.length ? ' selected' : ''}`}
                    onClick={() => setTipIdx(TIP_PRESETS.length)}
                  >
                    Custom
                  </button>
                  {tipIdx === TIP_PRESETS.length && (
                    <input
                      className="tip-custom-input"
                      type="number" min={0} placeholder="৳ ?"
                      value={customTip}
                      onChange={e => setCustomTip(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {/* ── 4. Payment ── */}
              <div className="form-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={24} /> Payment Method</h3>
                <div className="payment-options">
                  {PAYMENT_OPTIONS.map(opt => (
                    <div key={opt.id} id={`payment-${opt.id}`}
                      className={`payment-option${payment === opt.id ? ' selected' : ''}`}
                      onClick={() => setPayment(opt.id)}>
                      <div className="payment-radio" />
                      <span className="payment-icon">{opt.icon}</span>
                      <div>
                        <div className="payment-label">{opt.label}</div>
                        <div className="payment-sub">{opt.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div>
              <div className="order-summary">
                <h3>Order Summary</h3>

                <div className="checkout-summary-items">
                  {items.map(item => (
                    <div key={item.cartId} className="checkout-summary-item">
                      <div className="cs-emoji">{item.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="cs-name">{item.name}</div>
                        {item.variation && <div className="cs-qty">{item.variation.label}</div>}
                        <div className="cs-qty">× {item.quantity}</div>
                      </div>
                      <div className="cs-price">৳{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* ── Invoice breakdown ── */}
                <div className="summary-divider" />
                <div className="inv-row">
                  <span className="inv-label">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="inv-row">
                    <span className="inv-label inv-discount" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Gift size={16} /> Loyalty Discount</span>
                    <span className="inv-discount">-৳{discount}</span>
                  </div>
                )}
                {couponData && (
                  <div className="inv-row">
                    <span className="inv-label inv-coupon" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={16} /> Coupon ({couponCode.toUpperCase()})</span>
                    <span className="inv-coupon">-৳{couponDiscount}</span>
                  </div>
                )}
                <div className="inv-row">
                  <span className="inv-label">Delivery Fee</span>
                  <span>৳{deliveryFee}</span>
                </div>
                {riderTip > 0 && (
                  <div className="inv-row">
                    <span className="inv-label inv-tip" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HeartHandshake size={16} /> Rider Tip</span>
                    <span className="inv-tip">৳{riderTip}</span>
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-total">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>

                <button id="place-order-btn" type="submit" className="btn-primary btn-full"
                  style={{ marginTop: 'var(--s-5)' }} disabled={loading}>
                  {loading
                    ? <><span className="spinner" /> Placing Order…</>
                    : `Place Order · ৳${total.toLocaleString()}`
                  }
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--txt-3)', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Lock size={12} /> Your information is safe and secure
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
