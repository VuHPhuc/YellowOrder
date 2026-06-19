import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: string;
  description: string;
  image: string;
  specs: Record<string, string>;
  features: string[];
  stock: number;
  isFeatured?: boolean;
  isNsfw?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shipping: any;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
}

interface StoreContextType {
  products: Product[];
  filteredProducts: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  
  // NSFW Filter states
  showNsfw: boolean;
  setShowNsfw: (show: boolean) => void;

  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  
  activeView: 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'login' | 'success' | 'account' | 'admin';
  setActiveView: (view: 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'login' | 'success' | 'account' | 'admin') => void;
  
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  placeOrder: (shippingDetails: any) => Promise<string>;
  lastOrder: Order | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Admin functions
  refreshProducts: () => Promise<void>;
  allOrders: Order[];
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: 'processing' | 'shipped' | 'delivered') => Promise<void>;
  addProduct: (
    productData: {
      name: string;
      price: number;
      category: string;
      description: string;
      specs: Record<string, string>;
      features: string[];
      stock: number;
      isFeatured: boolean;
      isNsfw: boolean;
    },
    imageFile?: File
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Local mock products database as fallback
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'YellowOrder Apex Pro Wireless Headset',
    price: 189.99,
    rating: 4.8,
    reviewsCount: 124,
    category: 'Audio',
    description: 'Experience pure sonic perfection. The Apex Pro combines signature sound design with customized active noise-cancellation and a beautiful minimalist golden-yellow matte finish.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Driver Size': '40mm Neodymium',
      'Battery Life': 'Up to 45 Hours',
      'Connectivity': 'Bluetooth 5.2 / 2.4GHz Wireless',
      'Weight': '260g'
    },
    features: ['Active Noise Cancellation (ANC)', 'High-Resolution Audio certified', 'Memory foam earcups', 'Signature Yellow LED indicator'],
    stock: 12,
    isFeatured: true,
    isNsfw: false
  },
  {
    id: 'prod-2',
    name: 'YellowOrder Stealth Blade Keyboard',
    price: 149.50,
    rating: 4.7,
    reviewsCount: 88,
    category: 'Keyboards',
    description: 'A custom mechanical keyboard built for typing purists and competitive gamers. Featuring hot-swappable yellow linear switches and a heavy CNC anodized aluminum shell.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Switch Type': 'Yellow Linear Switches (Lubed)',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Layout': '75% Compact Layout',
      'Backlight': 'Per-key Amber Yellow LED'
    },
    features: ['Hot-swappable PCB', 'Sound dampening silicone pads', 'Detachable coiled USB-C cable', 'Aluminum rotary knob'],
    stock: 8,
    isFeatured: true,
    isNsfw: false
  },
  {
    id: 'prod-3',
    name: 'YellowOrder Chrono Watch 4',
    price: 299.00,
    rating: 4.9,
    reviewsCount: 204,
    category: 'Wearables',
    description: 'The ultimate wearable companion designed to elevate your daily routine. Features an always-on AMOLED display with real-time biometric metrics and GPS tracking.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Display': '1.43" AMOLED Always-on',
      'Water Resistance': '5ATM (up to 50m)',
      'Sensors': 'Optical Heart Rate, SpO2, Accelerometer',
      'Strap Material': 'Fluoroelastomer Yellow Sport Band'
    },
    features: ['14-day battery life', 'Real-time workout coaching', 'Contactless payments', 'Sleep tracking & analysis'],
    stock: 15,
    isFeatured: true,
    isNsfw: false
  },
  {
    id: 'prod-4',
    name: 'YellowOrder Nomad Pack 24L',
    price: 119.00,
    rating: 4.6,
    reviewsCount: 65,
    category: 'Travel',
    description: 'Weatherproof premium commuter backpack designed to protect your work essentials. Features an ergonomic suspension layout and quick-access utility dividers.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Capacity': '24 Liters',
      'Material': '900D Ballistic Cordura',
      'Laptop Pocket': 'Fits up to 16" MacBook Pro',
      'Dimensions': '48 x 30 x 18 cm'
    },
    features: ['Water-resistant YKK zippers', 'Hidden passport/wallet pocket', 'Magnetic sternum strap buckle', 'Luggage pass-through'],
    stock: 22,
    isNsfw: false
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('yelloworder_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<StoreContextType['activeView']>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(() => {
    const savedOrder = localStorage.getItem('yelloworder_last_order');
    return savedOrder ? JSON.parse(savedOrder) : null;
  });
  
  // Search, Filter and Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [showNsfw, setShowNsfw] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('yelloworder_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'dark';
  });

  // Fetch Products dynamically from Supabase database
  const refreshProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Lỗi tải sản phẩm từ database:', error.message);
        setProducts(FALLBACK_PRODUCTS);
      } else if (data && data.length > 0) {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price),
          rating: parseFloat(p.rating || 5.0),
          reviewsCount: p.reviews_count || 0,
          category: p.category,
          description: p.description || '',
          image: p.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
          specs: p.specs || {},
          features: p.features || [],
          stock: p.stock || 0,
          isFeatured: p.is_featured,
          isNsfw: p.is_nsfw
        }));
        setProducts(mapped);
      } else {
        // If DB table is initialized but empty, show fallback mock data
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      console.error('Lỗi kết nối khi tải sản phẩm:', err);
      setProducts(FALLBACK_PRODUCTS);
    }
  };

  // Auth session sync trigger
  useEffect(() => {
    const syncUser = async (session: any) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || 'Khách hàng',
              role: (profile.role as 'admin' | 'user') || 'user'
            });
          } else {
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'Khách hàng',
              role: 'user'
            });
          }
        } catch (err) {
          console.error('Lỗi khi đồng bộ profile:', err);
        }
      } else {
        setCurrentUser(null);
      }
    };

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session);
    });

    // 3. Load products initially
    refreshProducts();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch all orders for administrator dashboard view
  const fetchAllOrders = async () => {
    if (currentUser?.role !== 'admin') return;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Lỗi tải danh sách đơn hàng:', error.message);
        return;
      }

      if (data) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          items: [], // detail items can be expanded, but we display checkout totals for simplicity
          total: parseFloat(o.total),
          shipping: o.shipping_details,
          date: new Date(o.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: o.status
        }));
        setAllOrders(mappedOrders);
      }
    } catch (err) {
      console.error('Lỗi kết nối khi tải đơn hàng:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'processing' | 'shipped' | 'delivered') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Lỗi cập nhật đơn hàng:', error.message);
        return;
      }

      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (lastOrder?.id === orderId) {
        setLastOrder(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Lỗi kết nối khi cập nhật đơn hàng:', err);
    }
  };

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
    localStorage.setItem('yelloworder_theme', theme);
  }, [theme]);

  // Sync cart
  useEffect(() => {
    localStorage.setItem('yelloworder_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveView('home');
  };

  const addProduct = async (
    productData: {
      name: string;
      price: number;
      category: string;
      description: string;
      specs: Record<string, string>;
      features: string[];
      stock: number;
      isFeatured: boolean;
      isNsfw: boolean;
    },
    imageFile?: File
  ) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          return { success: false, error: 'Lỗi tải ảnh lên Storage: ' + uploadError.message };
        }

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          price: productData.price,
          category: productData.category,
          description: productData.description,
          image_url: imageUrl || undefined,
          specs: productData.specs,
          features: productData.features,
          stock: productData.stock,
          is_featured: productData.isFeatured,
          is_nsfw: productData.isNsfw,
          created_by: currentUser?.id
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      await refreshProducts();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi không xác định khi tạo sản phẩm' };
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      if (productId.startsWith('prod-')) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        return { success: true };
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        return { success: false, error: error.message };
      }

      await refreshProducts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi không xác định khi xóa sản phẩm' };
    }
  };

  const placeOrder = async (shippingDetails: any) => {
    const orderId = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
    const shippingFee = cartTotal > 200 ? 0 : 15.00;
    const orderTotal = cartTotal + shippingFee;
    
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: orderTotal,
      shipping: shippingDetails,
      date: new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'processing'
    };
    
    setLastOrder(newOrder);
    localStorage.setItem('yelloworder_last_order', JSON.stringify(newOrder));

    // Save order database logs if authenticated
    if (currentUser?.id) {
      try {
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            id: orderId,
            user_id: currentUser.id,
            total: orderTotal,
            shipping_details: shippingDetails,
            status: 'processing'
          });

        if (orderError) {
          console.error('Lỗi khi ghi database đơn hàng:', orderError.message);
        } else {
          // Log items
          const itemsToInsert = cart.map(item => ({
            order_id: orderId,
            product_id: item.product.id.startsWith('prod-') ? null : item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

          if (itemsError) {
            console.error('Lỗi khi ghi chi tiết đơn hàng:', itemsError.message);
          }
        }
      } catch (err) {
        console.error('Lỗi kết nối khi đặt hàng lên Supabase:', err);
      }
    }

    clearCart();
    setActiveView('success');
    return orderId;
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Compute filtered and sorted products
  const filteredProducts = products.filter(product => {
    // NSFW Filtering: if showNsfw is false, hide isNsfw products
    if (!showNsfw && product.isNsfw) {
      return false;
    }

    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <StoreContext.Provider value={{
      products,
      filteredProducts,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      priceRange,
      setPriceRange,
      sortBy,
      setSortBy,
      
      showNsfw,
      setShowNsfw,

      currentUser,
      login,
      signUp,
      logout,
      activeView,
      setActiveView,
      selectedProduct,
      setSelectedProduct,
      placeOrder,
      lastOrder,
      theme,
      toggleTheme,
      
      refreshProducts,
      allOrders,
      fetchAllOrders,
      updateOrderStatus,
      addProduct,
      deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
