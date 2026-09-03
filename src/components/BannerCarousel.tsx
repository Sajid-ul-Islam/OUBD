import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Banner } from '../types';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';

interface BannerCarouselProps {
  banners: Banner[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - Spacing.md * 2;
const BANNER_HEIGHT = 185;

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleBannerPress = (banner: Banner) => {
    if (banner.targetCategory) {
      router.push({
        pathname: '/(tabs)/categories',
        params: { category: banner.targetCategory },
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + Spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (BANNER_WIDTH + Spacing.sm)
          );
          setActiveIndex(index);
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isActive = activeIndex === index;

          return (
            <TouchableOpacity
              style={[styles.bannerCard, isActive && styles.bannerCardActive]}
              activeOpacity={0.92}
              onPress={() => handleBannerPress(item)}
            >
              {/* Highlighted Cover Photo with Gentle Ken-Burns Animation */}
              <Animated.View
                style={[
                  styles.imageWrapper,
                  isActive && { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </Animated.View>

              {/* Aesthetic Vignette & Frosted Gradient Overlay */}
              <View style={styles.gradientOverlay}>
                <View style={styles.topRow}>
                  <View style={styles.glassTag}>
                    <View style={styles.tagDot} />
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                </View>

                <View style={styles.bottomContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                  <View style={styles.ctaButton}>
                    <Text style={styles.ctaText}>Explore Collection →</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Animated Dot Indicators */}
      <View style={styles.pagination}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.md,
  },
  bannerCardActive: {
    borderColor: 'rgba(5, 174, 122, 0.4)',
  },
  imageWrapper: {
    ...StyleSheet.absoluteFill,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 24, 40, 0.45)',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glassTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 24, 40, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  tagText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bottomContent: {
    alignItems: 'flex-start',
  },
  title: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
  ctaText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 6,
  },
  dot: {
    height: 5,
    borderRadius: Radius.full,
  },
  activeDot: {
    width: 22,
    backgroundColor: Colors.accent,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: Colors.borderStrong,
  },
});
