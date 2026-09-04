import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

interface HeroMotionExperienceProps {
  onExplorePress?: () => void;
  onWatchVideoPress?: () => void;
}

export const HeroMotionExperience: React.FC<HeroMotionExperienceProps> = ({
  onExplorePress,
  onWatchVideoPress,
}) => {
  const router = useRouter();
  const [isPlayingMotion, setIsPlayingMotion] = useState(true);

  // Animated pulse and zoom for motion hero
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const badgeFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle ambient breathing motion
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(badgeFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShopNow = () => {
    if (onExplorePress) {
      onExplorePress();
    } else {
      router.push({
        pathname: '/(tabs)/categories',
        params: { category: 'PANJABI' },
      });
    }
  };

  const handleWatchVideo = () => {
    if (onWatchVideoPress) {
      onWatchVideoPress();
    } else {
      router.push({
        pathname: '/(tabs)/categories',
        params: { category: 'T-Shirt' },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroFrame}>
        {/* Animated Visual Motion Backdrop */}
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              transform: [{ scale: isPlayingMotion ? pulseAnim : 1 }],
            },
          ]}
        >
          <Image
            source={{
              uri: 'https://oneummahbd.shop/cdn/shop/files/premium-panjabi-banner.png?v=1778589962&width=1920',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Dark Cinematic Gradient Overlay */}
        <View style={styles.overlay} />

        {/* Top Badges */}
        <Animated.View style={[styles.topRow, { opacity: badgeFadeAnim }]}>
          <View style={styles.liveBadge}>
            <View style={styles.pulsingRedDot} />
            <Text style={styles.liveText}>NEW SEASON 2026</Text>
          </View>

          <TouchableOpacity
            style={styles.motionToggleBtn}
            onPress={() => setIsPlayingMotion(!isPlayingMotion)}
            activeOpacity={0.8}
            accessibilityLabel="Toggle motion"
          >
            <Ionicons
              name={isPlayingMotion ? 'pause' : 'play'}
              size={12}
              color={Colors.textInverse}
            />
            <Text style={styles.motionToggleText}>
              {isPlayingMotion ? 'Motion Active' : 'Paused'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Content Box */}
        <View style={styles.content}>
          <View style={styles.sloganRow}>
            <Text style={styles.brandBadge}>SPREAD DAWAH, LOOK GOOD</Text>
          </View>

          <Text style={styles.heroTitle}>
            Crafted for the Ummah
          </Text>
          <Text style={styles.heroSubtitle}>
            Modest cuts, authentic Sunnah silhouettes & premium breathable Egyptian cotton.
          </Text>

          {/* Action CTAs */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCta}
              activeOpacity={0.88}
              onPress={handleShopNow}
            >
              <Text style={styles.primaryCtaText}>Shop New Drop</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryCta}
              activeOpacity={0.88}
              onPress={handleWatchVideo}
            >
              <Ionicons name="play-circle" size={18} color={Colors.textInverse} />
              <Text style={styles.secondaryCtaText}>View Lookbook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Feature Micro-Strip */}
        <View style={styles.microStrip}>
          <View style={styles.stripItem}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.accent} />
            <Text style={styles.stripText}>100% Halal Materials</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Ionicons name="airplane" size={12} color={Colors.accent} />
            <Text style={styles.stripText}>Free Delivery over ৳3,000</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Ionicons name="storefront" size={12} color={Colors.accent} />
            <Text style={styles.stripText}>15+ BD Outlets</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  heroFrame: {
    height: 250,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
    position: 'relative',
    justifyContent: 'space-between',
    ...Shadows.md,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFill,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 24, 40, 0.58)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    zIndex: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 6,
  },
  pulsingRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.sale,
  },
  liveText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  motionToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  motionToggleText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: Spacing.md,
    zIndex: 2,
  },
  sloganRow: {
    marginBottom: 4,
  },
  brandBadge: {
    color: '#05AE7A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    lineHeight: 16,
    maxWidth: '95%',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    gap: 6,
    ...Shadows.sm,
  },
  primaryCtaText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    gap: 6,
  },
  secondaryCtaText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  microStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 24, 40, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 2,
  },
  stripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stripText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9,
    fontWeight: '600',
  },
  stripDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
