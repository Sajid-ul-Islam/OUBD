# OUBD Mobile App — UI / UX Audit & Guidelines

Comprehensive evaluation of visual quality, ergonomic touch standards, Android platform conventions, and usability heuristics.

---

## 1. Visual Polish & Brand Alignment

### Brand Recognition
- **Official Palette**: Dark charcoal (`#101828`), emerald green (`#05AE7A`), and ruby red (`#DB1215`) create an immediately recognizable brand atmosphere that aligns with the live website.
- **Imagery**: Uses high-resolution product imagery from the live One Ummah BD CDN, preserving authentic textures and embroidery details.
- **Typography & Scale**: High contrast ratio (exceeding WCAG AA 4.5:1 standard) for all primary and secondary text against light backgrounds.

---

## 2. Touch Targets & Ergonomics

- **Minimum Touch Area**: All interactive buttons, variant selectors, and tab items adhere to Google Material Design guidelines with minimum dimensions of **48x48 dp**.
- **Thumb Zone Optimization**: Primary conversion triggers (Add to Cart, Checkout CTA, Cart Bottom Sheet) are pinned to the bottom 30% of the display for effortless single-handed thumb operation.
- **Visual Feedback**: Touchable elements feature active opacity and elevation changes to confirm user interactions immediately.

---

## 3. Android Platform Specifics

- **Edge-to-Edge Safe Area**: Full integration with `react-native-safe-area-context` to guarantee UI elements do not overlap with camera notches, status bars, or Android gesture navigation pills.
- **Hardware Back Button**: Full stack-aware back navigation handling via Expo Router. Pressing back from product details or checkout reliably returns to the previous screen without app termination.
- **Keyboard Handling**: Form inputs on Checkout and Auth screens wrapped in `KeyboardAvoidingView` / `ScrollView` to prevent keyboard occlusion on compact Android screens.
- **Status Bar Style**: Configured to `dark-content` with translucent background on modern Android API levels.

---

## 4. State Completeness Checklist

- [x] **Loading States**: Skeletons and spinners for catalog retrieval, checkout processing, and authentication requests.
- [x] **Empty States**: Friendly, brand-aligned illustrations and actionable buttons for Empty Cart ("Explore New Arrivals"), Empty Wishlist, and Empty Orders.
- [x] **Error Recovery**: Clear alert dialogs and retry buttons for network hiccups or invalid form entries.
- [x] **Zero-Placeholder Guarantee**: No "Lorem Ipsum" or placeholder product labels; all products, categories, showrooms, and policies represent real brand data.
