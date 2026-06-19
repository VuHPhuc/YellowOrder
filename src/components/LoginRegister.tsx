import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginRegister: React.FC = () => {
  const { login, signUp, setActiveView } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  React.useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSuccessModal]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      if (activeTab === 'login') {
        const { error: loginError } = await login(email.trim(), password);
        if (loginError) {
          setError(loginError.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } else {
          setActiveView('home');
        }
      } else {
        const { error: signUpError } = await signUp(email.trim(), password, name.trim());
        if (signUpError) {
          setError(signUpError.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } else {
          setShowSuccessModal(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi trong quá trình kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { error: loginError } = await login('demo@yelloworder.com', '12345678');
      if (loginError) {
        setError('Tài khoản demo@yelloworder.com chưa tồn tại. Hãy đăng ký một tài khoản mới để trải nghiệm!');
      } else {
        setActiveView('home');
      }
    } catch (err: any) {
      setError('Lỗi kết nối khi đăng nhập tài khoản demo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="container" 
      style={{ 
        padding: '60px 0 100px 0', 
        display: 'flex', 
        justifyContent: 'center',
        position: showSuccessModal ? 'relative' : 'static',
        zIndex: showSuccessModal ? 1001 : 'auto'
      }}
    >
      
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

      {/* Elegant Custom Registration Success Modal */}
      {showSuccessModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSuccessModal(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            overflowY: 'auto'
          }} 
          className="animate-fade-in"
        >
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            margin: '40px auto',
            padding: '36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            border: '1.5px solid var(--primary)',
            background: 'var(--bg-card)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 0 20px var(--primary-glow-strong)'
            }}>
              <Mail size={32} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Đăng Ký Thành Công! 🎉</h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px', textAlign: 'left' }}>
              Tài khoản của bạn đã được khởi tạo thành công trên hệ thống. Vui lòng thực hiện bước tiếp theo để hoàn tất kích hoạt tài khoản.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-input)',
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              fontSize: '0.85rem',
              borderLeft: '4px solid var(--primary)',
              marginBottom: '24px',
              lineHeight: 1.5
            }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                📧 Hướng dẫn xác thực tài khoản Gmail:
              </strong>
              <ul style={{ margin: '0 0 0 16px', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Vui lòng kiểm tra hộp thư đến (hoặc thư rác/spam) của địa chỉ email vừa đăng ký.</li>
                <li>Nhấp vào liên kết xác thực để kích hoạt tài khoản của bạn.</li>
                <li style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  <em>Chú ý quan trọng:</em> Khi bấm vào link xác thực, trang web chuyển hướng của Supabase có thể hiển thị như bị lỗi hoặc trống. Tuy nhiên tài khoản của bạn thực chất đã được xác thực thành công. Bạn chỉ cần quay lại trang đăng nhập của YellowOrder và đăng nhập lại là sẽ hoạt động bình thường!
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                setActiveTab('login');
                setPassword('');
              }}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', fontWeight: 700 }}
            >
              Tôi đã hiểu, đi tới Đăng nhập
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
