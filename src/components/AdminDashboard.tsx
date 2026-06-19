import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product, Order } from '../context/StoreContext';
import { supabase } from '../utils/supabase';
import { formatPrice, convertJpyToVnd, convertVndToJpy, formatWithDots } from '../utils/currency';
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
  X,
  Users
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

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add-product' | 'accounts'>('orders');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // User/Account State
  const [profiles, setProfiles] = useState<any[]>([]);
  const [fetchingProfiles, setFetchingProfiles] = useState(false);

  // Order Details Modal State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Add Product Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodPriceJpy, setProdPriceJpy] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodCategory, setProdCategory] = useState('Figure');
  const [prodDescription, setProdDescription] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsNsfw, setProdIsNsfw] = useState(false);
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);

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
  const [editPriceJpy, setEditPriceJpy] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCategory, setEditCategory] = useState('Figure');
  const [editDescription, setEditDescription] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsNsfw, setEditIsNsfw] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editSpecs, setEditSpecs] = useState<{ key: string; value: string }[]>([]);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [editSubImageFiles, setEditSubImageFiles] = useState<File[]>([]);
  const [editSubImagePreviews, setEditSubImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Fetch profiles for account management
  const fetchProfiles = async () => {
    setFetchingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });
      if (error) {
        setErrorMsg('Lỗi tải danh sách tài khoản: ' + error.message);
      } else if (data) {
        setProfiles(data);
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối khi tải danh sách tài khoản: ' + err.message);
    } finally {
      setFetchingProfiles(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'user') => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);
      if (error) {
        setErrorMsg('Lỗi cập nhật vai trò: ' + error.message);
      } else {
        setSuccessMsg('Cập nhật vai trò thành công!');
        setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (userId: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}" khỏi hệ thống không?`)) {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        if (error) {
          setErrorMsg('Lỗi khi xóa tài khoản: ' + error.message);
        } else {
          setSuccessMsg(`Đã xóa tài khoản "${name}" thành công!`);
          setProfiles(prev => prev.filter(p => p.id !== userId));
        }
      } catch (err: any) {
        setErrorMsg('Lỗi kết nối khi xóa: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      if (activeTab === 'orders') {
        fetchAllOrders();
        fetchProfiles();
      } else if (activeTab === 'accounts') {
        fetchProfiles();
      }
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    if (editingProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingProduct]);

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

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSubImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setSubImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleClearSubImage = (index: number) => {
    setSubImageFiles(prev => prev.filter((_, i) => i !== index));
    setSubImagePreviews(prev => prev.filter((_, i) => i !== index));
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
    setEditPrice(formatWithDots(prod.price.toString()));
    setEditPriceJpy(formatWithDots(convertVndToJpy(prod.price).toString()));
    setEditStock(prod.stock.toString());
    setEditCategory(prod.category);
    setEditDescription(prod.description || '');
    setEditIsFeatured(!!prod.isFeatured);
    setEditIsNsfw(!!prod.isNsfw);
    setEditImageFile(null);
    setEditImagePreview(prod.image);
    
    // Set gallery / sub-images states
    setExistingImages(prod.images || (prod.image ? [prod.image] : []));
    setEditSubImageFiles([]);
    setEditSubImagePreviews([]);
    
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

  const handleEditSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setEditSubImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setEditSubImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleClearEditSubImage = (index: number) => {
    setEditSubImageFiles(prev => prev.filter((_, i) => i !== index));
    setEditSubImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
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

    const priceNum = parseInt(editPrice.replace(/\D/g, ''), 10);
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
      isNsfw: editIsNsfw,
      existingImages: existingImages
    };

    try {
      if (!editingProduct) return;
      const result = await updateProduct(editingProduct.id, productPayload, editImageFile || undefined, editSubImageFiles);
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

    const priceNum = parseInt(prodPrice.replace(/\D/g, ''), 10);
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
      const result = await addProduct(productPayload, imageFile || undefined, subImageFiles);
      if (result.success) {
        setSuccessMsg(`Đã đăng tải sản phẩm "${prodName}" thành công!`);
        // Reset Form
        setProdName('');
        setProdPrice('');
        setProdPriceJpy('');
        setProdStock('10');
        setProdDescription('');
        setProdIsFeatured(false);
        setProdIsNsfw(false);
        handleClearImage();
        setSubImageFiles([]);
        setSubImagePreviews([]);
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
      className="container" 
      style={{ 
        padding: '40px 0 80px 0', 
        textAlign: 'left',
        position: editingProduct ? 'relative' : 'static',
        zIndex: editingProduct ? 1001 : 'auto'
      }}
    >
      <div className="animate-fade-in">
      
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
              fetchProfiles();
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

          <button
            onClick={() => {
              setActiveTab('accounts');
              setSuccessMsg('');
              setErrorMsg('');
              fetchProfiles();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'accounts' ? 700 : 500,
              backgroundColor: activeTab === 'accounts' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'accounts' ? 'var(--primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Users size={16} /> Quản lý Tài khoản
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
                  onClick={() => { fetchAllOrders(); fetchProfiles(); }} 
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
                            <div style={{ fontWeight: 600 }}>
                              {order.shipping?.name || order.shipping?.fullName || (profiles.find(p => p.id === order.user_id)?.name) || 'Khách hàng ẩn danh'}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{order.shipping?.phone || 'Không có SĐT'}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                            {formatPrice(order.total)}
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
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, height: '32px' }}
                            >
                              Chi tiết
                            </button>
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
                            {formatPrice(prod.price)}
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
                    <label className="label">Giá sản phẩm (VND) *</label>
                    <input 
                      type="text" 
                      value={prodPrice}
                      onChange={(e) => {
                        const formatted = formatWithDots(e.target.value);
                        setProdPrice(formatted);
                        const rawVnd = parseInt(formatted.replace(/\D/g, ''), 10);
                        if (!isNaN(rawVnd) && rawVnd > 0) {
                          setProdPriceJpy(formatWithDots(convertVndToJpy(rawVnd).toString()));
                        } else {
                          setProdPriceJpy('');
                        }
                      }}
                      className="input-field" 
                      placeholder="Ví dụ: 4.500.000"
                      required
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      Nhập đến đâu tự động thêm dấu "." và tính quy đổi sang Yên (JPY)
                    </span>
                  </div>

                  <div>
                    <label className="label" style={{ color: 'var(--primary)' }}>Nhập bằng Yên (JPY)</label>
                    <input 
                      type="text" 
                      value={prodPriceJpy}
                      onChange={(e) => {
                        const formatted = formatWithDots(e.target.value);
                        setProdPriceJpy(formatted);
                        const rawJpy = parseInt(formatted.replace(/\D/g, ''), 10);
                        if (!isNaN(rawJpy) && rawJpy > 0) {
                          setProdPrice(formatWithDots(convertJpyToVnd(rawJpy).toString()));
                        } else {
                          setProdPrice('');
                        }
                      }}
                      className="input-field" 
                      placeholder="Ví dụ: 6.500"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      Nhập Yên sẽ tự động quy đổi sang VND (1 JPY = 160 VND)
                    </span>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div>
                    <label className="label">Hình ảnh sản phẩm chính *</label>
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
                      position: 'relative',
                      height: '140px',
                      justifyContent: 'center'
                    }}>
                      {imagePreview ? (
                        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img src={imagePreview} alt="Xem trước" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={handleClearImage}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
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
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Chọn ảnh chính</span>
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

                  <div>
                    <label className="label">Hình ảnh phụ (Có thể chọn nhiều)</label>
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
                      position: 'relative',
                      height: '140px',
                      justifyContent: 'center'
                    }}>
                      <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Chọn nhiều ảnh phụ</span>
                      </div>
                      <input 
                        type="file" 
                        multiple
                        accept="image/*"
                        onChange={handleSubImagesChange}
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
                    </div>
                  </div>
                </div>

                {subImagePreviews.length > 0 && (
                  <div>
                    <label className="label">Danh sách ảnh phụ chuẩn bị tải lên ({subImagePreviews.length})</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', backgroundColor: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      {subImagePreviews.map((preview, index) => (
                        <div key={index} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                          <img src={preview} alt={`Sub Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={() => handleClearSubImage(index)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              backgroundColor: 'rgba(239, 68, 68, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

          {/* TAB 4: ACCOUNT MANAGEMENT */}
          {activeTab === 'accounts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Quản lý Tài khoản ({profiles.length})</h3>
                <button 
                  onClick={fetchProfiles} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
                  title="Làm mới tài khoản"
                >
                  <RefreshCcw size={12} /> Làm mới
                </button>
              </div>

              {fetchingProfiles ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <span className="loading-spinner" style={{ width: '32px', height: '32px' }}></span>
                  <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Đang tải danh sách tài khoản...</p>
                </div>
              ) : profiles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.95rem' }}>Chưa có tài khoản nào trong hệ thống.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-input)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>TÀI KHOẢN</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>EMAIL</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>VAI TRÒ</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>CẬP NHẬT CUỐI</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map(profile => (
                        <tr key={profile.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: profile.role === 'admin' ? 'var(--primary)' : 'var(--bg-input)',
                                color: profile.role === 'admin' ? 'var(--text-on-primary)' : 'var(--text-primary)',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--border-color)'
                              }}>
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span style={{ fontWeight: 600 }}>{profile.name || 'Khách hàng'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{profile.email || 'N/A'}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`badge ${profile.role === 'admin' ? 'badge-yellow' : ''}`} style={{ 
                              fontSize: '0.7rem',
                              backgroundColor: profile.role === 'admin' ? 'var(--primary-glow)' : 'var(--bg-input)',
                              color: profile.role === 'admin' ? 'var(--primary)' : 'var(--text-secondary)'
                            }}>
                              {profile.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                            {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Chưa cập nhật'}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                            <select
                              value={profile.role}
                              onChange={(e) => handleUpdateRole(profile.id, e.target.value as any)}
                              className="input-field"
                              style={{ width: '130px', height: '32px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                              disabled={currentUser?.id === profile.id}
                            >
                              <option value="user">Khách hàng</option>
                              <option value="admin">Quản trị viên</option>
                            </select>
                            <button
                              onClick={() => handleDeleteProfile(profile.id, profile.name)}
                              disabled={currentUser?.id === profile.id}
                              style={{
                                padding: '6px',
                                color: '#ef4444',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                transition: 'background var(--transition-fast)'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              title="Xóa tài khoản"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
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
            maxWidth: '750px',
            width: '100%',
            margin: '40px auto',
            padding: '32px',
            boxShadow: 'var(--shadow-xl)',
            border: '1.5px solid var(--primary)',
            background: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>
                <Edit size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Chỉnh sửa: <span style={{ color: 'var(--primary)' }}>{editingProduct.name}</span>
                </span>
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
                  <label className="label">Giá sản phẩm (VND) *</label>
                  <input 
                    type="text" 
                    value={editPrice}
                    onChange={(e) => {
                      const formatted = formatWithDots(e.target.value);
                      setEditPrice(formatted);
                      const rawVnd = parseInt(formatted.replace(/\D/g, ''), 10);
                      if (!isNaN(rawVnd) && rawVnd > 0) {
                        setEditPriceJpy(formatWithDots(convertVndToJpy(rawVnd).toString()));
                      } else {
                        setEditPriceJpy('');
                      }
                    }}
                    className="input-field" 
                    placeholder="Ví dụ: 4.500.000"
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Nhập đến đâu tự động thêm dấu "." và tính quy đổi sang Yên (JPY)
                  </span>
                </div>

                <div>
                  <label className="label" style={{ color: 'var(--primary)' }}>Nhập bằng Yên (JPY)</label>
                  <input 
                    type="text" 
                    value={editPriceJpy}
                    onChange={(e) => {
                      const formatted = formatWithDots(e.target.value);
                      setEditPriceJpy(formatted);
                      const rawJpy = parseInt(formatted.replace(/\D/g, ''), 10);
                      if (!isNaN(rawJpy) && rawJpy > 0) {
                        setEditPrice(formatWithDots(convertJpyToVnd(rawJpy).toString()));
                      } else {
                        setEditPrice('');
                      }
                    }}
                    className="input-field" 
                    placeholder="Ví dụ: 6.500"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Nhập Yên sẽ tự động quy đổi sang VND (1 JPY = 160 VND)
                  </span>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="label">Hình ảnh chính (Để trống nếu giữ nguyên)</label>
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
                    position: 'relative',
                    height: '110px',
                    justifyContent: 'center'
                  }}>
                    {editImagePreview ? (
                      <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img src={editImagePreview} alt="Xem trước" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button"
                          onClick={handleClearEditImage}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Chọn ảnh chính mới</span>
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

                <div>
                  <label className="label">Tải lên thêm ảnh phụ mới</label>
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
                    position: 'relative',
                    height: '110px',
                    justifyContent: 'center'
                  }}>
                    <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Chọn các ảnh phụ mới</span>
                    </div>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handleEditSubImagesChange}
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
                  </div>
                </div>
              </div>

              {/* Display existing images & new previews */}
              {(existingImages.length > 0 || editSubImagePreviews.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {existingImages.length > 0 && (
                    <div>
                      <label className="label">Ảnh phụ hiện tại ({existingImages.length})</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        {existingImages.map((imgUrl, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '55px', height: '55px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                            <img src={imgUrl} alt={`Existing ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button 
                              type="button"
                              onClick={() => handleRemoveExistingImage(imgUrl)}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                              }}
                              title="Xóa ảnh này"
                            >
                              <X size={8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editSubImagePreviews.length > 0 && (
                    <div>
                      <label className="label">Ảnh phụ mới chuẩn bị tải lên ({editSubImagePreviews.length})</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        {editSubImagePreviews.map((preview, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '55px', height: '55px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                            <img src={preview} alt={`New Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button 
                              type="button"
                              onClick={() => handleClearEditSubImage(idx)}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <X size={8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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

      {/* Order Details Modal Popup */}
      {viewingOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px',
          backdropFilter: 'blur(6px)'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CHI TIẾT ĐƠN HÀNG</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{viewingOrder.id}</h3>
              </div>
              <button 
                onClick={() => setViewingOrder(null)} 
                style={{ padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
              textAlign: 'left'
            }}>
              {/* Left Column: Customer & Shipping Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Thông tin khách hàng
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    <div><strong>Họ và tên:</strong> {viewingOrder.shipping?.name || viewingOrder.shipping?.fullName || (profiles.find(p => p.id === viewingOrder.user_id)?.name) || 'Khách hàng ẩn danh'}</div>
                    <div><strong>Số điện thoại:</strong> {viewingOrder.shipping?.phone || 'N/A'}</div>
                    <div><strong>Email:</strong> {viewingOrder.shipping?.email || 'N/A'}</div>
                    <div><strong>Địa chỉ:</strong> {viewingOrder.shipping?.address || 'N/A'}</div>
                    <div><strong>Thành phố:</strong> {viewingOrder.shipping?.city || 'N/A'}</div>
                    <div><strong>Hình thức thanh toán:</strong> {viewingOrder.shipping?.paymentMethod === 'cod' ? 'Thanh toán tiền mặt (COD)' : viewingOrder.shipping?.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Thẻ quốc tế'}</div>
                  </div>
                </div>

                {viewingOrder.shipping?.note && (
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Ghi chú đơn hàng
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: '6px' }}>
                      "{viewingOrder.shipping?.note}"
                    </p>
                  </div>
                )}

              </div>

              {/* Right Column: Ordered Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Sản phẩm đã mua
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                  {viewingOrder.items && viewingOrder.items.length > 0 ? (
                    viewingOrder.items.map(item => (
                      <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'normal', wordBreak: 'break-word' }} title={item.product.name}>
                            {item.product.name}
                          </h5>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {item.quantity} x {formatPrice(item.product.price)}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Không có chi tiết sản phẩm</div>
                  )}
                </div>

                {/* Subtotals & Final sum */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tạm tính</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {formatPrice(viewingOrder.items ? viewingOrder.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) : viewingOrder.total)}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Vận chuyển</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {viewingOrder.items && viewingOrder.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) > 2000000 ? 'Miễn phí' : formatPrice(30000)}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
                    <span>Tổng thanh toán</span>
                    <span style={{ color: 'var(--primary)' }}>{formatPrice(viewingOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions & Status Transition */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              marginTop: '24px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Chuyển đổi trạng thái đơn hàng
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select
                    value={viewingOrder.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      updateOrderStatus(viewingOrder.id, newStatus);
                      setViewingOrder(prev => prev ? { ...prev, status: newStatus } : null);
                    }}
                    className="input-field"
                    style={{ width: '160px', height: '40px', padding: '0 12px', fontSize: '0.85rem' }}
                  >
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                  </select>
                  <span className={`badge`} style={{
                    fontSize: '0.75rem',
                    height: '24px',
                    backgroundColor: viewingOrder.status === 'delivered' ? '#10b981' : viewingOrder.status === 'shipped' ? '#3b82f6' : 'rgba(234,179,8,0.2)',
                    color: viewingOrder.status === 'delivered' || viewingOrder.status === 'shipped' ? '#fff' : 'var(--primary)'
                  }}>
                    {viewingOrder.status === 'delivered' ? 'Đã giao' : viewingOrder.status === 'shipped' ? 'Đang giao' : 'Đang xử lý'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setViewingOrder(null)} 
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontWeight: 700, height: '40px' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
