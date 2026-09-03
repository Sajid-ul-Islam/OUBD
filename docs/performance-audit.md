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
