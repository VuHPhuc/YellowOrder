import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
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
  
  currentUser: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  
  activeView: 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'login' | 'success' | 'account';
  setActiveView: (view: 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'login' | 'success' | 'account') => void;
  
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  placeOrder: (shippingDetails: any) => string;
  lastOrder: Order | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// High-quality mock product data
const MOCK_PRODUCTS: Product[] = [
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
    isFeatured: true
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
    isFeatured: true
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
    isFeatured: true
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
    stock: 22
  },
  {
    id: 'prod-5',
    name: 'YellowOrder Horizon Curved Monitor',
    price: 459.99,
    rating: 4.8,
    reviewsCount: 42,
    category: 'Monitors',
    description: 'Immerse yourself in stunning visual clarity. The Horizon curved display offers ultrawide viewing angles with true color calibration for content creators.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Panel Size': '34" Curved (1500R Curve)',
      'Resolution': '3440 x 1440 WQHD',
      'Refresh Rate': '165Hz',
      'Color Gamut': '99% DCI-P3'
    },
    features: ['VESA DisplayHDR 400', 'AMD FreeSync Premium Pro', 'Built-in KVM Switch', 'Eye-care filter technology'],
    stock: 5
  },
  {
    id: 'prod-6',
    name: 'YellowOrder Ember Ceramic Mug',
    price: 45.00,
    rating: 4.5,
    reviewsCount: 112,
    category: 'Lifestyle',
    description: 'Keep your coffee or tea at the absolute perfect temperature from the first sip to the last. Controlled wirelessly through our intuitive companion widget.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Capacity': '12 oz (355ml)',
      'Material': 'Double-walled Stainless Steel / Ceramic coating',
      'Temperature Range': '50°C - 62.5°C',
      'Charging Stand': 'Coaster induction base'
    },
    features: ['80-minute standalone battery life', 'Customizable LED halo color', 'Auto-sleep smart sensors', 'Dishwasher safe body'],
    stock: 40
  },
  {
    id: 'prod-7',
    name: 'YellowOrder Core Charging Dock',
    price: 79.99,
    rating: 4.6,
    reviewsCount: 78,
    category: 'Lifestyle',
    description: 'Declutter your workspace with this 3-in-1 magnetic wireless charging stand. Beautifully wrapped in genuine leather with weighted steel construction.',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Wireless Output': '15W Fast Charge (MagSafe compatible)',
      'Ports': 'USB-C input, USB-A output',
      'Materials': 'Premium Leather, Aircraft Grade Aluminum',
      'Weight': '420g'
    },
    features: ['Charges Phone, Watch, and Earbuds simultaneously', 'Over-current protection chips', 'Non-slip weighted rubber feet', 'Sleek ambient status light'],
    stock: 30
  },
  {
    id: 'prod-8',
    name: 'YellowOrder Pro Desk Pad',
    price: 39.00,
    rating: 4.7,
    reviewsCount: 154,
    category: 'Lifestyle',
    description: 'Protect your desktop and add warmth with this beautiful desk felt mat. Handcrafted with sustainably sourced wool and cork backing to prevent sliding.',
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778bd364?w=800&auto=format&fit=crop&q=60',
    specs: {
      'Dimensions': '90 x 30 cm',
      'Thickness': '4mm',
      'Material': '80% Merino Wool, 20% Cork',
      'Color': 'Charcoal Dark Grey'
    },
    features: ['Naturally stain-resistant', 'Soft cushioning for wrists', 'Laser-cut precise edges', 'Eco-friendly biodegradable materials'],
    stock: 50
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('yelloworder_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('yelloworder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('yelloworder_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    // Default to dark theme for premium vibes
    return 'dark';
  });

  // Apply theme to document root
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

  // Save cart to localstorage
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

  const login = (email: string, name: string) => {
    const user = { email, name };
    setCurrentUser(user);
    localStorage.setItem('yelloworder_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('yelloworder_user');
    setActiveView('home');
  };

  const placeOrder = (shippingDetails: any) => {
    const orderId = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
    const orderTotal = cartTotal + 15.00; // Mock delivery fee/tax
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
    clearCart();
    setActiveView('success');
    return orderId;
  };

  // Derive cart counts and totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Compute filtered and sorted products
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
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
    // Default featured sort
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <StoreContext.Provider value={{
      products: MOCK_PRODUCTS,
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
      currentUser,
      login,
      logout,
      activeView,
      setActiveView,
      selectedProduct,
      setSelectedProduct,
      placeOrder,
      lastOrder,
      theme,
      toggleTheme
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
