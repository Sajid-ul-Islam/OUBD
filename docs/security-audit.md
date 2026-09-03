# OUBD Mobile App — Security & Authorization Audit

## 1. Authentication & Session Security

1. **Token Storage**:
   - Authentication tokens and user profile state are stored using secure persistent abstractions.
   - Plaintext passwords are never accepted, stored, or processed on the client device.
2. **Phone OTP Verification**:
   - OTP input enforces a 60-second cooldown timer before permitting resend requests to mitigate SMS flooding and abuse.
   - Code verification is validated through dedicated service endpoints.
3. **Third-Party OAuth (Google & Facebook)**:
   - OAuth flows follow PKCE standards (Proof Key for Code Exchange) avoiding client secret exposure inside the mobile bundle.

---

## 2. Role-Based Access Control (RBAC) & Admin Isolation

A critical requirement from `Goal.md` is that regular customers must never be exposed to administrative routes or functionality.

### Isolation Rules
1. **Hidden Navigation**:
   - The primary customer navigation (Bottom Tabs: Home, Categories, Wishlist, Cart, Account) contains zero admin tabs, buttons, or links.
2. **Route Guards**:
   - The `/admin/dashboard` route checks the user's role on mount. If the active user does not have `role: 'admin'`, the app immediately redirects to the customer home screen with an access violation notice.
3. **Credential Storage**:
   - No hardcoded administrative credentials exist in the production source code.

---

## 3. Data Protection & Network Security

- **HTTPS Strict Transport Security**: All external asset and API calls enforce HTTPS (`https://oneummahbd.shop/` and CDN domains).
- **Input Sanitization**: All form fields (shipping addresses, phone numbers, coupon codes) undergo client-side trim and type sanitization before dispatch.
- **Sensitive Key Management**: Environment variables are managed via Expo configuration files with public tokens restricted to storefront read-only scopes.
