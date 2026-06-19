import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const {
    cart,
    cartTotal,
    currentUser,
    placeOrder,
    setActiveView
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'cod' // 'cod' | 'bank' | 'card'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill user profile if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email
      }));
    }
  }, [currentUser]);

  const shippingFee = cartTotal > 200 ? 0 : 15.00;
  const grandTotal = cartTotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleValidation = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = 'Vui lòng nhập họ và tên';
    if (!formData.email.trim()) {
      tempErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(formData.phone.trim())) {
      tempErrors.phone = 'Số điện thoại phải gồm 9-11 chữ số';
    }
    if (!formData.address.trim()) tempErrors.address = 'Vui lòng nhập địa chỉ nhận hàng';
    if (!formData.city.trim()) tempErrors.city = 'Vui lòng nhập Tỉnh/Thành phố';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      placeOrder(formData);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <button onClick={() => setActiveView('shop')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 80px 0', textAlign: 'left' }}>
      
      {/* Back to Cart Link */}
      <button
        onClick={() => setActiveView('cart')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          fontWeight: 600,
          marginBottom: '28px',
          padding: 0
        }}
      >
        <ArrowLeft size={18} /> Quay lại giỏ hàng
      </button>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '32px' }}>Thông tin thanh toán</h2>

      {/* Main Layout Grid */}
      <form onSubmit={handleSubmit} className="grid-checkout-layout">
        
        {/* Left Column - Shipping & Billing Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Address Details Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} style={{ color: 'var(--primary)' }} /> 1. Địa chỉ giao hàng
            </h3>

            <div className="form-row-grid">
              <div>
                <label className="label">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Nguyễn Văn A"
                />
                {errors.name && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
              </div>
              <div>
                <label className="label">Số điện thoại *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0987654321"
                />
                {errors.phone && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
              </div>
            </div>

            <div>
              <label className="label">Địa chỉ Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="example@gmail.com"
              />
              {errors.email && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
            </div>

            <div className="form-row-grid-3">
              <div>
                <label className="label">Địa chỉ nhận hàng *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Số 123, Đường ABC, Phường XYZ"
                />
                {errors.address && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
              </div>
              <div>
                <label className="label">Tỉnh / Thành phố *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Hà Nội"
                />
                {errors.city && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.city}</span>}
              </div>
            </div>

            <div>
              <label className="label">Ghi chú giao hàng (Tùy chọn)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                className="input-field"
                style={{ height: '80px', resize: 'none' }}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} style={{ color: 'var(--primary)' }} /> 2. Phương thức thanh toán
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* COD option */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                border: '1.5px solid ' + (formData.paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-md)',
                backgroundColor: formData.paymentMethod === 'cod' ? 'var(--primary-glow)' : 'transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                />
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, display: 'block' }}>Thanh toán khi nhận hàng (COD)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thanh toán bằng tiền mặt ngay khi đơn vị vận chuyển giao sản phẩm tới tay bạn.</span>
                </div>
              </label>

              {/* Bank Transfer option */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                border: '1.5px solid ' + (formData.paymentMethod === 'bank' ? 'var(--primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-md)',
                backgroundColor: formData.paymentMethod === 'bank' ? 'var(--primary-glow)' : 'transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleInputChange}
                  style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                />
                <div style={{ width: '100%' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, display: 'block' }}>Chuyển khoản ngân hàng (Mã QR)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chuyển khoản an toàn qua hệ thống ngân hàng nội địa với nội dung mã đơn hàng.</span>
                  
                  {formData.paymentMethod === 'bank' && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem'
                    }} className="animate-fade-in">
                      <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>Thông tin tài khoản YellowOrder:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div><strong>Ngân hàng:</strong> Techcombank</div>
                        <div><strong>Số tài khoản:</strong> 1903 8888 888 888</div>
                        <div><strong>Chủ tài khoản:</strong> CÔNG TY CỔ PHẦN YELLOWORDER</div>
                        <div><strong>Số tiền:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(grandTotal)}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>
                          * Hệ thống sẽ tự động xác minh giao dịch sau 1-3 phút kể từ khi nhận được tiền.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Credit Card option */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                border: '1.5px solid ' + (formData.paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-md)',
                backgroundColor: formData.paymentMethod === 'card' ? 'var(--primary-glow)' : 'transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  style={{ accentColor: 'var(--primary)', marginTop: '4px' }}
                />
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, display: 'block' }}>Thẻ Quốc tế (Visa / Mastercard)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thanh toán trực tuyến bảo mật thông qua cổng thanh toán bảo mật chuẩn SSL quốc tế.</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column - Order Review Side Panel */}
        <aside className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Xem lại đơn hàng
          </h3>

          {/* Mini product listings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
            {cart.map(item => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-input)',
                  flexShrink: 0
                }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {item.quantity} x {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.product.price)}
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing breakdowns */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tạm tính</span>
              <span style={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartTotal)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phí vận chuyển</span>
              <span style={{ fontWeight: 700 }}>
                {shippingFee === 0 ? 'Miễn phí' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(shippingFee)}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Tổng thanh toán</span>
              <span style={{ color: 'var(--primary)' }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(grandTotal)}
              </span>
            </div>
          </div>

          {/* Purchase Trigger */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontWeight: 700, marginTop: '8px' }}
          >
            Xác nhận đặt hàng
          </button>

          {/* Safety notice */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <ShieldCheck size={16} style={{ color: '#10b981', flexShrink: 0 }} />
            <span>Thông tin giao dịch của bạn được bảo mật tuyệt đối bởi chứng chỉ quốc tế PCI-DSS.</span>
          </div>

        </aside>

      </form>
    </div>
  );
};
