import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';
import Cart from '@/components/Cart';
import Footer from '@/sections/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

// Pages
import Home from '@/pages/Home';
import CategoriesPage from '@/pages/CategoriesPage';
import CustomLab from '@/pages/CustomLab';
import About from '@/pages/About';
import ProductDetail from '@/pages/ProductDetail';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminPanel from '@/pages/AdminPanel';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import OrdersPage from '@/pages/OrdersPage';
import CategoryPage from '@/pages/CategoryPage';

// Auth store
import { useAuthStore } from '@/store/authStore';

// Protected route wrapper
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// Layout wrapper - hides nav/footer for standalone pages
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative w-full">
      <ScrollToTop />
      <div className="grain-overlay" />
      <Navigation />
      <Cart />
      <FloatingWhatsApp />
      <main className="pt-16 sm:pt-20 lg:pt-24 relative z-0">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Routes>
        {/* Auth pages — no nav/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin panel — no main nav/footer */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />

        {/* Main site with nav/footer */}
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/:id" element={<ProductDetail />} />
                
                {/* Legacy Redirects */}
                <Route path="/products" element={<Navigate to="/categories" replace />} />
                <Route path="/products/:id" element={<Navigate to="/categories/:id" replace />} />

                <Route path="/custom-lab" element={<CustomLab />} />

                <Route path="/about" element={<About />} />
                <Route path="/tech" element={<About />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                
                {/* Legacy Redirects for Industries */}
                <Route path="/sector/:slug" element={<Navigate to="/category/:slug" replace />} />
                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
          },
        }}
      />
    </>
  );
}

export default App;
