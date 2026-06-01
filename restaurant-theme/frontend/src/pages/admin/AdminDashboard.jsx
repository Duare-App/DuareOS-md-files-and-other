import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    completedOrders: 0,
    activeStores: 0,
  });
  const [pendingStores, setPendingStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const ordersData = await api.getOrders();
      const orders = ordersData.orders || [];
      
      let revenue = 0;
      let active = 0;
      let completed = 0;
      
      orders.forEach(o => {
        revenue += o.total || 0;
        if (o.status === 'delivered') completed++;
        else active++;
      });

      // 2. Fetch Active Stores
      const storesData = await api.getRestaurants();
      const activeStores = storesData.total || 0;

      setStats({ revenue, activeOrders: active, completedOrders: completed, activeStores });

      // 3. Fetch Pending Stores
      const pendingData = await api.getPendingStores();
      setPendingStores(pendingData.pendingStores || []);
      
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const approveStore = async (id) => {
    try {
      const data = await api.approvePendingStore(id);
      if (data.success) {
        // Remove from pending list locally and update active store count
        setPendingStores(prev => prev.filter(s => s.id !== id));
        setStats(prev => ({ ...prev, activeStores: prev.activeStores + 1 }));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to approve store", err);
    }
  };

  return (
    <>
      <div className="admin-sidebar">
        <h2><span style={{ fontSize: 28 }}>🛵</span> Duare Admin</h2>
        <div className="admin-nav">
          <NavLink to="/admin" end className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            📊 Dashboard
          </NavLink>
          <div className="admin-nav-link">🍔 Franchisees</div>
          <div className="admin-nav-link">📦 Orders</div>
          <div className="admin-nav-link">👥 Customers</div>
          <div className="admin-nav-link">🏍️ Riders</div>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <button 
            className="btn-primary" 
            style={{ width: '100%', background: '#334155', border: '1px solid #475569' }}
            onClick={() => navigate('/')}
          >
            ← Exit Admin Mode
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-header">
          <h1>Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Master Admin</span>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: '#CBD5E1', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20 }}>
              👨‍💼
            </div>
          </div>
        </div>

        {loading ? (
          <div>Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">💰</div>
                <div className="admin-stat-title">Platform Revenue</div>
                <div className="admin-stat-value">৳{stats.revenue.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">📊</div>
                <div className="admin-stat-title">Active Orders</div>
                <div className="admin-stat-value" style={{ color: '#0EA5E9' }}>{stats.activeOrders}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">✅</div>
                <div className="admin-stat-title">Completed Orders</div>
                <div className="admin-stat-value" style={{ color: '#10B981' }}>{stats.completedOrders}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">🏪</div>
                <div className="admin-stat-title">Active Partner Stores</div>
                <div className="admin-stat-value">{stats.activeStores}</div>
              </div>
            </div>

            {/* Franchise Approvals Section */}
            <div className="admin-section">
              <h3>Pending Franchise Approvals</h3>
              {pendingStores.length === 0 ? (
                <div style={{ color: '#64748B', fontStyle: 'italic', padding: 12 }}>
                  No pending franchise applications right now.
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Store Info</th>
                        <th>Category</th>
                        <th>Applicant</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingStores.map((store) => (
                        <tr key={store.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ fontSize: 24, width: 40, height: 40, background: store.bgColor, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {store.emoji}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>{store.name}</div>
                                <div style={{ fontSize: 13, color: '#64748B' }}>"{store.tagline}"</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ padding: '4px 8px', background: '#F1F5F9', borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>
                              {store.category}
                            </span>
                          </td>
                          <td>{store.applicantName || 'Anonymous'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn-approve" onClick={() => approveStore(store.id)}>
                              Approve Franchise
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div style={{ height: 100 }} /> {/* Spacer */}
          </>
        )}
      </div>
    </>
  );
}
