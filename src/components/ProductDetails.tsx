import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingCart, ArrowLeft, Check, ShieldCheck, Heart } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setActiveView } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Không tìm thấy sản phẩm</h2>
        <button onClick={() => setActiveView('shop')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const handleBackToShop = () => {
    setSelectedProduct(null);
    setActiveView('shop');
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setActiveView('cart');
  };

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Back Button */}
      <button
        onClick={handleBackToShop}
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
        <ArrowLeft size={18} /> Quay lại cửa hàng
      </button>

      {/* Product Detail Columns */}
      <div className="product-detail-layout">
        
        {/* Left Column - Large Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>

          {/* Guarantee Info Box */}
          <div className="card" style={{ display: 'flex', gap: '12px', padding: '16px', alignItems: 'center', backgroundColor: 'var(--bg-input)' }}>
            <ShieldCheck size={28} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>Cam kết từ YellowOrder</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bảo hành chính hãng 24 tháng. Đổi mới 1-đổi-1 nếu phát sinh lỗi phần cứng từ nhà sản xuất.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Product Purchase Panel */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Metadata */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Thiết bị {selectedProduct.category}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px', marginBottom: '12px', lineHeight: 1.2 }}>
              {selectedProduct.name}
            </h1>
            
            {/* Star Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(selectedProduct.rating) ? 'var(--primary)' : 'transparent'} 
                    color="var(--primary)" 
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedProduct.rating} / 5</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({selectedProduct.reviewsCount} đánh giá từ khách hàng)</span>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedProduct.price)}
            </span>
            <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>Còn hàng: {selectedProduct.stock} sản phẩm</span>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Mô tả sản phẩm</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {selectedProduct.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Thông số kỹ thuật</h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {Object.entries(selectedProduct.specs).map(([key, value], idx) => (
                <div 
                  key={key} 
                  style={{
                    display: 'flex',
                    padding: '10px 16px',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-input)',
                    borderBottom: idx < Object.entries(selectedProduct.specs).length - 1 ? '1px solid var(--border-color)' : 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  <span style={{ width: '40%', fontWeight: 700, color: 'var(--text-secondary)' }}>{key}</span>
                  <span style={{ width: '60%', color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Highlights Bullet Points */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Tính năng nổi bật</h4>
            <div className="form-row-grid" style={{ gap: '10px' }}>
              {selectedProduct.features.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-glow)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={12} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add-to-Cart Panel */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px',
            marginTop: '12px'
          }}>
            
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '48px',
              backgroundColor: 'var(--bg-card)'
            }}>
              <button 
                onClick={decrementQty}
                style={{ width: '40px', height: '100%', fontSize: '1.2rem', fontWeight: 600 }}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: '50px',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)'
                }}
              />
              <button 
                onClick={incrementQty}
                style={{ width: '40px', height: '100%', fontSize: '1.2rem', fontWeight: 600 }}
              >
                +
              </button>
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'flex', flex: 1, gap: '12px', minWidth: '240px' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-outline"
                style={{ flex: 1, height: '48px', fontWeight: 700 }}
              >
                <ShoppingCart size={18} /> Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                className="btn btn-primary"
                style={{ flex: 1, height: '48px', fontWeight: 700 }}
              >
                Mua ngay
              </button>
            </div>

            {/* Favorite Indicator */}
            <button style={{
              width: '48px',
              height: '48px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)'
            }}>
              <Heart size={20} />
            </button>

          </div>

          {addedMessage && (
            <div style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textAlign: 'center'
            }} className="animate-fade-in">
              ✓ Đã thêm {quantity} sản phẩm vào giỏ hàng thành công!
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
