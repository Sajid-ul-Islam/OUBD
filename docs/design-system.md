# OUBD Mobile App — Design System Specification

A cohesive, modern, brand-consistent design system built specifically for the **One Ummah BD** React Native Android mobile experience.

---

## 1. Color Palette & Semantic Tokens

```typescript
export const Colors = {
  // Brand Core
  primary: '#101828',         // Deep Charcoal / Onyx (Dominant)
  primaryLight: '#1D2939',    // Secondary Charcoal for cards / elevated elements
  accent: '#05AE7A',          // Dawah Emerald (Primary CTA, Success, Highlights)
  accentHover: '#048c62',
  accentSubtle: '#E6F7F1',     // Soft emerald tint for badges and chips
  
  // Sale & Urgent
  sale: '#DB1215',            // Sunnah Ruby / Crimson (Discounts, Sale prices)
  saleSubtle: '#FEE4E2',      // Soft red background for discounts
  warning: '#F79009',         // Amber / Star Ratings
  
  // Backgrounds & Canvas
  background: '#FFFFFF',      // Main canvas
  surface: '#F8F9FA',         // Secondary surfaces (Product card background)
  surfaceVariant: '#F2F4F7',  // Input backgrounds, chip inactive
  warmSand: '#FBF7F0',        // Warm Islamic heritage cream
  
  // Text Hierarchy
  textPrimary: '#101828',     // Headers, titles, primary labels
  textSecondary: '#475467',   // Body text, specifications
  textMuted: '#98A2B3',       // Placeholders, disabled text, timestamps
  textInverse: '#FFFFFF',     // Text on primary/accent buttons
  
  // Borders & Dividers
  border: '#EAECF0',
  borderStrong: '#D0D5DD',
  
  // Status Colors
  success: '#12B76A',
  error: '#F04438',
  info: '#0BA5EC',
};
```

---

## 2. Typography Scale

Clean sans-serif hierarchy engineered for legibility across low and high-density Android displays:

| Style Name | Size (sp) | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| `displayLg` | 28 | Bold (700) | 36 | -0.5 | Hero headings, splash titles |
| `displaySm` | 22 | Bold (700) | 28 | -0.3 | Screen titles, section headers |
| `title` | 18 | SemiBold (600) | 24 | -0.2 | Product titles on PDP, card titles |
| `subtitle` | 15 | Medium (500) | 20 | 0 | Category labels, secondary headers |
| `body` | 14 | Regular (400) | 20 | 0 | Descriptions, policies, order details |
| `bodyBold` | 14 | SemiBold (600) | 20 | 0 | Prices, key specifications, button text |
| `caption` | 12 | Regular (400) | 16 | +0.2 | Variant chips, badge text, review date |
| `tiny` | 10 | SemiBold (600) | 14 | +0.4 | Discount tags, stock count, SKU |

---

## 3. Spacing & Sizing Scale

Using an 8-point spatial grid with 4-point micro adjustments:
- `spacing.xxs`: 2dp
- `spacing.xs`: 4dp
- `spacing.sm`: 8dp
- `spacing.md`: 12dp
- `spacing.lg`: 16dp (Standard screen horizontal padding)
- `spacing.xl`: 24dp
- `spacing.xxl`: 32dp

---

## 4. Border Radius & Shadows

### Border Radius
- `radius.xs`: 4dp (Badge, chips)
- `radius.sm`: 8dp (Input fields, small buttons)
- `radius.md`: 12dp (Product cards, category pills)
- `radius.lg`: 16dp (Modals, bottom sheets, banners)
- `radius.full`: 999dp (Pill buttons, floating buttons)

### Android Elevation & Shadows
- `elevation.low`: elevation 2, `shadowOpacity: 0.06`, `shadowRadius: 4` (Product cards)
- `elevation.medium`: elevation 4, `shadowOpacity: 0.10`, `shadowRadius: 8` (Bottom navigation, sticky CTA)
- `elevation.high`: elevation 8, `shadowOpacity: 0.16`, `shadowRadius: 16` (Modals, floating AI bot)

---

## 5. Standard Component Guidelines

### Buttons
1. **Primary Action**: Solid Emerald `#05AE7A` background, white bold text, height 48dp (Android touch target standard).
2. **Secondary Action**: Solid Charcoal `#101828` background, white text.
3. **Outlined / Ghost**: Border 1.5dp `#D0D5DD`, text `#101828`.
4. **Destructive**: Soft red background `#FEE4E2`, text `#D92D20`.

### Product Cards
- Aspect ratio 1:1 image container.
- Discount badge anchored top-right: red pill with `-X%` or `SALE`.
- Wishlist heart icon anchored top-left with tap target padding (min 44x44dp).
- Two-line truncated title.
- Dual price layout: Current price (bold dark) + Strikethrough compare price (muted).
- Quick "Add" button with '+' icon.

### Form Inputs
- 48dp touch height with subtle border `#D0D5DD`.
- Clear focus state with `#05AE7A` border and gentle ring.
- Explicit label and helper/error text below.
