import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginRegister: React.FC = () => {
  const { login, setActiveView } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (activeTab === 'register' && !name.trim()) {
      setError('Vui lòng nhập họ tên để đăng ký.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const userName = activeTab === 'register' ? name : 'Khách hàng YellowOrder';
      login(email.trim(), userName);
      setActiveView('home');
    }, 1000);
  };

  const handleQuickLogin = () => {
    login('demo@yelloworder.com', 'Nguyễn Văn Demo');
    setActiveView('home');
  };

  return (
    <div className="container" style={{ padding: '60px 0 100px 0', display: 'flex', justifyContent: 'center' }}>
      
      {/* Form Container Card */}
      <div className="card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '36px',
        boxShadow: 'var(--shadow-xl)',
        textAlign: 'left'
      }}>
        
        {/* Toggle Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--border-color)',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '1.05rem',
              fontWeight: activeTab === 'login' ? 700 : 500,
              color: activeTab === 'login' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: '2px solid ' + (activeTab === 'login' ? 'var(--primary)' : 'transparent'),
              marginBottom: '-2px'
            }}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '1.05rem',
              fontWeight: activeTab === 'register' ? 700 : 500,
              color: activeTab === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: '2px solid ' + (activeTab === 'register' ? 'var(--primary)' : 'transparent'),
              marginBottom: '-2px'
            }}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* Brand/Subtitle */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Chào mừng bạn đến với YellowOrder
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>
            {activeTab === 'login' ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}
          </h3>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Name Field (Register only) */}
          {activeTab === 'register' && (
            <div>
              <label className="label">Họ và tên *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                  placeholder="Nguyễn Văn A"
                  required
                />
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="label">Địa chỉ Email *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '44px' }}
                placeholder="example@gmail.com"
                required
              />
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="label" style={{ marginBottom: 0 }}>Mật khẩu *</label>
              {activeTab === 'login' && (
                <a href="#" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                  Quên mật khẩu?
                </a>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                placeholder="••••••••"
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox (Login only) */}
          {activeTab === 'login' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Duy trì đăng nhập</span>
            </label>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', height: '48px', fontWeight: 700, marginTop: '8px' }}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : activeTab === 'login' ? (
              'Đăng nhập'
            ) : (
              'Đăng ký tài khoản'
            )}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            margin: '12px 0'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span>BẢN CHẠY THỬ NGHIỆM</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* Quick Mock Login Button */}
          <button
            type="button"
            onClick={handleQuickLogin}
            className="btn btn-secondary"
            style={{
              width: '100%',
              height: '46px',
              fontWeight: 700,
              gap: '8px',
              borderStyle: 'dashed',
              borderColor: 'var(--primary)',
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--text-primary)'
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} /> Đăng nhập nhanh (Xem mẫu)
          </button>

        </form>

      </div>
    </div>
  );
};
