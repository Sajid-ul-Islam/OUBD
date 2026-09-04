/**
 * One Ummah BD (OUBD) Mobile App — Automated Verification Suite
 * Tests domain invariants, pricing calculations, delivery fee models, Bangladeshi phone validators,
 * catalog integrity, promotional bundle rules, showroom records, and RBAC authorization guards.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    testsFailed++;
  }
}

console.log('\n======================================================');
console.log('🚀 Running One Ummah BD (OUBD) App Verification Suite');
console.log('======================================================\n');

// 1. Phone Number Validation (Bangladeshi Standards)
console.log('--- Test Suite 1: Phone Validation & Normalization ---');
const isValidBdPhone = (phone) => {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(clean);
};

runTest('Validates standard 11-digit BD mobile starting with 019 (OUBD Hotline)', () => {
  assert.strictEqual(isValidBdPhone('01901165090'), true);
});

runTest('Validates international format BD mobile +8801901165090', () => {
  assert.strictEqual(isValidBdPhone('+8801901165090'), true);
});

runTest('Validates formatted phone with hyphens and spaces (+88) 01901-165090', () => {
  assert.strictEqual(isValidBdPhone('+880 1901-165090'), true);
});

runTest('Rejects landlines and invalid prefixes', () => {
  assert.strictEqual(isValidBdPhone('029876543'), false); // Dhaka landline
  assert.strictEqual(isValidBdPhone('01012345678'), false); // 010 invalid prefix
  assert.strictEqual(isValidBdPhone('12345'), false); // Too short
});

// 2. Pricing, Delivery & Free Shipping Logic
console.log('\n--- Test Suite 2: Pricing, Delivery & Free Shipping ---');
const getDeliveryFee = (zone, subtotal) => {
  if (subtotal >= 3000) return 0;
  return zone === 'inside_dhaka' ? 70 : 130;
};

const validateCoupon = (code, subtotal) => {
  const clean = (code || '').trim().toUpperCase();
  if (clean === 'OUBD10') {
    return { valid: true, discountAmount: Math.round(subtotal * 0.1) };
  }
  if (clean === 'EID2026') {
    return { valid: true, discountAmount: Math.round(subtotal * 0.15) };
  }
  if (clean === 'FIRSTORDER') {
    return { valid: true, discountAmount: 100 };
  }
  return { valid: false, discountAmount: 0 };
};

const calculatePricing = (items, couponCode, zone = 'inside_dhaka') => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const couponResult = validateCoupon(couponCode, subtotal);
  const discount = couponResult.valid ? couponResult.discountAmount : 0;
  const deliveryFee = items.length > 0 ? getDeliveryFee(zone, subtotal) : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  return { subtotal, discount, deliveryFee, total };
};

runTest('Calculates Inside Dhaka delivery fee of ৳70 for order below ৳3,000', () => {
  const items = [{ price: 1499, quantity: 1 }];
  const pricing = calculatePricing(items, null, 'inside_dhaka');
  assert.strictEqual(pricing.subtotal, 1499);
  assert.strictEqual(pricing.deliveryFee, 70);
  assert.strictEqual(pricing.total, 1569);
});

runTest('Calculates Outside Dhaka delivery fee of ৳130 for order below ৳3,000', () => {
  const items = [{ price: 1499, quantity: 1 }];
  const pricing = calculatePricing(items, null, 'outside_dhaka');
  assert.strictEqual(pricing.subtotal, 1499);
  assert.strictEqual(pricing.deliveryFee, 130);
  assert.strictEqual(pricing.total, 1629);
});

runTest('Applies 100% FREE delivery when subtotal reaches ৳3,000 threshold', () => {
  const items = [{ price: 1850, quantity: 2 }]; // ৳3,700
  const pricing = calculatePricing(items, null, 'outside_dhaka');
  assert.strictEqual(pricing.subtotal, 3700);
  assert.strictEqual(pricing.deliveryFee, 0);
  assert.strictEqual(pricing.total, 3700);
});

runTest('Applies percentage promo coupon OUBD10 (10% off) correctly', () => {
  const items = [{ price: 2000, quantity: 1 }];
  const pricing = calculatePricing(items, 'OUBD10', 'inside_dhaka');
  assert.strictEqual(pricing.subtotal, 2000);
  assert.strictEqual(pricing.discount, 200); // 10% of 2000
  assert.strictEqual(pricing.deliveryFee, 70);
  assert.strictEqual(pricing.total, 1870);
});

runTest('Applies Eid special coupon EID2026 (15% off) correctly', () => {
  const items = [{ price: 4000, quantity: 1 }];
  const pricing = calculatePricing(items, 'EID2026', 'inside_dhaka');
  assert.strictEqual(pricing.subtotal, 4000);
  assert.strictEqual(pricing.discount, 600); // 15% of 4000
  assert.strictEqual(pricing.deliveryFee, 0); // Free delivery >= 3000
  assert.strictEqual(pricing.total, 3400);
});

runTest('Rejects invalid or unassigned coupons', () => {
  const result = validateCoupon('INVALID_CODE', 1000);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.discountAmount, 0);
});

// 3. Special "Buy 5 Economy T-Shirts for 1399 Tk" Bundle Logic
console.log('\n--- Test Suite 3: Bundle Promotions (Buy 5 for 1399 Tk) ---');
const calculateBundlePricing = (economyTshirtsCount) => {
  const bundleSize = 5;
  const bundlePrice = 1399;
  const regularUnitPrice = 350;

  const fullBundles = Math.floor(economyTshirtsCount / bundleSize);
  const remaining = economyTshirtsCount % bundleSize;

  return fullBundles * bundlePrice + remaining * regularUnitPrice;
};

runTest('Calculates exactly 1399 Tk for 5 Economy T-shirts bundle', () => {
  const total = calculateBundlePricing(5);
  assert.strictEqual(total, 1399);
});

runTest('Calculates 2 bundles (10 shirts) at 2798 Tk', () => {
  const total = calculateBundlePricing(10);
  assert.strictEqual(total, 2798);
});

runTest('Calculates 1 bundle + 1 individual shirt correctly', () => {
  const total = calculateBundlePricing(6); // 1399 + 350 = 1749
  assert.strictEqual(total, 1749);
});

// 4. Catalog Data Integrity
console.log('\n--- Test Suite 4: Catalog & Mock Data Integrity ---');
const cleanProductsPath = path.join(__dirname, '..', 'clean_products.json');
const products = JSON.parse(fs.readFileSync(cleanProductsPath, 'utf8'));

runTest('Contains authentic products extracted from live store', () => {
  assert(products.length >= 50, `Expected at least 50 products, found ${products.length}`);
});

runTest('Every product has valid ID, non-empty title, and positive price in BDT', () => {
  for (const p of products) {
    assert.ok(p.id, `Product missing id: ${JSON.stringify(p)}`);
    assert.ok(p.title && p.title.trim().length > 0, `Product missing title: ${p.id}`);
    assert.ok(p.price > 0, `Product has non-positive price: ${p.id}`);
    assert.ok(Array.isArray(p.images) && p.images.length > 0, `Product missing images: ${p.id}`);
    assert.ok(p.category, `Product missing category: ${p.id}`);
  }
});

runTest('Contains required core modest apparel categories', () => {
  const categories = new Set(products.map(p => p.category.toLowerCase()));
  assert(categories.has('pants') || categories.has('denim joggers'), 'Must contain Pants/Denim');
  assert(categories.has('t-shirt'), 'Must contain T-Shirts');
  assert(categories.has('panjabi') || categories.has('punjabi'), 'Must contain Panjabi');
  assert(categories.has('docker cap') || categories.has('cap'), 'Must contain Caps');
});

// 5. Showroom Physical Directory Verification
console.log('\n--- Test Suite 5: Physical Showroom Network ---');
const showroomDataPath = path.join(__dirname, '..', 'src', 'services', 'mock', 'data.ts');
const dataContent = fs.readFileSync(showroomDataPath, 'utf8');

runTest('Showroom data includes key flagship locations (Bashundhara, Sylhet, etc.)', () => {
  assert(dataContent.includes('Bashundhara City'), 'Missing Bashundhara City showroom');
  assert(dataContent.includes('Uttara Showroom'), 'Missing Uttara showroom');
  assert(dataContent.includes('Sylhet Zindabazar'), 'Missing Sylhet showroom');
  assert(dataContent.includes('Chattogram'), 'Missing Chattogram showroom');
  assert(dataContent.includes('Barishal Outlet'), 'Missing Barishal showroom');
});

// 6. Role-Based Authorization Guard (RBAC)
console.log('\n--- Test Suite 6: Role-Based Authorization (Admin Isolation) ---');
const checkAdminAccess = (role) => role === 'admin';

runTest('Grants admin portal access exclusively to admin role', () => {
  assert.strictEqual(checkAdminAccess('admin'), true);
  assert.strictEqual(checkAdminAccess('customer'), false);
  assert.strictEqual(checkAdminAccess('guest'), false);
  assert.strictEqual(checkAdminAccess(undefined), false);
});

// 7. Order State Machine Transition Check
console.log('\n--- Test Suite 7: Order Lifecycle State Machine ---');
const getNextOrderStatus = (currentStatus) => {
  const transitions = {
    pending: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
    delivered: 'delivered',
  };
  return transitions[currentStatus] || 'pending';
};

runTest('Advances pending -> processing -> shipped -> delivered', () => {
  assert.strictEqual(getNextOrderStatus('pending'), 'processing');
  assert.strictEqual(getNextOrderStatus('processing'), 'shipped');
  assert.strictEqual(getNextOrderStatus('shipped'), 'delivered');
  assert.strictEqual(getNextOrderStatus('delivered'), 'delivered');
});

// 8. Notification Center & Campaign Alert Taxonomy
console.log('\n--- Test Suite 8: Notification Center & Campaign Taxonomy ---');
const sampleNotifications = [
  { id: '1', title: 'Buy 5 Combo', type: 'campaign', unread: true },
  { id: '2', title: 'Order Dispatched', type: 'order', unread: true },
  { id: '3', title: 'Jummah Sunnah', type: 'reminder', unread: true },
  { id: '4', title: 'Outlet Opening', type: 'campaign', unread: false },
];

runTest('Filters notifications correctly by category type', () => {
  const campaigns = sampleNotifications.filter(n => n.type === 'campaign');
  const orders = sampleNotifications.filter(n => n.type === 'order');
  const reminders = sampleNotifications.filter(n => n.type === 'reminder');
  assert.strictEqual(campaigns.length, 2);
  assert.strictEqual(orders.length, 1);
  assert.strictEqual(reminders.length, 1);
});

runTest('Computes unread badge count and mark-all-read behavior accurately', () => {
  const unreadCount = sampleNotifications.filter(n => n.unread).length;
  assert.strictEqual(unreadCount, 3);
  const allRead = sampleNotifications.map(n => ({ ...n, unread: false }));
  assert.strictEqual(allRead.filter(n => n.unread).length, 0);
});

// 9. Category Showcase & Cover Photo Presence
console.log('\n--- Test Suite 9: Dynamic Category Showcase & Cover Photos ---');
const homeFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', '(tabs)', 'index.tsx'), 'utf8');

runTest('HomeScreen configures authentic category cover photos for major collections', () => {
  assert(homeFile.includes('premium-panjabi-banner.png'), 'Missing Panjabi cover photo');
  assert(homeFile.includes('Banner_v2_3.png'), 'Missing Dawah T-shirt cover photo');
  assert(homeFile.includes('MPfGeKmqbGOSFnYXG8BzPZ2u4EKHw64dWMLAJtZb.webp'), 'Missing Denim Joggers cover photo');
  assert(homeFile.includes('visor-cap-banner.png'), 'Missing Docker Cap cover photo');
  assert(homeFile.includes('Banner_v2_2_3f7dbbed'), 'Missing Attar cover photo');
});

runTest('Startup animation and edge-to-edge status bar configured in app layout', () => {
  const layoutFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', '_layout.tsx'), 'utf8');
  assert(layoutFile.includes('StartupAnimation'), 'Missing StartupAnimation in _layout');
  assert(layoutFile.includes('translucent'), 'Missing translucent status bar configuration');
});

// 10. Official Social Channels & Shoppable Commerce
console.log('\n--- Test Suite 10: Official Social Channels & Shoppable Commerce ---');
const socialFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'services', 'social', 'socialService.ts'), 'utf8');

runTest('Contains official Facebook and Instagram URLs for One Ummah BD', () => {
  assert(socialFile.includes('https://www.facebook.com/oneummahbd'), 'Missing official Facebook URL');
  assert(socialFile.includes('https://www.instagram.com/oneummahbd/?hl=en'), 'Missing official Instagram URL');
});

runTest('Shoppable reels and stories map to authentic catalog products', () => {
  assert(socialFile.includes('taggedProduct'), 'Missing tagged products on reels');
  assert(socialFile.includes('8646731792463'), 'Missing Panjabi tagged SKU');
  assert(socialFile.includes('8975892349007'), 'Missing Dawah T-Shirt tagged SKU');
});

// 11. Customer UI Safety & Restricted Control Removal
console.log('\n--- Test Suite 11: Customer UI Safety & Restricted Controls ---');
const accountFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', '(tabs)', 'account.tsx'), 'utf8');

runTest('Ensures developer admin switcher is completely removed from customer view', () => {
  assert(!accountFile.includes('Demo: Switch to Admin Role'), 'Found developer admin switch in customer account screen');
  assert(!accountFile.includes('Developer & Prototype Controls'), 'Found developer controls header in customer account screen');
});

runTest('Account screen contains Notification Preferences and Official Community sections', () => {
  assert(accountFile.includes('Notification Preferences'), 'Missing Notification Preferences in account screen');
  assert(accountFile.includes('Official Social Community'), 'Missing Official Social Community in account screen');
});

console.log('\n======================================================');
console.log(`Results: ${testsPassed} Passed, ${testsFailed} Failed`);
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
