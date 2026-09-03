import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
import { useApp } from '../store/AppContext';
import { APP_CONFIG } from '../constants/config';

interface ProductCardProps {
  product: Product;
  cardWidth?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, cardWidth }) => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const isWished = isInWishlist(product.id);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = () => {
    addToCart(product);
  };

  const imageUrl = product.images.length > 0 ? product.images[0] : null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        cardWidth ? { width: cardWidth, flex: 0 } : null,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.94}
        accessibilityLabel={`View ${product.title}`}
      >
        {/* Highlighted Photo Showcase Frame */}
        <View style={styles.imageFrame}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.fallbackImage}>
              <Ionicons name="shirt-outline" size={38} color={Colors.textMuted} />
            </View>
          )}

          {/* Floating Badges */}
          {discountPercent ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          ) : product.isNew ? (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          ) : null}

          {/* Wishlist Heart Toggle */}
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={() => toggleWishlist(product)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Ionicons
              name={isWished ? 'heart' : 'heart-outline'}
              size={17}
              color={isWished ? Colors.sale : Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Product Information */}
        <View style={styles.info}>
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.warning} />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount})</Text>
          </View>

          {/* Price & Add CTA */}
          <View style={styles.bottomRow}>
            <View style={styles.priceCol}>
              <Text style={styles.price}>
                {APP_CONFIG.CURRENCY_SYMBOL} {product.price.toLocaleString()}
              </Text>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <Text style={styles.comparePrice}>
                  {APP_CONFIG.CURRENCY_SYMBOL} {product.compareAtPrice.toLocaleString()}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleQuickAdd}
              activeOpacity={0.8}
              accessibilityLabel={`Add ${product.title} to cart`}
            >
              <Ionicons name="add" size={18} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceVariant,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.sale,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    ...Shadows.sm,
  },
  discountText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    ...Shadows.sm,
  },
  newBadgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  info: {
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 9,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 17,
    minHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
  },
  priceCol: {
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  comparePrice: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: Colors.accent,
    width: 30,
    height: 30,
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
});
