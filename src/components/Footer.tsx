import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Send, Globe, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: 'auto',
      transition: 'background-color var(--transition-normal)'
    }}>
      <div className="container">
        
        {/* Footer Top Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'var(--primary)',
                color: 'var(--text-on-primary)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Yellow<span style={{ color: 'var(--primary)' }}>Order</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Trải nghiệm mua sắm thiết bị công nghệ và phong cách sống cao cấp với thiết kế hiện đại, chất lượng vượt trội.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a href="https://github.com/VuHPhuc/YellowOrder" target="_blank" rel="noreferrer" style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                display: 'inline-flex'
              }}>
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                display: 'inline-flex'
              }}>
                <Globe size={18} />
              </a>
              <a href="#" style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                display: 'inline-flex'
              }}>
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Danh mục
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Audio', 'Keyboards', 'Wearables', 'Monitors', 'Lifestyle', 'Travel'].map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => handleCategoryClick(cat)}
                    style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: 0 }}
                  >
                    Thiết bị {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Support Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hỗ trợ
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Chính sách vận chuyển', 'Chính sách bảo hành', 'Liên hệ hỗ trợ'].map(link => (
                <li key={link}>
                  <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Bản tin điện tử
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Đăng ký để nhận thông tin về các sản phẩm mới nhất và chương trình ưu đãi đặc biệt.
            </p>
            <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Email của bạn..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingRight: '50px', height: '46px', fontSize: '0.85rem' }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-on-primary)',
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </form>
            {subscribed && (
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'block', marginTop: '8px', fontWeight: 600 }}>
                ✓ Đăng ký thành công! Cảm ơn bạn.
              </span>
            )}
          </div>

        </div>

        {/* Footer Bottom Info */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            © {new Date().getFullYear()} YellowOrder. Bảo lưu mọi quyền.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Được thiết kế và phát triển với <Heart size={12} fill="#ef4444" color="#ef4444" /> bởi đội ngũ YellowOrder
          </p>
        </div>

      </div>
    </footer>
  );
};
