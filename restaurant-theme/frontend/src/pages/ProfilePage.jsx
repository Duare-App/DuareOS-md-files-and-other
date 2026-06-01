import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User, Package, MapPin, Heart, Wallet, Bell, Moon, Globe, Lock, Headphones, Phone, LogOut, Gift, Tag, HeartHandshake, Lightbulb, Pencil } from 'lucide-react';

const STATUS_COLORS = {
  delivered:   { bg: '#DCFCE7', color: '#15803D', label: 'Delivered'   },
  on_the_way:  { bg: '#FEF3C7', color: '#D97706', label: 'On the Way'  },
  processing:  { bg: '#DBEAFE', color: '#2563EB', label: 'Processing'  },
  placed:      { bg: '#F5F5F5', color: '#555',    label: 'Placed'      },
};

const MOCK_ORDERS = [
  {
    id: 'DU-DEMO001', date: 'Apr 12, 2026', status: 'delivered', total: 430,
    subtotal: 380, deliveryFee: 50, discount: 0, couponDiscount: 0, riderTip: 0,
    items: [{ emoji: '🍛', name: 'Kacchi Biriyani', variation: 'Executive (large)', qty: 1, price: 380 }],
  },
  {
    id: 'DU-DEMO002', date: 'Apr 11, 2026', status: 'delivered', total: 900,
    subtotal: 840, deliveryFee: 60, discount: 0, couponDiscount: 0, riderTip: 0,
    items: [
      { emoji: '🍚', name: 'Miniket Rice', variation: '5 kg', qty: 2, price: 450 },
      { emoji: '🫙', name: 'Mustard Oil',  variation: '1 L',  qty: 1, price: 180 },
    ],
  },
  {
    id: 'DU-DEMO003', date: 'Apr 10, 2026', status: 'delivered', total: 60,
    subtotal: 50, deliveryFee: 40, discount: 0, couponDiscount: 30, riderTip: 0, couponCode: 'SAVE20',
    items: [{ emoji: '💊', name: 'Vitamin C 500mg', variation: '30 tablets', qty: 1, price: 50 }],
  },
  {
    id: 'DU-DEMO004', date: 'Apr 7, 2026', status: 'delivered', total: 3530,
    subtotal: 3500, deliveryFee: 100, discount: 0, couponDiscount: 50, riderTip: 30, couponCode: 'FREE50',
    items: [{ emoji: '🔊', name: 'JBL GO 3 Speaker', variation: null, qty: 1, price: 3500 }],
  },
];

const MOCK_FAVOURITES = [
  { id: 'f1', emoji: '🍛', name: 'Kacchi Biriyani',   restaurant: 'Dhaka Kitchen', price: 280 },
  { id: 'f2', emoji: '🍚', name: 'Miniket Rice 5 kg', restaurant: 'Meena Bazar',   price: 450 },
  { id: 'f3', emoji: '🥣', name: 'Beef Halim',         restaurant: 'Dhaka Kitchen', price: 120 },
  { id: 'f4', emoji: '☕', name: 'Cold Coffee Shake',  restaurant: 'The Sip House', price: 120 },
];

const WALLET = {
  balance: 145,
  transactions: [
    { id: 't1', label: 'Cashback — Order DU-DEMO002', date: 'Apr 11', amount: +45  },
    { id: 't2', label: 'Refund — Order DU-DEMO001',   date: 'Apr 12', amount: +100 },
  ],
};

const TABS = ['profile', 'orders', 'addresses', 'favourites', 'wallet'];
const TAB_LABELS = {
  profile: <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}><User size={16}/> Profile</span>, 
  orders: <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}><Package size={16}/> Orders</span>, 
  addresses: <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}><MapPin size={16}/> Addresses</span>,
  favourites: <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}><Heart size={16}/> Favourites</span>, 
  wallet: <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}><Wallet size={16}/> Wallet</span>,
};

