import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Banner } from '../types';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';

interface BannerCarouselProps {
  banners: Banner[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;
const BANNER_HEIGHT = 160;

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bannerCard}
            activeOpacity={0.9}
            onPress={() => handleBannerPress(item)}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {/* Gradient-like dark overlay */}
            <View style={styles.overlay}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <View style={styles.shopNowBtn}>
                <Text style={styles.shopNowText}>Shop Now →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i && styles.activeDot,
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
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
    position: 'relative',
    ...Shadows.md,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 24, 40, 0.55)',
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tagBadge: {
    backgroundColor: Colors.sale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    marginBottom: 6,
  },
  tagText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  shopNowBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  shopNowText: {
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
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.borderStrong,
  },
  activeDot: {
    width: 18,
    backgroundColor: Colors.accent,
  },
});
