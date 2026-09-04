import React, { useEffect, useState } from 'react';
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
import {
  socialService,
  SocialAccount,
  SocialStory,
  SocialReel,
} from '../services/social/socialService';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import { AnimatedFadeIn } from './AnimatedFadeIn';

export const ShoppableSocialSection: React.FC = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [reels, setReels] = useState<SocialReel[]>([]);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    const [accData, storyData, reelData] = await Promise.all([
      socialService.getOfficialAccounts(),
      socialService.getStories(),
      socialService.getReels(),
    ]);
    setAccounts(accData);
    setStories(storyData);
    setReels(reelData);
  };

  const handleStoryPress = (story: SocialStory) => {
    if (story.taggedProductId) {
      router.push(`/product/${story.taggedProductId}`);
    }
  };

  const handleReelPress = (reel: SocialReel) => {
    socialService.openExternalUrl(reel.permalink);
  };

  const handleShopProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <View style={styles.container}>
      {/* 1. Official Community Stories Carousel */}
      <View style={styles.storiesHeader}>
        <Text style={styles.sectionTitle}>Ummah Stories</Text>
        <Text style={styles.sectionSubtitle}>Daily styling & product showcases</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesScroll}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            activeOpacity={0.85}
            onPress={() => handleStoryPress(story)}
          >
            <View
              style={[
                styles.storyRing,
                story.hasUnseen ? styles.storyRingActive : styles.storyRingSeen,
              ]}
            >
              <Image source={{ uri: story.thumbnail }} style={styles.storyAvatar} />
              {story.badge && (
                <View style={styles.storyBadge}>
                  <Text style={styles.storyBadgeText}>{story.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.storyTitle} numberOfLines={1}>
              {story.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 2. Official Social Follow Action Bar */}
      <View style={styles.socialFollowBar}>
        <View style={styles.followHeader}>
          <Ionicons name="people" size={18} color={Colors.accent} />
          <Text style={styles.followTitle}>Join 600K+ Brothers in Faith</Text>
        </View>

        <View style={styles.followButtons}>
          <TouchableOpacity
            style={[styles.followBtn, styles.fbBtn]}
            activeOpacity={0.85}
            onPress={() => socialService.openSocialProfile('facebook')}
          >
            <Ionicons name="logo-facebook" size={16} color={Colors.textInverse} />
            <Text style={styles.followBtnText}>Facebook (485K)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.followBtn, styles.instaBtn]}
            activeOpacity={0.85}
            onPress={() => socialService.openSocialProfile('instagram')}
          >
            <Ionicons name="logo-instagram" size={16} color={Colors.textInverse} />
            <Text style={styles.followBtnText}>Instagram (135K)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Shoppable Reels & Motion Feed */}
      <View style={styles.reelsHeader}>
        <View>
          <Text style={styles.sectionTitle}>Shoppable Reels & Videos</Text>
          <Text style={styles.sectionSubtitle}>
            Watch styling tips & tap tagged items to buy directly
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reelsScroll}
      >
        {reels.map((reel, idx) => (
          <AnimatedFadeIn key={reel.id} delay={idx * 60} duration={350}>
            <View style={styles.reelCard}>
              {/* Video Thumbnail with Badges */}
              <TouchableOpacity
                activeOpacity={0.92}
                style={styles.thumbnailContainer}
                onPress={() => handleReelPress(reel)}
              >
                <Image
                  source={{ uri: reel.thumbnailUrl }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
                <View style={styles.darkGradientOverlay} />

                {/* Duration & Platform Badge */}
                <View style={styles.reelTopRow}>
                  <View style={styles.platformBadge}>
                    <Ionicons
                      name={reel.platform === 'instagram' ? 'logo-instagram' : 'logo-facebook'}
                      size={12}
                      color={Colors.textInverse}
                    />
                    <Text style={styles.platformText}>
                      {reel.platform === 'instagram' ? 'Reel' : 'Watch'}
                    </Text>
                  </View>

                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{reel.duration}</Text>
                  </View>
                </View>

                {/* Center Play Button Overlay */}
                <View style={styles.centerPlayBox}>
                  <View style={styles.playCircle}>
                    <Ionicons name="play" size={20} color={Colors.textInverse} />
                  </View>
                </View>

                {/* Engagement Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="eye-outline" size={13} color={Colors.textInverse} />
                    <Text style={styles.statText}>{reel.viewsCount}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="heart-outline" size={13} color={Colors.textInverse} />
                    <Text style={styles.statText}>{reel.likesCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Reel Info */}
              <View style={styles.reelBody}>
                <Text style={styles.reelTitle} numberOfLines={2}>
                  {reel.title}
                </Text>
                <Text style={styles.reelCaption} numberOfLines={2}>
                  {reel.caption}
                </Text>

                {/* 1-Tap Shoppable Tagged Product Box */}
                {reel.taggedProduct && (
                  <TouchableOpacity
                    style={styles.taggedProductPill}
                    activeOpacity={0.88}
                    onPress={() => handleShopProduct(reel.taggedProduct!.id)}
                  >
                    <Image
                      source={{ uri: reel.taggedProduct.image }}
                      style={styles.taggedThumb}
                    />
                    <View style={styles.taggedDetails}>
                      <Text style={styles.taggedTag}>TAGGED PRODUCT</Text>
                      <Text style={styles.taggedTitle} numberOfLines={1}>
                        {reel.taggedProduct.title}
                      </Text>
                      <Text style={styles.taggedPrice}>
                        {APP_CONFIG.CURRENCY_SYMBOL} {reel.taggedProduct.price.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.shopBtnCircle}>
                      <Ionicons name="bag-handle" size={14} color={Colors.textInverse} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </AnimatedFadeIn>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  storiesHeader: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  storiesScroll: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2.5,
    borderWidth: 2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRingActive: {
    borderColor: Colors.accent,
  },
  storyRingSeen: {
    borderColor: Colors.borderStrong,
  },
  storyAvatar: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
  },
  storyBadge: {
    position: 'absolute',
    bottom: -3,
    backgroundColor: Colors.sale,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: Radius.xs,
  },
  storyBadgeText: {
    color: Colors.textInverse,
    fontSize: 8,
    fontWeight: '800',
  },
  storyTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 6,
    textAlign: 'center',
  },
  socialFollowBar: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  followHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  followTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  followButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  followBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radius.sm,
    gap: 6,
  },
  fbBtn: {
    backgroundColor: '#1877F2',
  },
  instaBtn: {
    backgroundColor: '#E1306C',
  },
  followBtnText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  reelsHeader: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  reelsScroll: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  reelCard: {
    width: 250,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  thumbnailContainer: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.primary,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  darkGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 24, 40, 0.45)',
  },
  reelTopRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  platformText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  durationBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  durationText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  centerPlayBox: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(5, 174, 122, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
    ...Shadows.md,
  },
  statsRow: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  reelBody: {
    padding: Spacing.md,
  },
  reelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  reelCaption: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  taggedProductPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    padding: 6,
    gap: 8,
    ...Shadows.sm,
  },
  taggedThumb: {
    width: 44,
    height: 44,
    borderRadius: Radius.xs,
    backgroundColor: Colors.surfaceVariant,
  },
  taggedDetails: {
    flex: 1,
  },
  taggedTag: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  taggedTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  taggedPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  shopBtnCircle: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
