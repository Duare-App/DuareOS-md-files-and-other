import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ViewCartFooter from './components/ViewCartFooter';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import RestaurantMenuPage from './pages/RestaurantMenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DesignSystemPage from './pages/DesignSystemPage';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/design-system');

  return (
    <UserProvider>
      <div className={isAdmin ? 'admin-app' : 'app'}>
        <ScrollToTop />
        {!isAdmin && <Navbar />}
        <main className={isAdmin ? 'admin-main-content' : location.pathname === '/' ? 'main-content is-home' : 'main-content'}>
          <Routes>
            <Route path="/"                           element={<LandingPage />} />
            <Route path="/category/:categoryId"       element={<CategoryPage />} />
            <Route path="/restaurant/:restaurantId"   element={<RestaurantMenuPage />} />
            <Route path="/cart"                       element={<CartPage />} />
            <Route path="/checkout"                   element={<CheckoutPage />} />
            <Route path="/order-success/:orderId"     element={<OrderSuccessPage />} />
            <Route path="/track/:orderId"             element={<OrderTrackingPage />} />
            <Route path="/profile"                    element={<ProfilePage />} />
            <Route path="/admin/*"                    element={<AdminDashboard />} />
            <Route path="/design-system"              element={<DesignSystemPage />} />
          </Routes>
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <ViewCartFooter />}
      </div>
    </UserProvider>
  );
}

