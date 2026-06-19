import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Sun, Moon, LogOut, User, ShoppingBag } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    searchQuery,
    setSearchQuery,
    currentUser,
    logout,
    activeView,
    setActiveView,
    theme,
    toggleTheme
  } = useStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (activeView !== 'shop' && activeView !== 'home') {
      setActiveView('shop');
    }
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    setActiveView('home');
  };

  return (
    <header className="glass-header">
      <div className="container navbar-wrapper">
        
        {/* Brand Logo */}
        <div 
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            background: 'var(--primary)',
            color: 'var(--text-on-primary)',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-glow-strong)'
          }}>
            <ShoppingBag size={24} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Yellow<span style={{ color: 'var(--primary)' }}>Order</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => setActiveView('home')}
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: activeView === 'home' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            Trang Chủ
          </button>
          <button 
            onClick={() => setActiveView('shop')}
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem',
              color: activeView === 'shop' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            Cửa Hàng
          </button>
        </nav>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }} className="search-container">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="input-field"
            style={{ paddingLeft: '44px', height: '44px' }}
          />
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
        </div>

        {/* Utilities: Theme Toggle, Cart, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-card)'
            }}
            title="Đổi giao diện"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={() => setActiveView('cart')}
            style={{
              position: 'relative',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: activeView === 'cart' ? 'var(--primary)' : 'var(--text-primary)',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--primary)',
                color: 'var(--text-on-primary)',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-card)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-on-primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
              </button>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '180px',
                  padding: '8px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{currentUser.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveView('account');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      justifyContent: 'flex-start',
                      width: '100%',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <User size={16} /> Lịch sử mua hàng
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      color: '#ef4444',
                      justifyContent: 'flex-start',
                      width: '100%'
                    }}
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveView('login')}
              className="btn btn-primary"
              style={{ padding: '8px 16px', height: '42px', fontSize: '0.9rem' }}
            >
              <User size={16} /> Đăng nhập
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
