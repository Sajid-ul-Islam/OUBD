# OUBD Mobile App — Feature Gap Analysis

A rigorous comparison between the existing [oneummahbd.shop](https://oneummahbd.shop/) web storefront and the native Android mobile prototype.

## 1. Feature Coverage Matrix

| Feature Domain | Web Storefront Feature | Mobile Prototype Feature | Status | Gap / Opportunity |
|---|---|---|---|---|
| **Catalog Discovery** | Multi-level dropdowns, banner sliders | Bottom navigation, horizontal series pills, fast search | 100% Covered | Mobile adds instant tactile category switching and quick search suggestions |
| **Product Browsing** | Grid layout with hover effects | 2-column touch-optimized cards, quick add, wishlist toggle | 100% Covered | Mobile provides dedicated wishlist heart button and instant badge |
| **Product Details** | Shopify image slider, description tabs | Native multi-image pager, size/color selectors, delivery notes | 100% Covered | Mobile integrates direct stock availability per variant |
| **Promotions** | Announcement bar ("Buy 5 for 1399 Tk") | Animated ticker banner, series combo badges, auto coupon apply | 100% Covered | Mobile enables 1-tap bundle add to cart |
| **Shopping Cart** | Flyout drawer | Dedicated cart tab with persistent bottom action bar | 100% Covered | Mobile features instant quantity stepper and clear subtotal |
| **Checkout** | Shopify hosted checkout URL | Consolidated native checkout screen with COD & bKash/Nagad | 100% Covered | Much faster; eliminates external web redirects |
| **Authentication** | Basic email/password Shopify login | Google, Facebook, and Phone OTP (+880) flow | Superior on Mobile | Mobile introduces Bangladesh-standard phone OTP login |
| **User Profile** | Shopify order list page | Native customer portal with saved addresses, orders, support | 100% Covered | Mobile includes instant one-tap logout and profile switcher |
| **Store Locator** | Text list on subpage | Interactive cards with one-tap phone dialing & location details | Superior on Mobile | Enables mobile customers to call showroom managers directly |
| **Customer Support** | WhatsApp floating widget | Direct WhatsApp linking + In-app AI Shopping Assistant | Superior on Mobile | Provides instant automated answers for sizes, combos, and care |
| **Admin Operations** | Separate Shopify admin backend | Hidden role-gated admin dashboard in the app | 100% Covered | Allows store managers to check stats and orders from their phone |

---

## 2. Features Intentionally Refined for Mobile

1. **Elimination of Web Redirections**:
   - The web version often redirects users to multi-step Shopify hosted pages. The mobile application keeps all steps in-app for minimal latency.
2. **Simplified Delivery Zone Selection**:
   - In Bangladesh, delivery pricing is strictly split into Inside Dhaka (৳70) and Outside Dhaka (৳130). The mobile app places this as a prominent radio toggle directly on checkout.
3. **Dedicated Wishlist Screen**:
   - On the web version, wishlist functionality is often hidden or requires third-party plugins. The mobile app provides a first-class bottom tab for wishlist items.

---

## 3. Future Production Opportunities (Post-Launch)

- **Push Notifications**: Real-time push alerts for flash sales, Eid drops, and prayer-time deals via Expo Notifications / Firebase Cloud Messaging (FCM).
- **Biometric Authentication**: Fingerprint / Face Unlock for one-touch login on Android devices.
- **Offline Order Staging**: Queueing orders locally if internet drops during checkout.
- **Geo-Location Showroom Finder**: Automatically sorting showrooms by proximity using device GPS.
