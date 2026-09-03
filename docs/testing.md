# OUBD Mobile App — Testing Documentation

## 1. Testing Strategy

The application undergoes three levels of automated and functional verification:
1. **TypeScript Type Safety**: Zero type errors across the entire codebase (`npm run typecheck`).
2. **Automated Unit & Integration Tests**: Executed via custom test harness (`node scripts/run-tests.js`), verifying:
   - Catalog data integrity and variant structures.
   - Cart calculations (subtotal, delivery fee by zone, coupon deductions, quantity stepping).
   - Order checkout flow and order ID generation.
   - Authentication OTP generation and validation.
   - Admin RBAC guard logic (verifying unauthorized access is rejected).
3. **Manual Functional & UX Verification**:
   - Navigation across all 5 bottom tabs.
   - End-to-end shopping journey: Browse → Search → View PDP → Select Size/Color → Add to Cart → Apply Coupon → Select Delivery Zone → Checkout (COD / bKash) → Order Confirmation.
   - AI shopping bot conversation flow.
   - Showroom locator phone dialer trigger.

---

## 2. Test Execution Commands

```bash
# Run TypeScript compilation check
npm run typecheck

# Run automated unit & integration test suite
npm test
```
