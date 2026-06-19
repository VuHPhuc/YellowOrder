import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, RefreshCcw, ShoppingBag } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    showNsfw,
    setShowNsfw
  } = useStore();

  const categories = ['All', 'Figure', 'Food', 'Books', 'Goods', 'Cosmetics'];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange([0, parseFloat(e.target.value)]);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange([0, 500]);
    setSortBy('featured');
    setShowNsfw(false);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0 60px 0' }}>
      
      {/* Title / Search Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {selectedCategory === 'All' ? 'Tất cả sản phẩm' : `Thiết bị ${selectedCategory}`}
          </h2>
          {searchQuery && (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Kết quả tìm kiếm cho: <strong style={{ color: 'var(--primary)' }}>"{searchQuery}"</strong>
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="sort-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sắp xếp:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{ width: '180px', height: '40px', padding: '0 12px', fontSize: '0.85rem' }}
          >
            <option value="featured">Nổi bật nhất</option>
            <option value="price-low">Giá: Thấp đến Cao</option>
            <option value="price-high">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      <div className="grid-sidebar-layout">
        
        {/* Left Sidebar Filter Panel */}
        <aside className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left', position: 'sticky', top: '100px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <span style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <SlidersHorizontal size={16} /> Bộ lọc tìm kiếm
            </span>
            <button 
              onClick={handleResetFilters}
              style={{ padding: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
              title="Đặt lại tất cả"
            >
              <RefreshCcw size={12} /> Đặt lại
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Danh mục
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    backgroundColor: selectedCategory === cat ? 'var(--primary-glow)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                    width: '100%'
                  }}
                >
                  {cat === 'All' ? 'Tất cả' : 
                   cat === 'Figure' ? 'Figure / Mô hình' :
                   cat === 'Food' ? 'Đồ ăn / Bánh kẹo' :
                   cat === 'Books' ? 'Sách / Manga' :
                   cat === 'Goods' ? 'Đồ dùng Nhật Bản' :
                   cat === 'Cosmetics' ? 'Mỹ phẩm / Làm đẹp' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Khoảng giá
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>$0</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Tối đa: ${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[1]}
                onChange={handlePriceChange}
                style={{
                  width: '100%',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Options / Sensitive Filters */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tùy chọn khác
            </h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={showNsfw}
                onChange={(e) => setShowNsfw(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Hiển thị sản phẩm NSFW</span>
            </label>
          </div>

        </aside>

        {/* Main Grid View */}
        <div>
          {filteredProducts.length > 0 ? (
            <div className="grid-cols-responsive">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              gap: '16px'
            }}>
              <div style={{
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                padding: '24px',
                borderRadius: '50%'
              }}>
                <ShoppingBag size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Không tìm thấy sản phẩm</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', margin: '0 auto', fontSize: '0.9rem' }}>
                Không tìm thấy sản phẩm nào khớp với điều kiện tìm kiếm hoặc khoảng giá của bạn. Hãy thử thay đổi bộ lọc.
              </p>
              <button 
                onClick={handleResetFilters}
                className="btn btn-primary"
                style={{ marginTop: '8px' }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
