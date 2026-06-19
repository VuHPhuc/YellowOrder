import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetails } from './components/ProductDetails';
import { CartPage } from './components/CartPage';
import { Checkout } from './components/Checkout';
import { LoginRegister } from './components/LoginRegister';
import { OrderSuccess } from './components/OrderSuccess';
import { AccountPage } from './components/AccountPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ArrowRight, Flame } from 'lucide-react';
import './App.css';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView, products } = useStore();

  // Filter featured products for the home page
  const featuredProducts = products.filter(p => p.isFeatured);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            {/* Hero Section */}
            <Hero />

            {/* Featured Products Section */}
            <section style={{ padding: '40px 0', textAlign: 'left' }} className="container animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={24} style={{ color: 'var(--primary)' }} /> Sản phẩm bán chạy
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                    Những thiết bị được khách hàng ưa chuộng và đánh giá cao nhất tuần này.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('shop')}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Xem tất cả <ArrowRight size={14} />
                </button>
              </div>

              {/* Grid Layout */}
              <div className="grid-cols-responsive">
                {featuredProducts.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Promotional Promo Card */}
            <section style={{ padding: '40px 0 60px 0' }} className="container animate-fade-in">
              <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(234,179,8,0.2) 0%, rgba(202,138,4,0.05) 100%)',
                border: '1.5px dashed var(--primary)',
                padding: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '24px',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'left'
              }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>Ưu đãi giới hạn</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Nhập mã <strong style={{ color: 'var(--primary)' }}>YELLOW10</strong> giảm ngay 10%</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px' }}>
                    Áp dụng cho tất cả các đơn hàng đầu tiên mua thiết bị âm thanh và bàn phím cơ. Thời hạn khuyến mãi kéo dài đến hết tháng này.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('shop')}
                  className="btn btn-primary"
                  style={{ height: '48px', padding: '0 28px', fontWeight: 700 }}
                >
                  Mua sắm ngay
                </button>
              </div>
            </section>
          </>
        );
      case 'shop':
        return <ProductGrid />;
      case 'product-details':
        return <ProductDetails />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <Checkout />;
      case 'login':
        return <LoginRegister />;
      case 'success':
        return <OrderSuccess />;
      case 'account':
        return <AccountPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Hero />;
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ flex: 1, minHeight: 'calc(100vh - 80px)' }}>
        {renderActiveView()}
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;
