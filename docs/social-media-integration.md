# One Ummah BD (OUBD) — Social Media & Video Content Integration

This document outlines the architecture, official profiles, content integration strategy, and production API roadmap for embedding One Ummah BD's social channels and shoppable content.

---

## 1. Official Brand Social Channels

| Platform | Handle / Username | Official URL | Verified Status | Community Reach |
| :--- | :--- | :--- | :--- | :--- |
| **Facebook** | `oneummahbd` | [https://www.facebook.com/oneummahbd](https://www.facebook.com/oneummahbd) | Verified Blue Check | 485K+ Followers |
| **Instagram** | `@oneummahbd` | [https://www.instagram.com/oneummahbd/?hl=en](https://www.instagram.com/oneummahbd/?hl=en) | Verified | 135K+ Followers |
| **WhatsApp Support** | `+880 1901-165090` | [https://wa.me/8801901165090](https://wa.me/8801901165090) | Official Business Account | Direct Hotline |

---

## 2. Architecture & Service Abstraction

To avoid fragile and legally prohibited web scraping, all social media data flows through the backend-agnostic service layer:
```
UI Components (ShoppableSocialSection.tsx, Account.tsx)
              │
              ▼
   SocialService (src/services/social/socialService.ts)
              │
              ▼
┌───────────────────────────────┬───────────────────────────────┐
│       Prototype Mode          │        Production Mode        │
│   Authentic Mock Dataset      │   Meta Graph / Instagram API  │
│  (Stories, Reels, Tagged SKU) │   Webhook CDN Cache Invalidation│
└───────────────────────────────┴───────────────────────────────┘
```

### Typed Data Models
1. **`SocialAccount`**: Verified badges, subscriber/follower stats, and deep-link schemes (`fb://`, `instagram://`).
2. **`SocialStory`**: Ephemeral circular story reels with unread gradient rings, category banners, and linked catalog SKUs.
3. **`SocialReel`**: Shoppable short-form videos with thumbnail posters, engagement metrics, captions, and `taggedProduct` associations.
4. **`TaggedProductRef`**: Direct pointer to catalog items (`id`, `title`, `price`, `image`) enabling 1-tap **"Shop This Look"** transitions directly to the Product Details Page (PDP).

---

## 3. Social + Commerce User Journey

Social discovery is tightly woven into the commercial funnel rather than functioning as an isolated web link:

```
User sees Instagram Reel / Story on Home Screen
                     │
                     ▼
User taps "Shop This Look" / Tagged Product Pill
                     │
                     ▼
Navigates natively to Product Details Page (`/product/[id]`)
                     │
                     ▼
Selects size & color variant ➔ Adds to Bag
                     │
                     ▼
Seamless Checkout with COD / bKash / Nagad
```

---

## 4. Production Meta / Instagram API Integration Requirements

To switch the application from mock social content to live production feeds, the following credentials and webhooks must be provisioned in Meta for Developers:

### A. Required Meta Developer App Scopes
1. **Instagram Basic Display API / Instagram Graph API**:
   - `instagram_graph_user_profile`
   - `instagram_graph_user_media`
   - `pages_read_engagement`
   - `pages_show_list`
2. **Long-Lived User Access Tokens**:
   - Meta access tokens expire every 60 days. The backend microservice must run a scheduled cron to exchange tokens before expiration via `GET https://graph.instagram.com/refresh_access_token`.

### B. Backend Endpoint Architecture
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/social/accounts` | Retrieves verified profile stats and bio links. |
| `GET` | `/api/v1/social/stories` | Returns active 24-hour stories with associated product IDs. |
| `GET` | `/api/v1/social/reels` | Returns curated shoppable Reels sorted by engagement. |
| `POST` | `/api/v1/social/webhooks` | Listens for new post events and invalidates Redis cache. |

### C. Fallback Strategy
If the Instagram or Meta API encounters rate limits or service degradation, the app gracefully falls back to cached CDN media assets with local deep-links to ensure zero disruptions to customer browsing.
