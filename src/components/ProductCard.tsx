import React from 'react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../context/StoreContext';
import { Star, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, setActiveView } = useStore();

  const handleViewDetails = () => {
    setSelectedProduct(product);
    setActiveView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      
      {/* Product Image Panel */}
      <div 
        onClick={handleViewDetails}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '80%', // aspect-ratio 5:4
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-input)',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {product.isFeatured && (
          <span 
            className="badge badge-yellow"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '0.65rem'
            }}
          >
            Nổi bật
          </span>
        )}
      </div>

      {/* Product Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '6px', textAlign: 'left' }}>
        
        {/* Category & Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {product.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={13} fill="var(--primary)" color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{product.rating}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 
          onClick={handleViewDetails}
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.3,
            cursor: 'pointer',
            height: '42px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            margin: '4px 0',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
        </div>

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button 
          onClick={handleViewDetails}
          className="btn btn-secondary"
          style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
          title="Xem chi tiết"
        >
          <Eye size={16} /> Chi tiết
        </button>
        <button 
          onClick={handleQuickAdd}
          className="btn btn-primary"
          style={{ padding: '10px', minWidth: '42px' }}
          title="Thêm nhanh vào giỏ"
        >
          <ShoppingCart size={16} />
        </button>
      </div>

    </div>
  );
};
