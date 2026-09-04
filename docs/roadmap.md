# OUBD Mobile App — Commercial Development Roadmap

A phased master roadmap guiding the transition from this functional MVP prototype into a commercially deployed production application on the Google Play Store.

---

## Phase 1 — Prototype & Client Showcase (Current Phase)
- [x] Comprehensive brand analysis and visual identity replication.
- [x] Real catalog extraction (77+ rich products, categories, pricing, variants).
- [x] Full customer shopping journey (Home, Search, PDP, Cart, Checkout, Confirmation).
- [x] Bangladesh-specific checkout flow (COD, bKash/Nagad mock, Dhaka/Outside Dhaka shipping).
- [x] Authentication flows (Phone OTP UX, Google, Facebook).
- [x] Interactive Showroom Locator for all 15+ Bangladesh outlets with one-tap calling.
- [x] In-app AI Shopping Assistant with live human WhatsApp escalation.
- [x] True edge-to-edge Android status bar integration and startup brand animation.
- [x] Official brand social channels (Facebook & Instagram) and Shoppable Reels integration.
- [x] Value-first notification opt-in journey with customizable category preferences.
- [x] Customer UI cleanup: Complete isolation and removal of developer admin switches.
- [x] Exhaustive architectural, design system, and social integration documentation.

---

## Phase 2 — Production Backend Integration
- **Target Backend Selection**: Connect to Shopify Storefront API, WooCommerce, or custom Laravel REST API.
- **Meta Graph API Provisioning**: Link official Instagram Graph API & webhooks for automatic reel synchronization.
- **SMS Gateway Provisioning**: Integrate Bangladeshi SMS gateway (SSL Wireless, Greenweb, or Twilio) for real SMS OTP delivery.
- **Payment Gateway Integration**: Hook live bKash Merchant API, Nagad Direct, SSLCommerz, or Shurjopay SDK.
- **User Account Sync**: Sync customer addresses, saved carts, and historical orders.

---

## Phase 3 — Production Hardening & Security
- **Secure Keystore & APK Signing**: Generate Android release keystore and configure ProGuard / R8 code shrinking.
- **Push Notification Infrastructure**: Implement Firebase Cloud Messaging (FCM) and Expo Notifications for flash sales and order status updates.
- **Sentry Crash Reporting**: Crash telemetry and error monitoring integration.
- **Offline Sync Engine**: SQLite / WatermelonDB cache for full offline catalog browsing.

---

## Phase 4 — Google Play Store Launch
- **App Store Assets**: Prepare high-res icon, feature graphics, screenshots for multiple screen dimensions, and bilingual privacy policy.
- **Closed Testing (Alpha/Beta)**: 20 testers for 14 days meeting Google Play Console requirements.
- **Production Release**: Staged rollout starting at 10% expanding to 100%.

---

## Phase 5 — Continuous Optimization
- **Live Inventory Sync with Physical Showrooms**: Show in-stock availability per showroom (Bashundhara City, Sylhet, etc.).
- **Loyalty & Ummah Rewards Program**: Points accumulation per purchase redeemable for discounts or free attar.
- **Ramadan & Eid Specialized Modes**: Themed UI adaptations, prayer time alerts, and gift-wrapping options.
