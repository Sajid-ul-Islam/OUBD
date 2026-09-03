import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem, DeliveryZone, User, Order, CouponValidationResult } from '../types';
import { orderService } from '../services/orders/orderService';
import { authService } from '../services/auth/authService';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Delivery & Coupon
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  deliveryFee: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => CouponValidationResult;
  removeCoupon: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;

  // AI Shopping Assistant Modal
  isAIChatOpen: boolean;
  openAIChat: () => void;
  closeAIChat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: '@oubd_cart',
  WISHLIST: '@oubd_wishlist',
  USER: '@oubd_user',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUserState] = useState<User | null>(null);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  // Load initial persistent state
  useEffect(() => {
    (async () => {
      try {
        const [savedCart, savedWishlist, savedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CART),
          AsyncStorage.getItem(STORAGE_KEYS.WISHLIST),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
        ]);

        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedUser) setUserState(JSON.parse(savedUser));
      } catch {
        // Fallback gracefully if storage fails
      }

      const initialOrders = await orderService.getOrders();
      setOrders(initialOrders);
    })();
  }, []);

  // Sync Cart to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)).catch(() => {});
  }, [cart]);

  // Sync Wishlist to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist)).catch(() => {});
  }, [wishlist]);

  // Sync User to AsyncStorage
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser)).catch(() => {});
    } else {
      AsyncStorage.removeItem(STORAGE_KEYS.USER).catch(() => {});
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const addToCart = (
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ) => {
    const selectedSize = size || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const selectedColor = color || (product.colors.length > 0 ? product.colors[0] : 'Default');
    const itemId = `${product.id}-${selectedSize}-${selectedColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize,
          selectedColor,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const deliveryFee =
    cartSubtotal >= 3000
      ? 0
      : deliveryZone === 'inside_dhaka'
      ? 70
      : 130;

  const applyCoupon = (code: string): CouponValidationResult => {
    const result = orderService.validateCoupon(code, cartSubtotal);
    if (result.valid && result.discountAmount) {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(result.discountAmount);
    }
    return result;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

  const refreshOrders = async () => {
    const fresh = await orderService.getOrders();
    setOrders(fresh);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryZone,
        setDeliveryZone,
        deliveryFee,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        isAuthenticated: !!user,
        setUser,
        logout,
        orders,
        refreshOrders,
        isAIChatOpen,
        openAIChat: () => setIsAIChatOpen(true),
        closeAIChat: () => setIsAIChatOpen(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
