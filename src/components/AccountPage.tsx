import React from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Calendar, ShieldAlert, ShoppingBag, Eye } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { currentUser, lastOrder, setActiveView } = useStore();

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <ShieldAlert size={48} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Vui lòng đăng nhập</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Bạn cần đăng nhập tài khoản để xem thông tin cá nhân và lịch sử đặt hàng.</p>
          <button onClick={() => setActiveView('login')} className="btn btn-primary">Đăng nhập ngay</button>
        </div>
      </div>
    );
  }

  const handleViewOrder = () => {
    setActiveView('success');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 80px 0', textAlign: 'left' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px' }}>Trang cá nhân</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '32px',
        alignItems: 'start',
        // Responsive
        '@media (max-width: 900px)': {
          gridTemplateColumns: '1fr'
        }
      } as any}>

        {/* User profile card */}
        <aside className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--text-on-primary)',
              fontSize: '2rem',
              fontWeight: 850,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--primary-glow-strong)'
            }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentUser.name}</h3>
            <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>Khách hàng Bạc</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Email liên hệ</span>
                <strong>{currentUser.email}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Ngày tham gia</span>
                <strong>19 tháng 6, 2026</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* Order History */}
        <main className="card" style={{ padding: '24px', minHeight: '300px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
            Lịch sử mua hàng
          </h3>

          {lastOrder ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden'
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 140px 100px 100px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-input)',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span>MÃ ĐƠN HÀNG</span>
                <span>SẢN PHẨM CHÍNH</span>
                <span>NGÀY ĐẶT</span>
                <span>TỔNG TIỀN</span>
                <span style={{ textAlign: 'right' }}>HÀNH ĐỘNG</span>
              </div>

              {/* Order row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 140px 100px 100px',
                padding: '16px',
                alignItems: 'center',
                fontSize: '0.85rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <strong style={{ color: 'var(--primary)' }}>{lastOrder.id}</strong>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
                  {lastOrder.items[0]?.product.name} {lastOrder.items.length > 1 ? `và ${lastOrder.items.length - 1} sản phẩm khác` : ''}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{lastOrder.date.split(',')[0]}</span>
                <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lastOrder.total)}</strong>
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={handleViewOrder}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid var(--border-color)',
                      gap: '4px'
                    }}
                  >
                    <Eye size={12} /> Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 0',
              gap: '12px'
            }}>
              <div style={{
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                padding: '16px',
                borderRadius: '50%'
              }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontWeight: 700 }}>Bạn chưa có đơn hàng nào</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Đơn hàng của bạn sẽ xuất hiện ở đây sau khi bạn đặt mua sản phẩm thành công.</p>
              <button onClick={() => setActiveView('shop')} className="btn btn-primary" style={{ marginTop: '8px' }}>
                Mua sắm ngay
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
