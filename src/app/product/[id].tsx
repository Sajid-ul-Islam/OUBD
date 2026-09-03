import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { productService } from '../../services/products/productService';
import { Product, Review } from '../../types';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../store/AppContext';
import { SizeGuideModal } from '../../components/SizeGuideModal';
import { ProductCard } from '../../components/ProductCard';
import { APP_CONFIG } from '../../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');

  useEffect(() => {
    (async () => {
      if (id) {
        const prod = await productService.getProductById(id);
        if (prod) {
          setProduct(prod);
          if (prod.sizes.length > 0) setSelectedSize(prod.sizes[0]);
          if (prod.colors.length > 0) setSelectedColor(prod.colors[0]);

          const [revs, rel] = await Promise.all([
            productService.getReviews(prod.id),
            productService.getRelatedProducts(prod),
          ]);
          setReviews(revs);
          setRelated(rel);
        }
      }
    })();
  }, [id]);

  if (!product) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Ionicons name="shirt-outline" size={48} color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Product Details...</Text>
      </View>
    );
  }

  const isWished = isInWishlist(product.id);
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.title} on One Ummah BD: ${APP_CONFIG.WEBSITE_URL}/products/${product.handle}`,
      });
    } catch {}
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    Alert.alert('Added to Bag', `${quantity}x ${product.title} added to your cart.`);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      {/* Top Floating App Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.category}
        </Text>

        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={() => toggleWishlist(product)}>
            <Ionicons
              name={isWished ? 'heart' : 'heart-outline'}
              size={22}
              color={isWished ? Colors.sale : Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Gallery Image Pager */}
        <View style={styles.gallery}>
          {product.images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setSelectedImageIndex(index);
              }}
            >
              {product.images.map((imgUri, idx) => (
                <Image
                  key={idx}
                  source={{ uri: imgUri }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.fallbackGallery}>
              <Ionicons name="shirt-outline" size={64} color={Colors.textMuted} />
            </View>
          )}

          {/* Dots */}
          {product.images.length > 1 && (
            <View style={styles.dotsRow}>
              {product.images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, selectedImageIndex === i && styles.activeDot]}
                />
              ))}
            </View>
          )}

          {discountPercent && (
            <View style={styles.salePill}>
              <Text style={styles.salePillText}>SAVE {discountPercent}%</Text>
            </View>
          )}
        </View>

        {/* Product Details Info */}
        <View style={styles.contentPad}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryBadge}>{product.category.toUpperCase()}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color={Colors.warning} />
              <Text style={styles.ratingValue}>{product.rating}</Text>
              <Text style={styles.ratingCount}>({product.reviewCount} reviews)</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>
              ৳{product.price.toLocaleString()}
            </Text>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <Text style={styles.oldPrice}>
                ৳{product.compareAtPrice.toLocaleString()}
              </Text>
            )}
            <View style={styles.inStockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.inStockText}>In Stock</Text>
            </View>
          </View>

          {/* Promo Callout Banner */}
          {product.category === 'T-Shirt' && (
            <View style={styles.promoOfferBox}>
              <Ionicons name="flash" size={16} color={Colors.sale} />
              <Text style={styles.promoOfferText}>
                Bundle Promo: Add any 5 Economy tees for only Tk 1,399!
              </Text>
            </View>
          )}

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Select Size: <Text style={styles.selectedVariant}>{selectedSize}</Text>
                </Text>
                <TouchableOpacity onPress={() => setIsSizeGuideOpen(true)} style={styles.sizeGuideBtn}>
                  <Ionicons name="resize-outline" size={14} color={Colors.accent} />
                  <Text style={styles.sizeGuideText}>Size Chart</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.chipsRow}>
                {product.sizes.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, selectedSize === s && styles.chipActive]}
                    onPress={() => setSelectedSize(s)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, selectedSize === s && styles.chipTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>
                Color: <Text style={styles.selectedVariant}>{selectedColor}</Text>
              </Text>
              <View style={styles.chipsRow}>
                {product.colors.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorChip, selectedColor === c && styles.chipActive]}
                    onPress={() => setSelectedColor(c)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, selectedColor === c && styles.chipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity Stepper */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.stepperRow}>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Ionicons name="remove" size={16} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.stepperCount}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Ionicons name="add" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.deliveryNote}>
                Estimated Delivery: 1-2 Days in Dhaka
              </Text>
            </View>
          </View>

          {/* Tabs: Description & Reviews */}
          <View style={styles.tabHeader}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'desc' && styles.tabBtnActive]}
              onPress={() => setActiveTab('desc')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'desc' && styles.tabBtnTextActive]}>
                Description & Care
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'reviews' && styles.tabBtnActive]}
              onPress={() => setActiveTab('reviews')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'reviews' && styles.tabBtnTextActive]}>
                Reviews ({reviews.length})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'desc' ? (
            <View style={styles.descBlock}>
              <Text style={styles.descText}>
                {product.description ||
                  'Crafted with premium quality combed cotton fabric, designed for all-day comfort and modest presentation. Reinforced collar stitching and durable print finish.'}
              </Text>

              <View style={styles.featurePoints}>
                <View style={styles.pointRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
                  <Text style={styles.pointText}>100% Breathable Combed Cotton</Text>
                </View>
                <View style={styles.pointRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
                  <Text style={styles.pointText}>Pre-shrunk to minimize washing shrinkage</Text>
                </View>
                <View style={styles.pointRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
                  <Text style={styles.pointText}>Modest contemporary cut and drape</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.reviewsBlock}>
              {reviews.map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <Text style={styles.reviewerName}>{r.author}</Text>
                    <View style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < r.rating ? 'star' : 'star-outline'}
                          size={13}
                          color={Colors.warning}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Products */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You May Also Like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
                {related.map((relItem) => (
                  <View key={relItem.id} style={{ width: 170 }}>
                    <ProductCard product={relItem} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Purchase Actions */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name="bag-add-outline" size={18} color={Colors.primary} />
          <Text style={styles.cartButtonText}>Add to Bag</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuyNow}
          activeOpacity={0.88}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      <SizeGuideModal visible={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    maxWidth: 180,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  scrollArea: {
    flex: 1,
  },
  gallery: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.05,
    backgroundColor: Colors.surfaceVariant,
    position: 'relative',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.05,
  },
  fallbackGallery: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  activeDot: {
    width: 16,
    backgroundColor: Colors.accent,
  },
  salePill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.sale,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  salePillText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  contentPad: {
    padding: Spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 15,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
    marginLeft: 'auto',
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  inStockText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
  },
  promoOfferBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.saleSubtle,
    borderWidth: 1,
    borderColor: 'rgba(219, 18, 21, 0.2)',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    gap: 8,
    marginBottom: Spacing.md,
  },
  promoOfferText: {
    fontSize: 12,
    color: Colors.sale,
    fontWeight: '700',
    flex: 1,
  },
  sectionBlock: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  selectedVariant: {
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  sizeGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeGuideText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 4,
  },
  chip: {
    minWidth: 44,
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  colorChip: {
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: Colors.background,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.textInverse,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stepperCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    minWidth: 28,
    textAlign: 'center',
  },
  deliveryNote: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: Spacing.md,
  },
  tabBtn: {
    paddingVertical: 10,
    marginRight: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: Colors.accent,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabBtnTextActive: {
    color: Colors.accent,
  },
  descBlock: {
    paddingVertical: Spacing.md,
  },
  descText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  featurePoints: {
    gap: 6,
    marginTop: Spacing.xs,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointText: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  reviewsBlock: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  relatedSection: {
    marginTop: Spacing.lg,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  relatedScroll: {
    gap: Spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.sm,
    ...Shadows.lg,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    gap: 6,
  },
  cartButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  buyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: Radius.sm,
  },
  buyButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});
