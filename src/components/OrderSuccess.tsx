import React from 'react';
import { useStore } from '../context/StoreContext';
import { Check, ArrowRight, Printer, Calendar, MapPin, CreditCard, Box } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export const OrderSuccess: React.FC = () => {
  const { lastOrder, setActiveView } = useStore();

  if (!lastOrder) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Không tìm thấy thông tin đơn hàng mới</h2>
        <button onClick={() => setActiveView('shop')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    setActiveView('home');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Success Badge */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
        marginBottom: '20px'
      }}>
        <Check size={36} strokeWidth={3} />
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0', textAlign: 'center' }}>Đặt hàng thành công!</h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '480px', marginBottom: '40px' }}>
        Cảm ơn bạn đã lựa chọn mua sắm tại <strong>YellowOrder</strong>. Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý.
      </p>

      {/* Main Content Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '32px',
        width: '100%',
        maxWidth: '900px',
        alignItems: 'start',
        textAlign: 'left',
        // Responsive collapse
        '@media (max-width: 900px)': {
          gridTemplateColumns: '1fr'
        }
      } as any}>
        
        {/* Left Column - Order details summary card */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Order Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MÃ ĐƠN HÀNG</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{lastOrder.id}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NGÀY ĐẶT HÀNG</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>
                <Calendar size={14} /> {lastOrder.date}
              </div>
            </div>
          </div>

          {/* Receiver & Shipping Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Thông tin người nhận</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>{lastOrder.shipping.name}</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>SĐT: {lastOrder.shipping.phone}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Email: {lastOrder.shipping.email}</div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {lastOrder.shipping.address}, {lastOrder.shipping.city}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Thanh toán & Vận chuyển</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
                <CreditCard size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Hình thức thanh toán:</strong>
                  <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
                    {lastOrder.shipping.paymentMethod === 'cod' && 'Thanh toán tiền mặt (COD)'}
                    {lastOrder.shipping.paymentMethod === 'bank' && 'Chuyển khoản ngân hàng'}
                    {lastOrder.shipping.paymentMethod === 'card' && 'Thẻ tín dụng quốc tế'}
                  </div>
                  <strong style={{ display: 'block', marginTop: '8px' }}>Hình thức giao hàng:</strong>
                  <div style={{ color: 'var(--text-secondary)' }}>Giao hàng nhanh (2-4 ngày làm việc)</div>
                </div>
              </div>
            </div>
          </div>

          {/* List of Ordered items */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Sản phẩm đã đặt</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lastOrder.items.map(item => (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-input)',
                    flexShrink: 0
                  }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</h4>
                    <span style={{ color: 'var(--text-secondary)' }}>SL: {item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 700 }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          {lastOrder.shipping.note && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.85rem' }}>
              <strong>Ghi chú đơn hàng:</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                "{lastOrder.shipping.note}"
              </p>
            </div>
          )}

        </div>

        {/* Right Column - Tracking timeline & actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tracking progress card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box size={18} style={{ color: 'var(--primary)' }} /> Theo dõi đơn hàng
            </h3>

            {/* Vertical timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '24px' }}>
              
              {/* Vertical line connector */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                backgroundColor: 'var(--border-color)',
                zIndex: 1
              }}></div>

              {/* Step 1: Placed */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '3px solid var(--bg-card)',
                  top: '4px'
                }}></div>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: '#10b981' }}>Đơn hàng đã đặt</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Đơn hàng đã được xác nhận</p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  border: '3px solid var(--bg-card)',
                  top: '4px'
                }}></div>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Đang chuẩn bị hàng</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Nhân viên kho đang đóng gói sản phẩm</p>
                </div>
              </div>

              {/* Step 3: Shipping */}
              <div style={{ position: 'relative', zIndex: 2, opacity: 0.5 }}>
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-muted)',
                  border: '3px solid var(--bg-card)',
                  top: '4px'
                }}></div>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Đang giao hàng</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Đang bàn giao cho đơn vị vận chuyển</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div style={{ position: 'relative', zIndex: 2, opacity: 0.5 }}>
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-muted)',
                  border: '3px solid var(--bg-card)',
                  top: '4px'
                }}></div>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Đã giao thành công</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Người nhận đã ký nhận sản phẩm</p>
                </div>
              </div>

            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleContinueShopping}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontWeight: 700, gap: '8px' }}
          >
            Tiếp tục mua sắm <ArrowRight size={18} />
          </button>
          
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ width: '100%', height: '46px', fontWeight: 600, gap: '8px' }}
          >
            <Printer size={16} /> In hóa đơn chi tiết
          </button>

        </div>

      </div>
    </div>
  );
};
