import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { AnimatedFadeIn } from './AnimatedFadeIn';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';

interface CategoryShowcaseSectionProps {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  coverPhoto: string;
  targetCategory: string;
  products: Product[];
}

export const CategoryShowcaseSection: React.FC<CategoryShowcaseSectionProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = Colors.accent,
  coverPhoto,
  targetCategory,
  products,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push({
      pathname: '/(tabs)/categories',
      params: { category: targetCategory },
    });
  };

  if (products.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      {/* Category Cover Photo Banner */}
      <AnimatedFadeIn duration={400}>
        <TouchableOpacity
          style={styles.coverCard}
          activeOpacity={0.92}
          onPress={handleNavigate}
        >
          <Image
            source={{ uri: coverPhoto }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          {/* Dark Overlay for readability */}
          <View style={styles.overlay} />

          {/* Banner Text Overlay */}
          <View style={styles.coverContent}>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
            <Text style={styles.coverTitle}>{title}</Text>
            <Text style={styles.coverSubtitle} numberOfLines={2}>
              {subtitle}
            </Text>

            <View style={styles.exploreButton}>
              <Text style={styles.exploreText}>Explore Collection</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.textInverse} />
            </View>
          </View>
        </TouchableOpacity>
      </AnimatedFadeIn>

      {/* Horizontal Transition Product Showcase Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        decelerationRate="fast"
      >
        {products.slice(0, 8).map((product, idx) => (
          <View key={product.id} style={styles.cardContainer}>
            <AnimatedFadeIn delay={Math.min(idx * 50, 250)} duration={350}>
              <ProductCard product={product} cardWidth={168} />
            </AnimatedFadeIn>
          </View>
        ))}

        {/* View All Card at End */}
        <TouchableOpacity
          style={styles.viewAllCard}
          onPress={handleNavigate}
          activeOpacity={0.85}
        >
          <View style={styles.viewAllIconCircle}>
            <Ionicons name="arrow-forward" size={20} color={Colors.accent} />
          </View>
          <Text style={styles.viewAllTitle}>View All</Text>
          <Text style={styles.viewAllCount}>{products.length}+ Items</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: Spacing.sm,
  },
  coverCard: {
    marginHorizontal: Spacing.md,
    height: 155,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 24, 40, 0.52)',
  },
  coverContent: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    marginBottom: 6,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  coverTitle: {
    color: Colors.textInverse,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  coverSubtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 8,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  horizontalScroll: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  cardContainer: {
    width: 168,
  },
  viewAllCard: {
    width: 130,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    borderStyle: 'dashed',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    alignSelf: 'stretch',
  },
  viewAllIconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  viewAllTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  viewAllCount: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
