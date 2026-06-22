import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Calendar, ShieldAlert, ShoppingBag, Eye, Settings } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { supabase } from '../utils/supabase';

export const AccountPage: React.FC = () => {
  const { 
    currentUser, 
    setLastOrder, 
    userOrders, 
    userOrdersLoading, 
    fetchUserOrders, 
    setActiveView, 
    showNsfw, 
    setShowNsfw, 
    blurNsfw, 
    setBlurNsfw 
  } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  // Profile details settings
  const [name, setName] = useState(currentUser?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password change settings
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleViewOrder = (order: any) => {
    setLastOrder(order);
    localStorage.setItem('yelloworder_last_order', JSON.stringify(order));
    setActiveView('success');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfileLoading(true);
    setProfileSuccess(false);
    setProfileError('');
    try {
      // 1. Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: name.trim() }
      });
      if (authError) throw authError;

      // 2. Update profiles table in database
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', currentUser.id);
      if (dbError) throw dbError;

      setProfileSuccess(true);
      
      // Reload page to synchronize state globally
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setProfileError(err.message || 'Lỗi khi cập nhật thông tin.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    setPasswordLoading(true);
    setPasswordSuccess(false);
    setPasswordError('');
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Lỗi khi thay đổi mật khẩu.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 80px 0', textAlign: 'left' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px' }}>Trang cá nhân</h2>

      <div className="grid-account-layout">

        {/* User profile card (Left Column) */}
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}>{currentUser.name}</h3>
            <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>Khách hàng Bạc</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Email liên hệ</span>
                <strong style={{ wordBreak: 'break-all' }}>{currentUser.email}</strong>
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

        {/* Content area (Right Column) */}
        <main className="card" style={{ padding: '24px', minHeight: '300px' }}>
          
          {/* Tab Navigation Headers */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '12px 16px',
                fontSize: '0.95rem',
                fontWeight: activeTab === 'orders' ? 800 : 600,
                color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ShoppingBag size={16} /> Lịch sử mua hàng
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              style={{
                padding: '12px 16px',
                fontSize: '0.95rem',
                fontWeight: activeTab === 'settings' ? 800 : 600,
                color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'settings' ? '3px solid var(--primary)' : '3px solid transparent',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Settings size={16} /> Thiết lập tài khoản
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'orders' ? (
            /* Order History Tab */
            userOrdersLoading ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                gap: '12px'
              }}>
                <span className="loading-spinner" style={{ width: '32px', height: '32px' }}></span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Đang tải danh sách đơn hàng...</p>
              </div>
            ) : userOrders.length > 0 ? (
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

                {/* Order rows */}
                {userOrders.map((order) => (
                  <div key={order.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 140px 100px 100px',
                    padding: '16px',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <strong style={{ color: 'var(--primary)' }}>{order.id}</strong>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
                      {order.items[0]?.product.name || 'Không rõ sản phẩm'} 
                      {order.items.length > 1 ? ` và ${order.items.length - 1} sản phẩm khác` : ''}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{order.date.split(',')[0]}</span>
                    <strong>{formatPrice(order.total)}</strong>
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleViewOrder(order)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: '1px solid var(--border-color)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={12} /> Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
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
            )
          ) : (
            /* Account Settings Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', textAlign: 'left' }}>
              
              {/* Profile details edit form */}
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Thông tin cá nhân
                </h4>
                
                {profileSuccess && (
                  <div style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                    ✓ Cập nhật thông tin thành công! Hệ thống đang tải lại...
                  </div>
                )}
                {profileError && (
                  <div style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                    ✗ {profileError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Tên hiển thị</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="input-field" 
                      placeholder="Nhập tên hiển thị..."
                      style={{ height: '42px', padding: '0 12px', fontSize: '0.9rem' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Email liên hệ</label>
                    <input 
                      type="email" 
                      value={currentUser.email} 
                      className="input-field" 
                      disabled 
                      style={{ height: '42px', padding: '0 12px', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', height: '40px', padding: '0 24px', fontWeight: 700 }} disabled={profileLoading}>
                  {profileLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </button>
              </form>

              {/* Password change form */}
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Đổi mật khẩu
                </h4>
                
                {passwordSuccess && (
                  <div style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                    ✓ Đổi mật khẩu thành công!
                  </div>
                )}
                {passwordError && (
                  <div style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.85rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                    ✗ {passwordError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Mật khẩu mới</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field" 
                      placeholder="Tối thiểu 6 ký tự..."
                      style={{ height: '42px', padding: '0 12px', fontSize: '0.9rem' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field" 
                      placeholder="Nhập lại mật khẩu..."
                      style={{ height: '42px', padding: '0 12px', fontSize: '0.9rem' }}
                      required
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-outline" style={{ alignSelf: 'flex-start', height: '40px', padding: '0 24px', fontWeight: 700 }} disabled={passwordLoading}>
                  {passwordLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
              </form>

              {/* NSFW (18+) configuration options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Thiết lập hiển thị (NSFW 18+)
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    cursor: 'pointer', 
                    padding: '16px', 
                    border: '1.5px solid var(--border-color)', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: showNsfw ? 'rgba(234,179,8,0.03)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={showNsfw}
                      onChange={(e) => setShowNsfw(e.target.checked)}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', marginTop: '3px', cursor: 'pointer' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>Hiển thị nội dung NSFW 18+</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block' }}>
                        Cho phép các sản phẩm chứa hình ảnh nhạy cảm, mô hình 18+ xuất hiện khi bạn đang duyệt qua danh sách sản phẩm.
                      </span>
                    </div>
                  </label>

                  {showNsfw && (
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      cursor: 'pointer', 
                      padding: '16px', 
                      border: '1.5px solid var(--border-color)', 
                      borderRadius: 'var(--radius-md)', 
                      backgroundColor: blurNsfw ? 'rgba(234,179,8,0.03)' : 'transparent',
                      marginLeft: '24px',
                      transition: 'all var(--transition-fast)',
                      animation: 'animate-fade-in 0.25s ease'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={blurNsfw}
                        onChange={(e) => setBlurNsfw(e.target.checked)}
                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', marginTop: '3px', cursor: 'pointer' }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>Tự động làm mờ hình ảnh nhạy cảm</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block' }}>
                          Mặc định làm mờ (blur) hình ảnh sản phẩm 18+ trong cửa hàng. Bạn có thể bấm trực tiếp vào hình ảnh trên thẻ sản phẩm hoặc trang chi tiết để mở khóa tạm thời.
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

            </div>
          )}
        </main>

      </div>
    </div>
  );
};
