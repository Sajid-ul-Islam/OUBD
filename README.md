<p align="center">
  <img src="assets/images/oubd-logo.png" alt="One Ummah BD Logo" width="280" />
</p>

<h1 align="center">One Ummah BD (OUBD) Mobile App</h1>

<p align="center">
  <strong>Production-Grade, Backend-Agnostic React Native + Expo Android Mobile App Prototype</strong>
  <br />
  <em>"Spread Dawah, Look Good!" — Modest & Modern Islamic Lifestyle Apparel</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2057-black?style=flat-square&logo=expo" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/React%20Native-0.86.3-61DAFB?style=flat-square&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tests-23%20Passing-success?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/Android-Edge--to--Edge-05AE7A?style=flat-square&logo=android" alt="Android" />
</p>

---

## 📖 Overview

This repository contains the complete mobile application prototype for **[One Ummah BD](https://oneummahbd.shop/)**, Bangladesh's premier modest fashion and Sunnah concept wear brand. 

Engineered with **React Native (Expo SDK 57)**, **Expo Router**, and strict **TypeScript**, this app translates the entire desktop e-commerce storefront into an Android-optimized shopping experience. It features authentic catalog data (77+ real products, high-resolution imagery, actual BDT prices), 15+ physical showrooms with direct phone dialers, and an Islamic lifestyle feature set.

---

## ✨ Key Features

- 📱 **True Edge-to-Edge Android UI**: Fully translucent status bar integration with dynamic safe-area insets, eliminating top screen gaps on modern Android devices.
- 🎬 **Animated Startup Intro**: Branded launch screen with official app icon, pulsating emerald ambient glow, white wordmark, and spring transition into the app.
- 🔔 **Multi-Channel Notification Center**: Replaces duplicate header cart buttons with categorized notifications:
  - **🔥 Campaign Deals**: Combo offers (e.g. *Buy 5 Economy T-shirts for ৳1,399*), new showroom opening sales.
  - **📦 Live Order Updates**: Courier dispatch alerts with Steadfast tracking IDs and delivery confirmations.
  - **🕌 Sunnah & Islamic Reminders**: Friday Jummah checklist (Surah Al-Kahf, Durood, non-alcoholic Attar), Sunnah fasting alerts.
- 🏷️ **Dynamic Category Showcases with Authentic Cover Photos**:
  - **Royal Panjabi & Emirati Thobes** (Luxury Sunnah combed cotton)
  - **Dawah Concept Streetwear** (Heavyweight 220+ GSM graphic drop-shoulders)
  - **Stretch Denim Joggers & Cargo** (Athletic jogger flexibility with rugged denim look)
  - **Brimless Docker Caps & Headwear** (Sunnah headwear in breathable cotton twill)
  - **Pure Artisanal Attar Perfumes** (100% Halal alcohol-free perfume concentrates)
- 🤖 **Dedicated AI Shopping Assistant ("Ummah Bot")**: Tab-integrated shopping companion providing intelligent sizing recommendations, modesty guidance, order status tracking, and showroom information.
- 📍 **Bangladesh Showroom Locator**: Interactive directory of 15+ flagship outlets (Bashundhara City, Uttara, Mirpur, Sylhet Zindabazar, Chattogram, Barishal, Rajshahi, etc.) with 1-tap phone dialer.
- 🛍️ **Cart, Coupon Engine & Checkout**:
  - Bangladeshi delivery fee engine (৳70 inside Dhaka, ৳130 outside Dhaka, 100% Free Shipping over ৳3,000).
  - Promo code discounts (`OUBD10`, `EID2026`).
  - Cash on Delivery (COD), bKash, and Nagad integration flow.
- 🔐 **Role-Based Admin Dashboard**: Role-gated administration console protected from regular customer accounts, displaying sales metrics, order fulfillment pipeline, and inventory status.

---

## 🏗️ Technical Architecture

```
OUBD/
├── assets/images/              # Official brand logos, app icons, and graphics
├── docs/                       # Comprehensive 13-part engineering documentation suite
│   ├── brand-analysis.md
│   ├── design-system.md
│   ├── architecture.md
│   ├── website-feature-inventory.md
│   ├── ui-ux-audit.md
│   ├── security-audit.md
│   ├── performance-audit.md
│   ├── backend-integration-plan.md
│   ├── testing.md
│   ├── roadmap.md
│   └── development-log.md
├── scripts/
│   └── run-tests.js            # Automated verification test runner
├── src/
│   ├── app/                    # File-based Expo Router navigation tree
│   │   ├── (tabs)/
│   │   │   ├── index.tsx       # Dynamic Home Screen with category showcases
│   │   │   ├── categories.tsx  # Catalog browse & price filter
│   │   │   ├── ai-assistant.tsx# AI Assistant tab
│   │   │   ├── cart.tsx        # Bag, promo codes & shipping zone selector
│   │   │   └── account.tsx     # Customer profile, orders & admin gate
│   │   ├── product/[id].tsx    # Product details page (PDP) with size guide
│   │   ├── checkout.tsx        # Consolidated checkout
│   │   ├── wishlist.tsx        # Header-linked wishlist
│   │   ├── store-locator.tsx   # 15+ showroom directory
│   │   ├── search.tsx          # Predictive search
│   │   ├── auth/login.tsx      # Phone OTP & social sign-in
│   │   └── admin/dashboard.tsx # Role-gated admin portal
│   ├── components/             # Reusable UI component library
│   │   ├── Header.tsx          # Brand header with Notification Bell & Wishlist
│   │   ├── NotificationModal.tsx# 3-tier Notification Center
│   │   ├── StartupAnimation.tsx# Brand startup intro animation
│   │   ├── CategoryShowcaseSection.tsx # Cover photo category modules
│   │   ├── ProductCard.tsx     # E-commerce card with discounts & ratings
│   │   ├── BannerCarousel.tsx  # Hero campaign banners
│   │   ├── CategoryPills.tsx   # Quick filter pills
│   │   ├── ShowroomCard.tsx    # Outlet contact card
│   │   └── SizeGuideModal.tsx  # Panjabi / T-Shirt measurement charts
│   ├── constants/
│   │   ├── theme.ts            # Brand design tokens (Colors, Typography, Radius)
│   │   └── config.ts           # App configuration
│   ├── services/               # Backend-agnostic abstraction layer
│   │   ├── api/client.ts       # Pluggable REST/GraphQL adapter
│   │   ├── auth/               # Authentication services
│   │   ├── products/           # Product and collection services
│   │   ├── orders/             # Order and checkout lifecycle
│   │   └── mock/data.ts        # 77+ authentic products extracted from live store
│   ├── store/
│   │   └── AppContext.tsx      # Global state with offline AsyncStorage persistence
│   └── types/
│       └── index.ts            # Domain TypeScript interfaces
└── app.json                    # Expo project configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Android physical device with **Expo Go** installed (or Android Studio emulator)

### Installation
```bash
# Clone the repository
git clone https://github.com/Sajid-ul-Islam/OUBD.git
cd OUBD

# Install dependencies
npm install
```

### Running the App
```bash
# Start Expo development server for Expo Go
npx expo start --go

# Or run on a specific port
npx expo start --go --port 8083
```
Scan the QR code displayed in the terminal with the **Expo Go** app on your Android device.

---

## 🧪 Verification & Testing

```bash
# Run the automated verification suite (23 domain tests)
npm test

# Run TypeScript compilation check (0 errors)
npm run typecheck
```

---

## 📚 Documentation

Detailed technical documents are available in the [`docs/`](docs/) directory:
- [Brand Analysis & Palette](docs/brand-analysis.md)
- [Design System](docs/design-system.md)
- [Technical Architecture](docs/architecture.md)
- [Backend Integration Plan](docs/backend-integration-plan.md)
- [Commercial Development Roadmap](docs/roadmap.md)
- [Development Log](docs/development-log.md)

---

## 📄 License

This project is licensed under the MIT License.
