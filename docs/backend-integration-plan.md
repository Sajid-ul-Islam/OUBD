# OUBD Mobile App — Backend Integration Plan

## 1. Backend Agnostic Architecture

The OUBD mobile application is engineered with a modular service contract layer. The application does not assume or hardcode dependencies on any specific backend engine. When the website owner approves the prototype, the app can be linked to any of the following backends simply by replacing the service adapters in `src/services/`:

1. **Shopify Storefront API** (GraphQL / Storefront REST)
2. **WooCommerce REST API** (v3)
3. **Custom Laravel / PHP API**
4. **Node.js / Express / NestJS REST or GraphQL**

---

## 2. Expected API Contracts

### Authentication Endpoints
```http
POST   /api/v1/auth/otp/request
Body:  { "phone": "+8801700000000" }
Response: { "success": true, "expiresIn": 60 }

POST   /api/v1/auth/otp/verify
Body:  { "phone": "+8801700000000", "code": "1234" }
Response: { "token": "jwt_token", "user": { "id": "1", "name": "...", "phone": "..." } }

POST   /api/v1/auth/oauth/google
Body:  { "idToken": "google_oauth_token" }

POST   /api/v1/auth/oauth/facebook
Body:  { "accessToken": "fb_access_token" }
```

### Catalog Endpoints
```http
GET    /api/v1/products?category=Panjabi&limit=20&page=1
GET    /api/v1/products/:id
GET    /api/v1/collections
GET    /api/v1/search?q=insaf
```

### Cart & Checkout Endpoints
```http
POST   /api/v1/cart/sync
Body:  { "items": [ { "productId": "123", "variantId": "456", "quantity": 2 } ] }

POST   /api/v1/coupons/validate
Body:  { "code": "OUBD10", "subtotal": 2400 }

POST   /api/v1/orders
Body:  {
  "items": [...],
  "shippingAddress": { "fullName": "...", "phone": "...", "address": "...", "zone": "inside_dhaka" },
  "paymentMethod": "cod" | "bkash" | "nagad",
  "couponCode": "OUBD10"
}
Response: { "orderId": "ORD-2026-9812", "status": "pending", "total": 2470 }
```

### Customer Portal Endpoints
```http
GET    /api/v1/user/profile
PUT    /api/v1/user/profile
GET    /api/v1/user/orders
GET    /api/v1/user/orders/:id
```

### Admin Endpoints (Requires Admin Role Bearer Token)
```http
GET    /api/v1/admin/analytics/summary
GET    /api/v1/admin/orders
PUT    /api/v1/admin/orders/:id/status
POST   /api/v1/admin/products
```
