# OUBD Mobile App — Technical Architecture

## 1. Architectural Philosophy & Separation of Concerns

The application is structured to decouple the presentation layer from the data and business logic layers. This guarantees that whether the production backend is powered by **Shopify Storefront API**, **WooCommerce REST**, **Laravel**, or a custom **Node.js GraphQL** service, the UI components, screens, and navigation structure remain unaffected.

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   (Expo Router Screens, Tabs, Modals, Shared UI Cards) │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                    State & Store Layer                 │
│    (React Context, Local Storage Hooks, Offline Cache) │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                  Service Abstraction Layer             │
│   (ProductService, AuthService, OrderService, etc.)    │
└───────────────────────────▲────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────┴───────────────┐               ┌───────┴───────────────┐
│     Mock Data Service │               │  Live Remote Backend  │
│  (Authentic Catalog,  │               │  (Shopify, WooCommerce│
│  Simulated Latency)   │               │   Laravel, REST / GQL)│
└───────────────────────┘               └───────────────────────┘
```

---

## 2. Directory Layout

The application adheres to the layout defined in `Goal.md`:

```
OUBD/
├── docs/                        # Complete technical and brand documentation
├── assets/                      # Brand logos, icons, splash images
├── src/
│   ├── app/                     # Expo Router file-based route definitions
│   │   ├── (tabs)/              # Persistent bottom tab navigation
│   │   │   ├── _layout.tsx      # Tab bar configuration & custom icons
│   │   │   ├── index.tsx        # Homepage (motion hero, categories, shoppable reels)
│   │   │   ├── categories.tsx   # Category browse screen
│   │   │   ├── ai-assistant.tsx # Dedicated AI shopping & customer support tab
│   │   │   ├── cart.tsx         # Cart items, coupon, delivery zone
│   │   │   └── account.tsx      # Customer portal, order history, showrooms
│   │   ├── product/[id].tsx     # Product Details Page (PDP)
│   │   ├── checkout.tsx         # Delivery details, payment method selection
│   │   ├── wishlist.tsx         # Standalone wishlist screen linked from header
│   │   ├── order-success.tsx    # Order confirmation & tracking summary
│   │   ├── store-locator.tsx    # Bangladesh physical showrooms
│   │   ├── search.tsx           # Instant keyword & category search
│   │   ├── auth/
│   │   │   └── login.tsx        # Google, Facebook, and Phone OTP authentication
│   │   ├── admin/
│   │   │   └── dashboard.tsx    # Role-gated admin control panel
│   │   └── _layout.tsx          # Root Stack layout, Translucent status bar & Startup intro
│   ├── components/              # Atomic, reusable design system components
│   │   ├── Header.tsx           # App header with logo, notification bell & wishlist
│   │   ├── NotificationModal.tsx# 3-tier notification center
│   │   ├── NotificationPermissionModal.tsx # Opt-in value permission dialog
│   │   ├── StartupAnimation.tsx # Brand launch animation overlay
│   │   ├── HeroMotionExperience.tsx # Motion hero section with ambient video loop
│   │   ├── ShoppableSocialSection.tsx # Stories, shoppable reels & social buttons
│   │   ├── CategoryShowcaseSection.tsx # Category cover photos & product carousels
│   │   ├── ProductCard.tsx      # Grid product card with wishlist & add actions
│   │   ├── BannerCarousel.tsx   # Auto-advancing promotional banners
│   │   ├── CategoryPills.tsx    # Horizontal filter selector
│   │   ├── ShowroomCard.tsx     # Store locator card with direct dialing
│   │   └── EmptyState.tsx       # Standard empty & error states
│   ├── constants/               # Colors, typography, spacing, theme tokens
│   ├── types/                   # TypeScript interfaces & domain models
│   ├── services/
│   │   ├── api/                 # Base API client and adapter interfaces
│   │   ├── auth/                # Authentication contracts & implementation
│   │   ├── products/            # Catalog, collections, search & filters
│   │   ├── orders/              # Checkout, coupon validation, order tracking
│   │   ├── social/              # Social media, shoppable reels & story contracts
│   │   └── mock/                # Authentic products extracted from live store
│   └── store/                   # Global state (Cart, Wishlist, User session)
```

---

## 3. Data Flow & Service Abstraction

### Interface Contracts
Services export clean TypeScript interfaces. For example:
- `IProductService`: `getProducts()`, `getProductById(id)`, `getCategories()`, `searchProducts(query, filters)`.
- `IAuthService`: `loginWithGoogle()`, `loginWithFacebook()`, `requestOTP(phone)`, `verifyOTP(phone, code)`, `logout()`, `getCurrentUser()`.
- `IOrderService`: `createOrder(orderData)`, `getOrderById(id)`, `getUserOrders(userId)`, `validateCoupon(code)`.

### Environment Toggle
A single environment variable `EXPO_PUBLIC_DATA_SOURCE` (`'mock'` | `'live'`) controls whether the app consumes the local offline mock adapter or connects directly to live endpoints.

---

## 4. State Management Strategy

1. **Cart & Wishlist State**:
   - Managed via React Context (`AppContext`) with persistent storage (`AsyncStorage`).
   - Automatically re-hydrated on app boot.
   - Optimistic updates for instant UI response when adding/removing items.
2. **User Authentication & Session**:
   - Token & User object stored in local secure storage abstraction.
   - Role attribute (`'customer'` | `'admin'`) determines access to administrative features.
3. **Checkout State Machine**:
   - Step 1: Shipping Address & Recipient Info.
   - Step 2: Delivery Zone (Dhaka ৳70 vs Outside Dhaka ৳130).
   - Step 3: Payment Method (COD, bKash, Nagad).
   - Step 4: Submission & Order Confirmation.
