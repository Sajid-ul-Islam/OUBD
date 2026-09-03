import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { Colors, Spacing, Typography, Radius, Shadows } from '../constants/theme';
import { useApp } from '../store/AppContext';
import { APP_CONFIG } from '../constants/config';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const isWished = isInWishlist(product.id);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = () => {
    addToCart(product);
  };

  const imageUrl = product.images.length > 0 ? product.images[0] : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
      accessibilityLabel={`View ${product.title}`}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fallbackImage}>
            <Ionicons name="shirt-outline" size={40} color={Colors.textMuted} />
          </View>
        )}

        {/* Discount Badge */}
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
            size={18}
            color={isWished ? Colors.sale : Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Info Container */}
      <View style={styles.info}>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={Colors.warning} />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>

        {/* Price & Action Row */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
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
            accessibilityLabel={`Add ${product.title} to cart`}
          >
            <Ionicons name="add" size={20} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceVariant,
    position: 'relative',
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
  },
  discountText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  newBadgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  info: {
    padding: Spacing.sm,
    justifyContent: 'space-between',
    flex: 1,
  },
  category: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    paddingTop: 4,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  comparePrice: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: Colors.accent,
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
