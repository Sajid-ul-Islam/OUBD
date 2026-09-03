# Website Feature Inventory & Mobile UX Transformation Matrix

This inventory maps all customer-facing features observed on the [One Ummah BD](https://oneummahbd.shop/) web storefront to their native mobile equivalents, defining development priority, prototype status, and backend integration requirements.

## 1. Feature Comparison Matrix

| Website Feature | Mobile Equivalent | Priority | Prototype Status | Backend Dependency | Notes |
|---|---|---|---|---|---|
| **Top Announcement Ticker** ("Buy 5 for 1399 Tk") | Animated Dismissible Hero Banner & Ticker | High | Implemented | Mock / Remote Config | Crucial conversion driver for economy bundles |
| **Sticky Navigation Bar** (Logo, Search, Cart) | Native Header with Logo, Global Search & Cart Badge | High | Implemented | No | Native touch feedback, safe area padding |
| **Hero Image Sliders** | Smooth Carousel with Dot Indicators | High | Implemented | Pluggable Service | Auto-scrolls with swipe gesture support |
| **Product Grid (2/4 Columns)** | 2-Column Responsive `FlatList` with Card Elevation | High | Implemented | Pluggable Service | Image aspect ratio 1:1, discount tag, rating |
| **Multi-level Dropdown Menu** (Mens, Acc, Series) | Dedicated Bottom Tab "Categories" & Accordion | High | Implemented | Pluggable Service | Clean visual hierarchy without bulky menus |
| **Live Predictive Search** | Search Screen with Instant Filter & Recent Tags | High | Implemented | Pluggable Service | Instant filtering by title, tag, category |
| **Product Detail Page (PDP)** | Native Screen with Multi-Image Pager, Size/Color Chips | High | Implemented | Pluggable Service | Sticky "Add to Cart" and "Buy Now" CTA |
| **Variant Selection (Size / Color)** | Horizontal Tap Pills with Stock Availability | High | Implemented | Pluggable Service | Highlights selected size/color with error validation |
| **Slide-over Cart Drawer** | Full Cart Screen + Bottom Bar with Quantity Steppers | High | Implemented | Local State + Storage | Real-time calculation of subtotal & shipping fee |
| **Delivery Zone Shipping Fee** (Inside Dhaka vs Outside) | Radio Selector for Zone (৳70 Dhaka / ৳130 Outside) | High | Implemented | Mock Rules / API | Updates order total dynamically |
| **Cash on Delivery (COD)** | Primary Checkout Payment Option | High | Implemented | Orders API | Pre-selected by default for Bangladesh market |
| **bKash / Nagad Mobile Banking** | MFS Payment Gateway Modal Mockup | High | Implemented | Payment Gateway | Simulates MFS PIN/OTP flow for demo |
| **Customer Order History** | "My Orders" in Account tab with Status Badges | High | Implemented | Orders API | Shows Pending, Processing, Shipped, Delivered |
| **Showroom Locator** | Interactive Store Locator with Direct Dial & Map Links | High | Implemented | Static / Geo API | All 15+ real showrooms across Bangladesh |
| **Customer Wishlist** | Wishlist Tab with Heart Toggle & 1-tap Move to Cart | High | Implemented | Local Storage / API | Allows saving favorites across app sessions |
| **Google & Facebook Sign-In** | One-Tap OAuth Login UX | High | Implemented | Firebase / Supabase | Demonstrates seamless customer onboarding |
| **Phone OTP Verification** | +880 Phone Input with 4-Digit OTP & Resend Timer | High | Implemented | SMS Gateway (e.g. SSL) | Crucial standard for Bangladeshi ecommerce |
| **Admin Role & Management** | Hidden Role-Guarded Admin Dashboard | High | Implemented | Auth RBAC / Admin API | View sales analytics, orders, catalog state |
| **AI Shopping Assistant** | Interactive In-App Bot ("Ummah Bot") | Medium | Implemented | AI / Rule Engine | Recommends sizes, collections, and prayer gear |
| **WhatsApp Customer Support** | Direct Deep Link to WhatsApp Chat (+8801901165090) | High | Implemented | Linking API | Direct launch into official WhatsApp business chat |
| **Size Guide Modal** | In-app measurement table modal | Medium | Implemented | Static Content | Chest, length, and shoulder specifications |
| **Customer Reviews & Ratings** | Star rating display + Review submission form | Medium | Implemented | Reviews Service | Highlights social proof on PDP |
| **Coupon / Voucher Codes** | Discount input with instant validation | High | Implemented | Promotion Service | Supports promo codes like `OUBD10`, `EID2026` |

---

## 2. Key Mobile-First Transformations

1. **One-Handed Navigation**:
   - Replaced complex desktop hover navigation with a standard 5-tab bottom navigation bar (`Home`, `Categories`, `Wishlist`, `Cart`, `Account`).
2. **Simplified Checkout Friction**:
   - Web stores require multi-page Shopify checkouts; the mobile app consolidates shipping details, delivery zone toggle, and payment choice onto a single focused screen.
3. **Showroom Integration**:
   - Customers can tap a phone button on any showroom card to immediately initiate a cellular phone call to the store manager.
4. **Haptic & Visual Feedback**:
   - Smooth press states on cards, buttons, quantity steppers, and floating action buttons.
