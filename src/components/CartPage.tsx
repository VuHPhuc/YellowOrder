import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    setActiveView
  } = useStore();

  const shippingFee = cartTotal > 200 || cartTotal === 0 ? 0 : 15.00;
  const grandTotal = cartTotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '28px',
            borderRadius: '50%',
            marginBottom: '8px'
          }}>
            <ShoppingBag size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Giỏ hàng của bạn đang trống</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto', fontSize: '0.95rem' }}>
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy quay lại cửa hàng để lựa chọn những sản phẩm ưng ý nhất.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="btn btn-primary"
            style={{ marginTop: '8px', padding: '12px 24px' }}
          >
            Quay lại cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 80px 0', textAlign: 'left' }}>
      
      {/* Title */}
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px' }}>Giỏ hàng của bạn</h2>

      <div className="grid-cart-layout">
        
        {/* Left Column - Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Bạn có {cart.length} nhóm sản phẩm trong giỏ
            </span>
            <button 
              onClick={clearCart}
              style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <Trash2 size={14} /> Xóa toàn bộ giỏ
            </button>
          </div>

          {/* Items Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map(item => (
              <div 
                key={item.product.id}
                className="card" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Product Image */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-input)',
                  flexShrink: 0
                }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Product Info */}
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {item.product.category}
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '2px 0 6px 0' }}>{item.product.name}</h3>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Đơn giá: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.product.price)}
                  </span>
                </div>

                {/* Quantity Control */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  height: '36px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-card)'
                }}>
                  <button 
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    style={{ width: '30px', height: '100%' }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    style={{ width: '30px', height: '100%' }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal & Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '120px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.product.price * item.quantity)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    style={{ color: 'var(--text-muted)' }}
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Back Action */}
          <button
            onClick={() => setActiveView('shop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginTop: '12px',
              padding: 0
            }}
          >
            <ArrowLeft size={16} /> Tiếp tục chọn thêm sản phẩm
          </button>

        </div>

        {/* Right Column - Summary Panel */}
        <aside className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Tóm tắt đơn hàng
          </h3>

          {/* Pricing breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tạm tính</span>
              <span style={{ fontWeight: 700 }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartTotal)}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Vận chuyển</span>
              <span style={{ fontWeight: 700 }}>
                {shippingFee === 0 ? (
                  <span style={{ color: '#10b981' }}>Miễn phí</span>
                ) : (
                  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(shippingFee)
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '-4px' }}>
                Mua thêm <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(200 - cartTotal)}</strong> để được Miễn phí giao hàng.
              </p>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
              <span>Tổng thanh toán</span>
              <span style={{ color: 'var(--primary)' }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(grandTotal)}
              </span>
            </div>
          </div>

          {/* Primary Proceed Action */}
          <button
            onClick={() => setActiveView('checkout')}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontWeight: 700, gap: '8px', marginTop: '8px' }}
          >
            <CreditCard size={18} /> Đặt hàng ngay
          </button>

          {/* Extra Guarantee badge */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
            Đơn hàng được bảo đảm giao nhanh trong vòng 2-4 ngày làm việc trên toàn quốc.
          </div>
        </aside>

      </div>
    </div>
  );
};
