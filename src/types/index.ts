export interface Product {
  id: string;
  title: string;
  handle: string;
  category: string;
  subCategory?: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  description: string;
  available: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  sku?: string;
  fabric?: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  productCount: number;
  image?: string;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique composite: `${product.id}-${size}-${color}`
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zone: DeliveryZone;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  savedAddresses?: ShippingAddress[];
}

export interface Showroom {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  businessHours: string;
  isGrandOpening?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  targetCategory?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  message: string;
}
