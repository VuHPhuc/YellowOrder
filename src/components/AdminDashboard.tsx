import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../context/StoreContext';
import { 
  Package, 
  ListOrdered, 
  Plus, 
  Trash2, 
  Edit,
  Upload, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  RefreshCcw,
  Sparkles,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    products, 
    allOrders, 
    fetchAllOrders, 
    updateOrderStatus, 
    addProduct, 
    deleteProduct,
    updateProduct,
    setActiveView 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add-product'>('orders');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Add Product Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodCategory, setProdCategory] = useState('Figure');
  const [prodDescription, setProdDescription] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsNsfw, setProdIsNsfw] = useState(false);
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Specs Builder State
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Hãng sản xuất', value: 'YellowOrder' }
  ]);

  // Features Builder State
  const [features, setFeatures] = useState<string[]>(['']);

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCategory, setEditCategory] = useState('Figure');
  const [editDescription, setEditDescription] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsNsfw, setEditIsNsfw] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editSpecs, setEditSpecs] = useState<{ key: string; value: string }[]>([]);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAllOrders();
    }
  }, [currentUser]);

  // Security Check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{
          maxWidth: '480px',
          width: '100%',
          padding: '40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quyền truy cập bị từ chối</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Khu vực này chỉ dành riêng cho Quản trị viên hệ thống. Vui lòng đăng nhập với tài khoản Admin để truy cập.
          </p>
          <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
            <button 
              onClick={() => setActiveView('home')} 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
            >
              Về trang chủ
            </button>
            <button 
              onClick={() => setActiveView('login')} 
              className="btn btn-primary" 
              style={{ flex: 1 }}
            >
              Đăng nhập Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Image change and create preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Specs helper functions
  const addSpecRow = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const updateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const deleteSpecRow = (index: number) => {
    setSpecs(specs.filter((_, i: number) => i !== index));
  };

  // Features helper functions
  const addFeatureRow = () => {
    setFeatures([...features, '']);
  };

  const updateFeatureRow = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const deleteFeatureRow = (index: number) => {
    setFeatures(features.filter((_, i: number) => i !== index));
  };

  // Start Edit Mode and Populate States
  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditPrice(prod.price.toString());
    setEditStock(prod.stock.toString());
    setEditCategory(prod.category);
    setEditDescription(prod.description || '');
    setEditIsFeatured(!!prod.isFeatured);
    setEditIsNsfw(!!prod.isNsfw);
    setEditImageFile(null);
    setEditImagePreview(prod.image);
    
    const specsArr = Object.entries(prod.specs || {}).map(([key, value]) => ({
      key,
      value: value as string
    }));
    setEditSpecs(specsArr.length > 0 ? specsArr : [{ key: '', value: '' }]);
    setEditFeatures(prod.features && prod.features.length > 0 ? prod.features : ['']);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview('');
  };

  const addEditSpecRow = () => {
    setEditSpecs([...editSpecs, { key: '', value: '' }]);
  };

  const updateEditSpecRow = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...editSpecs];
    updated[index][field] = val;
    setEditSpecs(updated);
  };

  const deleteEditSpecRow = (index: number) => {
    setEditSpecs(editSpecs.filter((_, i: number) => i !== index));
  };

  const addEditFeatureRow = () => {
    setEditFeatures([...editFeatures, '']);
  };

  const updateEditFeatureRow = (index: number, val: string) => {
    const updated = [...editFeatures];
    updated[index] = val;
    setEditFeatures(updated);
  };

  const deleteEditFeatureRow = (index: number) => {
    setEditFeatures(editFeatures.filter((_, i: number) => i !== index));
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!editName.trim()) {
      setErrorMsg('Vui lòng nhập tên sản phẩm.');
      return;
    }

    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Giá sản phẩm phải là một số lớn hơn 0.');
      return;
    }

    const stockNum = parseInt(editStock);
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Số lượng tồn kho không được âm.');
      return;
    }

    setLoading(true);

    const specsObj: Record<string, string> = {};
    editSpecs.forEach((s: any) => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    const filteredFeatures = editFeatures.filter((f: string) => f.trim() !== '');

    const productPayload = {
      name: editName.trim(),
      price: priceNum,
      category: editCategory,
      description: editDescription.trim(),
      specs: specsObj,
      features: filteredFeatures,
      stock: stockNum,
      isFeatured: editIsFeatured,
      isNsfw: editIsNsfw
    };

    try {
      if (!editingProduct) return;
      const result = await updateProduct(editingProduct.id, productPayload, editImageFile || undefined);
      if (result.success) {
        setSuccessMsg(`Đã cập nhật sản phẩm "${editName}" thành công!`);
        setEditingProduct(null);
      } else {
        setErrorMsg(result.error || 'Đã xảy ra lỗi khi cập nhật sản phẩm.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Product Form
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!prodName.trim()) {
      setErrorMsg('Vui lòng nhập tên sản phẩm.');
      return;
    }

    const priceNum = parseFloat(prodPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Giá sản phẩm phải là một số lớn hơn 0.');
      return;
    }

    const stockNum = parseInt(prodStock);
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Số lượng tồn kho không được âm.');
      return;
    }

    setLoading(true);

    // Transform specs and features
    const specsObj: Record<string, string> = {};
    specs.forEach((s: any) => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    const filteredFeatures = features.filter((f: string) => f.trim() !== '');

    const productPayload = {
      name: prodName.trim(),
      price: priceNum,
      category: prodCategory,
      description: prodDescription.trim(),
      specs: specsObj,
      features: filteredFeatures,
      stock: stockNum,
      isFeatured: prodIsFeatured,
      isNsfw: prodIsNsfw
    };

    try {
      const result = await addProduct(productPayload, imageFile || undefined);
      if (result.success) {
        setSuccessMsg(`Đã đăng tải sản phẩm "${prodName}" thành công!`);
        // Reset Form
        setProdName('');
        setProdPrice('');
        setProdStock('10');
        setProdDescription('');
        setProdIsFeatured(false);
        setProdIsNsfw(false);
        handleClearImage();
        setSpecs([{ key: 'Hãng sản xuất', value: 'YellowOrder' }]);
        setFeatures(['']);
      } else {
        setErrorMsg(result.error || 'Đã xảy ra lỗi khi tạo sản phẩm.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  // Delete product action
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        const result = await deleteProduct(id);
        if (result.success) {
          setSuccessMsg(`Đã xóa sản phẩm "${name}" thành công!`);
        } else {
          setErrorMsg(result.error || 'Lỗi khi xóa sản phẩm.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Lỗi kết nối khi xóa.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div 
      className="container animate-fade-in" 
      style={{ 
        padding: '40px 0 80px 0', 
        textAlign: 'left',
        position: editingProduct ? 'relative' : 'static',
        zIndex: editingProduct ? 1001 : 'auto'
      }}
    >
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={28} style={{ color: 'var(--primary)' }} /> Trang Quản Trị Hệ Thống
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý đơn hàng, danh mục sản phẩm và cập nhật hệ thống YellowOrder.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveView('shop')} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.85rem' }}
          >
            Xem Cửa hàng
          </button>
        </div>
      </div>

      {/* Main Panel Grid */}
      <div className="grid-account-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '30px' }}>
        
        {/* Navigation Sidebar Tabs */}
        <aside className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', height: 'fit-content' }}>
          <button
            onClick={() => {
              setActiveTab('orders');
              setSuccessMsg('');
              setErrorMsg('');
              fetchAllOrders();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              backgroundColor: activeTab === 'orders' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <ListOrdered size={16} /> Quản lý Đơn hàng
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setSuccessMsg('');
              setErrorMsg('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'products' ? 700 : 500,
              backgroundColor: activeTab === 'products' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Package size={16} /> Danh sách Sản phẩm
          </button>

          <button
            onClick={() => {
              setActiveTab('add-product');
              setSuccessMsg('');
              setErrorMsg('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'add-product' ? 700 : 500,
              backgroundColor: activeTab === 'add-product' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'add-product' ? 'var(--primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Plus size={16} /> Đăng sản phẩm mới
          </button>
        </aside>

        {/* Workspace Display */}
        <main className="card" style={{ padding: '28px', minHeight: '400px' }}>
          
          {/* Notification Messages */}
          {successMsg && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={18} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={18} /> {errorMsg}
            </div>
          )}

          {/* TAB 1: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Quản lý Đơn hàng ({allOrders.length})</h3>
                <button 
                  onClick={fetchAllOrders} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
                  title="Làm mới đơn hàng"
                >
                  <RefreshCcw size={12} /> Làm mới
                </button>
              </div>

              {allOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <ListOrdered size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.95rem' }}>Chưa có đơn hàng nào được thực hiện trong hệ thống.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-input)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>MÃ ĐƠN HÀNG</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>KHÁCH HÀNG</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>TỔNG TIỀN</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>NGÀY ĐẶT</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>TRẠNG THÁI</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{order.id}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600 }}>{order.shipping?.fullName || 'Khách hàng ẩn danh'}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{order.shipping?.phone || 'Không có SĐT'}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.total)}
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{order.date}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`badge ${
                              order.status === 'delivered' ? 'badge-yellow' : 
                              order.status === 'shipped' ? 'badge-yellow' : ''
                            }`} style={{ 
                              fontSize: '0.7rem',
                              backgroundColor: order.status === 'delivered' ? '#10b981' : order.status === 'shipped' ? '#3b82f6' : 'rgba(234,179,8,0.2)',
                              color: order.status === 'delivered' || order.status === 'shipped' ? '#fff' : 'var(--primary)'
                            }}>
                              {order.status === 'delivered' ? 'Đã giao' : 
                               order.status === 'shipped' ? 'Đang giao' : 'Đang xử lý'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="input-field"
                              style={{ width: '120px', height: '32px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                            >
                              <option value="processing">Đang xử lý</option>
                              <option value="shipped">Đang giao</option>
                              <option value="delivered">Đã giao</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
                Danh sách Sản phẩm ({products.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {products.map(prod => (
                  <div key={prod.id} className="card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    gap: '16px',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{prod.name}</h4>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{prod.category}</span>
                          <span style={{ color: 'var(--border-hover)' }}>•</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prod.price)}
                          </span>
                          <span style={{ color: 'var(--border-hover)' }}>•</span>
                          <span style={{ fontSize: '0.75rem', color: prod.stock > 0 ? 'var(--text-secondary)' : '#ef4444', fontWeight: 600 }}>
                            Kho: {prod.stock}
                          </span>
                          {prod.isNsfw && (
                            <>
                              <span style={{ color: 'var(--border-hover)' }}>•</span>
                              <span style={{ fontSize: '0.65rem', backgroundColor: '#ef4444', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 700 }}>NSFW</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleStartEdit(prod)}
                        disabled={loading}
                        style={{
                          padding: '8px',
                          color: 'var(--primary)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          transition: 'background var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-glow)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        disabled={loading}
                        style={{
                          padding: '8px',
                          color: '#ef4444',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          transition: 'background var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD PRODUCT FORM */}
          {activeTab === 'add-product' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
                Đăng Sản phẩm Mới Lên Shop
              </h3>

              <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Basic Fields Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="label">Tên sản phẩm *</label>
                    <input 
                      type="text" 
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="input-field" 
                      placeholder="e.g. YellowOrder Monitor Stand"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Giá sản phẩm (USD) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="input-field" 
                      placeholder="e.g. 49.99"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Tồn kho ban đầu *</label>
                    <input 
                      type="number" 
                      min="0"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      className="input-field" 
                      placeholder="e.g. 10"
                      required
                    />
                  </div>
                </div>

                {/* Category and Flags Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
                  <div>
                    <label className="label">Danh mục sản phẩm *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="input-field"
                    >
                      <option value="Figure">Figure / Mô hình</option>
                      <option value="Food">Đồ ăn / Bánh kẹo</option>
                      <option value="Books">Sách / Manga</option>
                      <option value="Goods">Đồ dùng Nhật Bản</option>
                      <option value="Cosmetics">Mỹ phẩm / Làm đẹp</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', paddingTop: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox"
                        checked={prodIsFeatured}
                        onChange={(e) => setProdIsFeatured(e.target.checked)}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      <span style={{ fontWeight: 600 }}>Sản phẩm nổi bật</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox"
                        checked={prodIsNsfw}
                        onChange={(e) => setProdIsNsfw(e.target.checked)}
                        style={{ accentColor: '#ef4444', width: '16px', height: '16px' }}
                      />
                      <span style={{ fontWeight: 600, color: prodIsNsfw ? '#ef4444' : 'inherit' }}>Giới hạn 18+ (NSFW)</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="label">Mô tả sản phẩm</label>
                  <textarea 
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="input-field"
                    style={{ height: '100px', resize: 'vertical', padding: '12px' }}
                    placeholder="Mô tả các đặc trưng của sản phẩm, vật liệu thiết kế..."
                  />
                </div>

                {/* Image File Selector */}
                <div>
                  <label className="label">Hình ảnh sản phẩm *</label>
                  <div style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-input)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    position: 'relative'
                  }}>
                    {imagePreview ? (
                      <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img src={imagePreview} alt="Xem trước" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button"
                          onClick={handleClearImage}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} style={{ color: 'var(--text-muted)' }} />
                        <div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Click để chọn ảnh hoặc kéo thả ảnh vào đây</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Hỗ trợ JPG, PNG, WEBP (Khuyên dùng tỷ lệ 5:4 hoặc 1:1)</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Specs Builder */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="label" style={{ marginBottom: 0 }}>Thông số kỹ thuật</label>
                    <button 
                      type="button" 
                      onClick={addSpecRow}
                      style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={14} /> Thêm dòng
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {specs.map((spec: any, index: number) => (
                      <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          value={spec.key}
                          onChange={(e) => updateSpecRow(index, 'key', e.target.value)}
                          className="input-field" 
                          style={{ flex: 1 }} 
                          placeholder="e.g. Kích thước"
                        />
                        <input 
                          type="text" 
                          value={spec.value}
                          onChange={(e) => updateSpecRow(index, 'value', e.target.value)}
                          className="input-field" 
                          style={{ flex: 1.5 }} 
                          placeholder="e.g. 45 x 30 cm"
                        />
                        <button
                          type="button"
                          onClick={() => deleteSpecRow(index)}
                          style={{ color: '#ef4444', padding: '8px', cursor: 'pointer' }}
                          title="Xóa dòng"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Builder */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="label" style={{ marginBottom: 0 }}>Các tính năng nổi bật</label>
                    <button 
                      type="button" 
                      onClick={addFeatureRow}
                      style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={14} /> Thêm tính năng
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {features.map((feat: string, index: number) => (
                      <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          value={feat}
                          onChange={(e) => updateFeatureRow(index, e.target.value)}
                          className="input-field" 
                          style={{ flex: 1 }} 
                          placeholder="e.g. Kết nối Type-C tốc độ cao"
                        />
                        <button
                          type="button"
                          onClick={() => deleteFeatureRow(index)}
                          style={{ color: '#ef4444', padding: '8px', cursor: 'pointer' }}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', height: '48px', fontWeight: 700, marginTop: '12px', gap: '8px' }}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      <Sparkles size={18} /> Đăng tải sản phẩm
                    </>
                  )}
                </button>

              </form>
            </div>
          )}

        </main>
      </div>

      {/* Product Edit Modal Overlay */}
      {editingProduct && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingProduct(null);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
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
            maxWidth: '750px',
            width: '100%',
            margin: '40px auto',
            padding: '32px',
            boxShadow: 'var(--shadow-xl)',
            border: '1.5px solid var(--primary)',
            background: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={20} style={{ color: 'var(--primary)' }} /> Chỉnh sửa sản phẩm: <span style={{ color: 'var(--primary)' }}>{editingProduct.name}</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingProduct(null)} 
                style={{ padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label className="label">Tên sản phẩm *</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input-field" 
                    required
                  />
                </div>

                <div>
                  <label className="label">Giá sản phẩm (USD) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="input-field" 
                    required
                  />
                </div>

                <div>
                  <label className="label">Tồn kho *</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="input-field" 
                    required
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
                <div>
                  <label className="label">Danh mục sản phẩm *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="Figure">Figure / Mô hình</option>
                    <option value="Food">Đồ ăn / Bánh kẹo</option>
                    <option value="Books">Sách / Manga</option>
                    <option value="Goods">Đồ dùng Nhật Bản</option>
                    <option value="Cosmetics">Mỹ phẩm / Làm đẹp</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '20px', paddingTop: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontWeight: 600 }}>Sản phẩm nổi bật</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox"
                      checked={editIsNsfw}
                      onChange={(e) => setEditIsNsfw(e.target.checked)}
                      style={{ accentColor: '#ef4444', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontWeight: 600, color: editIsNsfw ? '#ef4444' : 'inherit' }}>Giới hạn 18+ (NSFW)</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label">Mô tả sản phẩm</label>
                <textarea 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input-field"
                  style={{ height: '80px', resize: 'vertical', padding: '12px' }}
                />
              </div>

              {/* Image Selection */}
              <div>
                <label className="label">Hình ảnh sản phẩm (Để trống nếu giữ nguyên)</label>
                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-input)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  position: 'relative'
                }}>
                  {editImagePreview ? (
                    <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={editImagePreview} alt="Xem trước" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={handleClearEditImage}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Chọn ảnh mới để thay đổi</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleEditImageChange}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Specs Editor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="label" style={{ marginBottom: 0 }}>Thông số kỹ thuật</label>
                  <button 
                    type="button" 
                    onClick={addEditSpecRow}
                    style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Thêm dòng
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px' }}>
                  {editSpecs.map((spec: any, index: number) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={spec.key}
                        onChange={(e) => updateEditSpecRow(index, 'key', e.target.value)}
                        className="input-field" 
                        style={{ flex: 1, height: '38px' }} 
                        placeholder="Thông số"
                      />
                      <input 
                        type="text" 
                        value={spec.value}
                        onChange={(e) => updateEditSpecRow(index, 'value', e.target.value)}
                        className="input-field" 
                        style={{ flex: 1.5, height: '38px' }} 
                        placeholder="Giá trị"
                      />
                      <button
                        type="button"
                        onClick={() => deleteEditSpecRow(index)}
                        style={{ color: '#ef4444', padding: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Editor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="label" style={{ marginBottom: 0 }}>Các tính năng nổi bật</label>
                  <button 
                    type="button" 
                    onClick={addEditFeatureRow}
                    style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Thêm tính năng
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
                  {editFeatures.map((feat: string, index: number) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={feat}
                        onChange={(e) => updateEditFeatureRow(index, e.target.value)}
                        className="input-field" 
                        style={{ flex: 1, height: '38px' }} 
                        placeholder="Tính năng"
                      />
                      <button
                        type="button"
                        onClick={() => deleteEditFeatureRow(index)}
                        style={{ color: '#ef4444', padding: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, height: '44px', fontWeight: 700 }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 1, height: '44px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loading ? <span className="loading-spinner"></span> : <><Sparkles size={16} /> Lưu thay đổi</>}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
