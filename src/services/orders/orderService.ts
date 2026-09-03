import { CartItem, ShippingAddress, PaymentMethod, Order, CouponValidationResult } from '../../types';
import { APP_CONFIG } from '../../constants/config';

export class OrderService {
  private orders: Order[] = [
    {
      id: 'OUBD-89210',
      items: [
        {
          id: 'mock-item-1',
          product: {
            id: '8627094552655',
            title: 'MENS DENIM PANT-WASH 2',
            handle: 'mens-denim-joggers-wash-indigo',
            category: 'PANTS',
            price: 1499,
            compareAtPrice: 1950,
            images: [
              'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/MPfGeKmqbGOSFnYXG8BzPZ2u4EKHw64dWMLAJtZb.webp?v=1778559091',
            ],
            sizes: ['30', '32', '34'],
            colors: ['INDIGO'],
            tags: ['Denim Joggers'],
            description: "Men's Stretch Denim Joggers – Classic Denim Look with All-Day Comfort.",
            available: true,
            rating: 4.8,
            reviewCount: 28,
          },
          selectedSize: '32',
          selectedColor: 'INDIGO',
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: 'Abdullah Al-Mamun',
        phone: '01901165090',
        address: 'House 12, Road 4, Sector 3, Uttara',
        city: 'Dhaka',
        zone: 'inside_dhaka',
      },
      paymentMethod: 'cod',
      subtotal: 1499,
      deliveryFee: 70,
      discount: 0,
      total: 1569,
      status: 'delivered',
      createdAt: '2026-08-20T14:32:00Z',
      estimatedDelivery: 'Delivered on 22 August 2026',
    },
    {
      id: 'OUBD-91450',
      items: [
        {
          id: 'mock-item-2',
          product: {
            id: '8627094552656',
            title: 'CLASSIC JUMMAH PANJABI - WHITE',
            handle: 'classic-jummah-panjabi-white',
            category: 'PANJABI',
            price: 1850,
            compareAtPrice: 2200,
            images: [
              'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/Banner_v2_2_3f7dbbed-1222-4aa7-a98b-da88de5f7e50.png?v=1778678354',
            ],
            sizes: ['40', '42', '44'],
            colors: ['WHITE'],
            tags: ['Punjabi'],
            description: 'Premium Cotton Classic Panjabi tailored for Friday prayer and festive dignity.',
            available: true,
            rating: 4.9,
            reviewCount: 42,
          },
          selectedSize: '42',
          selectedColor: 'WHITE',
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: 'Abdullah Al-Mamun',
        phone: '01901165090',
        address: 'House 12, Road 4, Sector 3, Uttara',
        city: 'Dhaka',
        zone: 'inside_dhaka',
      },
      paymentMethod: 'bkash',
      subtotal: 1850,
      deliveryFee: 70,
      discount: 185,
      total: 1735,
      couponCode: 'OUBD10',
      status: 'processing',
      createdAt: '2026-09-02T10:15:00Z',
      estimatedDelivery: 'Estimated 05 September 2026',
    },
  ];

  validateCoupon(code: string, subtotal: number): CouponValidationResult {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return { valid: false, message: 'Please enter a coupon code.' };
    }

    if (clean === 'OUBD10') {
      const discount = Math.round(subtotal * 0.1);
      return {
        valid: true,
        discountPercent: 10,
        discountAmount: discount,
        message: '10% discount applied!',
      };
    }

    if (clean === 'EID2026') {
      const discount = Math.round(subtotal * 0.15);
      return {
        valid: true,
        discountPercent: 15,
        discountAmount: discount,
        message: 'Eid Special 15% discount applied!',
      };
    }

    if (clean === 'FIRSTORDER') {
      return {
        valid: true,
        discountAmount: 100,
        message: '৳100 Welcome discount applied!',
      };
    }

    return {
      valid: false,
      message: 'Invalid promo code. Try OUBD10 or EID2026.',
    };
  }

  async createOrder(data: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    couponCode?: string;
  }): Promise<Order> {
    const subtotal = data.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const deliveryFee =
      subtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD
        ? 0
        : data.shippingAddress.zone === 'inside_dhaka'
        ? APP_CONFIG.DELIVERY_FEE_INSIDE_DHAKA
        : APP_CONFIG.DELIVERY_FEE_OUTSIDE_DHAKA;

    let discount = 0;
    if (data.couponCode) {
      const val = this.validateCoupon(data.couponCode, subtotal);
      if (val.valid && val.discountAmount) {
        discount = val.discountAmount;
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);
    const id = `OUBD-${Math.floor(10000 + Math.random() * 90000)}`;

    const deliveryDays = data.shippingAddress.zone === 'inside_dhaka' ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);

    const newOrder: Order = {
      id,
      items: data.items,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      total,
      couponCode: data.couponCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: `Estimated Delivery: ${estDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`,
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) || null;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }
}

export const orderService = new OrderService();
