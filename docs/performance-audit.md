# OUBD Mobile App — Performance Audit & Optimization

## 1. List Rendering & Virtualization

- **Virtualized FlatList**: Both the Homepage product feed and the Category browse view utilize virtualized lists with tuned windowing parameters:
  - `initialNumToRender={6}`
  - `maxToRenderPerBatch={8}`
  - `windowSize={5}`
  - `removeClippedSubviews={true}`
- **Memoized Item Components**: `ProductCard` components are structured to prevent unnecessary re-renders when parent states change.

---

## 2. Image Optimization & Caching

- **Fast Remote Images**: Product images use CDN URLs with width-limiting query parameters where available to reduce payload size.
- **Aspect Ratio Locking**: Containers maintain fixed aspect ratios (1:1 for product tiles) to eliminate layout shifts (Cumulative Layout Shift = 0) during image loading.
- **Fallback Placeholders**: Lightweight vector icons display instantly if network connectivity slows down remote image fetching.

---

## 3. Bundle Size & Execution Efficiency

- **Tree-Shaking**: Direct imports from `@expo/vector-icons` and focused utility libraries keep bundle sizes lightweight.
- **State Granularity**: Cart and Wishlist modifications trigger targeted updates in `AppContext` rather than full tree re-renders.
- **Startup Time**: App initial render avoids heavy synchronous processing on the JS thread.

---

## 4. Motion & Media Performance Strategy

- **Native Driver Animations**: Hero motion loops, startup intro transitions, and card press scaling strictly leverage `useNativeDriver: true`, ensuring zero 60fps drops on mid-range Android chipsets.
- **Poster Thumbnailing**: Social reels and stories utilize lightweight static preview posters with dark scrim overlays rather than rendering raw unbuffered MP4 streams simultaneously.
- **Horizontal Paging Deceleration**: Category and Reels carousels configure `decelerationRate="fast"` for smooth native Android fling behavior.