export default function ProfilePage() {
  const { profile, addresses, updateProfile, setDefaultAddress, logout } = useUser();
  const [tab,         setTab]         = useState('profile');
  const [editing,     setEditing]     = useState(false);
  const [draft,       setDraft]       = useState({ ...profile });
  const [openOrderId, setOpenOrderId] = useState(null);
  const navigate = useNavigate();

  const saveProfile = () => { updateProfile(draft); setEditing(false); };

  return (
    <div className="profile-page">
      <div className="container">

        {/* ── Hero ── */}
        <div className="profile-hero-card">
          <div className="profile-avatar">{profile.avatar}</div>
          <div className="profile-hero-info">
            <div className="profile-hero-name">{profile.name}</div>
            <div className="profile-hero-sub">{profile.phone} · Joined {profile.joinedDate}</div>
          </div>
          <div className="profile-hero-stats">
            <div className="phs"><span>{MOCK_ORDERS.length}</span><span>Orders</span></div>
            <div className="phs-div" />
            <div className="phs"><span>{MOCK_FAVOURITES.length}</span><span>Favourites</span></div>
            <div className="phs-div" />
            <div className="phs"><span>৳{WALLET.balance}</span><span>Wallet</span></div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="profile-tabs">
          {TABS.map(t => (
            <button key={t} id={`profile-tab-${t}`}
              className={`profile-tab-btn${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="profile-tab-content">

          {/* ─ Profile ─ */}
          {tab === 'profile' && (
            <div className="profile-section-card">
              <div className="pscard-hdr">
                <div className="pscard-title">Personal Information</div>
                {!editing
                  ? <button className="pscard-edit-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => { setDraft({...profile}); setEditing(true); }}><Pencil size={14} /> Edit</button>
                  : <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }} onClick={saveProfile}>Save</button>
                      <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                }
              </div>
              <div className="profile-form-grid">
                {[
                  { key: 'name',  label: 'Full Name',    placeholder: 'Your name'     },
                  { key: 'phone', label: 'Phone Number', placeholder: '01XXXXXXXXX'   },
                  { key: 'email', label: 'Email',        placeholder: 'you@email.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="profile-form-row">
                    <div className="profile-form-label">{label}</div>
                    {editing
                      ? <input className="form-input" value={draft[key]} placeholder={placeholder}
                          onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} />
                      : <div className="profile-form-val">{profile[key] || '—'}</div>
                    }
                  </div>
                ))}
              </div>

              <div className="pscard-title" style={{ marginTop: 28, marginBottom: 16 }}>Settings</div>
              {[
                { icon: <Bell size={16} />, label: 'Push Notifications', val: 'On'      },
                { icon: <Moon size={16} />, label: 'Dark Mode',          val: 'Off'     },
                { icon: <Globe size={16} />, label: 'Language',           val: 'English' },
                { icon: <Lock size={16} />, label: 'Change Password',    val: '→', action: true },
              ].map(row => (
                <div key={row.label} className="profile-setting-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{row.icon} {row.label}</span>
                  <span className={row.action ? 'setting-action' : 'setting-val'}>{row.val}</span>
                </div>
              ))}

              <div className="profile-helpline">
                <div className="helpline-icon" style={{ display: 'flex' }}><Headphones size={24} /></div>
                <div>
                  <div className="helpline-title">Duare Helpline</div>
                  <div className="helpline-sub">Available 24/7 for order support</div>
                  <a href="tel:16247" className="helpline-number" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> 16247</a>
                </div>
              </div>

              <button id="logout-btn" className="profile-logout-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => { logout(); navigate('/'); }}>
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}

          {/* ─ Orders ─ */}
          {tab === 'orders' && (
            <div className="profile-section-card">
              <div className="pscard-title">My Orders</div>
              <div className="profile-orders-list">
                {MOCK_ORDERS.map(order => {
                  const sc     = STATUS_COLORS[order.status] || STATUS_COLORS.placed;
                  const isOpen = openOrderId === order.id;
                  return (
                    <div key={order.id} className="profile-order-row" style={{ flexDirection: 'column', gap: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--s-4)', width: '100%' }}>
                        <div className="por-left">
                          <div className="por-id">{order.id}</div>
                          <div className="por-items">{order.items.map(i => `${i.emoji} ${i.name}`).join(', ')}</div>
                          <div className="por-date">{order.date}</div>
                          <button className="por-detail-toggle" onClick={() => setOpenOrderId(isOpen ? null : order.id)}>
                            {isOpen ? '▲ Hide details' : '▼ View details'}
                          </button>
                        </div>
                        <div className="por-right">
                          <span className="por-status" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                          <div className="por-total">৳{order.total.toLocaleString()}</div>
                          <Link to="/" className="por-reorder">Reorder</Link>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="por-detail-panel">
                          {order.items.map((item, i) => (
                            <div key={i} className="por-detail-item">
                              <span className="por-di-emoji">{item.emoji}</span>
                              <div className="por-di-info">
                                <div className="por-di-name">{item.name}</div>
                                {item.variation && <div className="por-di-var">{item.variation}</div>}
                                <div className="por-di-var">× {item.qty}</div>
                              </div>
                              <div className="por-di-price">৳{(item.price * item.qty).toLocaleString()}</div>
                            </div>
                          ))}
                          <div className="por-inv-table">
                            <div className="por-inv-row"><span>Subtotal</span><span>৳{order.subtotal}</span></div>
                            {order.discount > 0     && <div className="por-inv-row" style={{ color:'#15803D' }}><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Gift size={14} /> Discount</span><span>-৳{order.discount}</span></div>}
                            {order.couponDiscount > 0 && (
                              <div className="por-inv-row" style={{ color:'#15803D'}}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={14} /> Coupon {order.couponCode ? `(${order.couponCode})` : ''}</span>
                                <span>-৳{order.couponDiscount}</span>
                              </div>
                            )}
                            <div className="por-inv-row"><span>Delivery Fee</span><span>৳{order.deliveryFee}</span></div>
                            {order.riderTip > 0 && <div className="por-inv-row" style={{ color:'var(--brand)' }}><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HeartHandshake size={14} /> Rider Tip</span><span>৳{order.riderTip}</span></div>}
                            <div className="por-inv-total"><span>Total</span><span>৳{order.total.toLocaleString()}</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─ Addresses ─ */}
          {tab === 'addresses' && (
            <div className="profile-section-card">
              <div className="pscard-hdr">
                <div className="pscard-title">Saved Addresses</div>
              </div>
              <div className="profile-addr-list">
                {addresses.map(addr => (
                  <div key={addr.id} className="profile-addr-card">
                    <div className="pac-top">
                      <div className="pac-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} /> {addr.label || 'Address'}
                        {addr.isDefault && <span className="pac-default-badge">Default</span>}
                      </div>
                      <button className="pscard-edit-btn" style={{ fontSize: 11 }}>Edit</button>
                    </div>
                    <div className="pac-address">{addr.fullAddress}</div>
                    {!addr.isDefault && (
                      <button className="pac-set-default" onClick={() => setDefaultAddress(addr.id)}>
                        Set as default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─ Favourites ─ */}
          {tab === 'favourites' && (
            <div className="profile-section-card">
              <div className="pscard-title">Favourite Items</div>
              <div className="profile-fav-grid">
                {MOCK_FAVOURITES.map(fav => (
                  <div key={fav.id} className="profile-fav-card">
                    <div className="pfc-emoji">{fav.emoji}</div>
                    <div className="pfc-info">
                      <div className="pfc-name">{fav.name}</div>
                      <div className="pfc-resto">{fav.restaurant}</div>
                      <div className="pfc-price">৳{fav.price}</div>
                    </div>
                    <button className="pfc-add-btn">+ Add</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─ Wallet ─ */}
          {tab === 'wallet' && (
            <div className="profile-section-card">
              <div className="pscard-title">My Wallet</div>
              <div className="wallet-balance-card">
                <div className="wallet-label">Available Balance</div>
                <div className="wallet-amount">৳{WALLET.balance}</div>
                <div className="wallet-sub">Use at checkout for instant discount</div>
              </div>
              <div className="pscard-title" style={{ marginTop: 24, marginBottom: 12 }}>Transaction History</div>
              <div className="wallet-txns">
                {WALLET.transactions.map(txn => (
                  <div key={txn.id} className="wallet-txn-row">
                    <div>
                      <div className="wtxn-label">{txn.label}</div>
                      <div className="wtxn-date">{txn.date}</div>
                    </div>
                    <div className={`wtxn-amount ${txn.amount >= 0 ? 'cr' : 'dr'}`}>
                      {txn.amount >= 0 ? '+' : ''}৳{Math.abs(txn.amount)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="wallet-note" style={{ display: 'flex', gap: '8px' }}>
                <Lightbulb size={20} style={{ flexShrink: 0 }} /> Cashbacks and refunds are credited within 24–48 hours. Contact helpline 16247 for queries.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
