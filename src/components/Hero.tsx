import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  const handleExplore = () => {
    setSelectedCategory('All');
    setActiveView('shop');
  };

  return (
    <section className="container animate-fade-in" style={{ padding: '40px 0 60px 0' }}>
      
      {/* Banner Card */}
      <div className="card" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(20, 26, 43, 0.95) 100%)',
        border: '1px solid rgba(234, 179, 8, 0.15)',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
        padding: '48px',
        color: '#f8fafc'
      }}>
        
        {/* Decorative Glowing Orbs */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.08) 0%, rgba(234, 179, 8, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.04) 0%, rgba(234, 179, 8, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          alignItems: 'center'
        }}>
          
          {/* Hero Content */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--primary)', width: 'fit-content', border: '1px solid rgba(234, 179, 8, 0.2)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Sparkles size={14} /> Hàng Nhật Nội Địa Cao Cấp
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', 
              lineHeight: 1.15, 
              color: '#ffffff',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              margin: 0
            }}>
              Thế Giới<br />
              <span className="animated-gradient-text">Figure &</span><br />
              <span className="animated-gradient-text">Đồ Nhật Bản</span>
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '480px', margin: 0 }}>
              Chuyên mô hình Figure chính hãng, bánh kẹo/đồ ăn vặt, sách truyện manga gốc và hàng tiêu dùng nội địa Nhật Bản uy tín chất lượng cao.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button 
                onClick={handleExplore}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Khám phá ngay <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Hero Graphic Overlay */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              height: '280px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.05)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80" 
                alt="Japanese Figures Collection"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0))',
                padding: '20px',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Figure nổi bật</span>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginTop: '4px' }}>Mô hình Anime chính hãng</h3>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Badges Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginTop: '32px'
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', textAlign: 'left' }}>
          <div style={{
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '12px',
            borderRadius: 'var(--radius-md)'
          }}>
            <Truck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Vận chuyển siêu tốc</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Miễn phí giao hàng cho đơn từ 1.000.000đ</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', textAlign: 'left' }}>
          <div style={{
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '12px',
            borderRadius: 'var(--radius-md)'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Cam kết chính hãng</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Đền gấp 10 lần nếu phát hiện hàng fake</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', textAlign: 'left' }}>
          <div style={{
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '12px',
            borderRadius: 'var(--radius-md)'
          }}>
            <RotateCcw size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Đóng gói chống móp hộp</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bọc xốp bubble dày dặn, an toàn tuyệt đối</p>
          </div>
        </div>
      </div>

    </section>
  );
};
