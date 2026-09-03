import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { BannerCarousel } from '../../components/BannerCarousel';
import { CategoryPills } from '../../components/CategoryPills';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/products/productService';
import { Product, Banner } from '../../types';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../constants/theme';
import { useApp } from '../../store/AppContext';

const CATEGORY_NAMES = [
  'All',
  'T-Shirt',
  'PANJABI',
  'Thobe',
  'PANTS',
  'Shirt',
  'Docker Cap',
  'Perfume',
];

const SERIES_TAGS = [
  { label: 'INSAF', desc: 'Justice & Integrity', icon: 'shield-checkmark-outline' },
  { label: 'MUSAFIR', desc: 'Traveler Mindset', icon: 'compass-outline' },
  { label: 'SABR', desc: 'Patience & Fortitude', icon: 'heart-half-outline' },
  { label: 'ZUHD', desc: 'Simplicity in Faith', icon: 'leaf-outline' },
  { label: 'CYCLE LIFE', desc: 'Journey through Dunya', icon: 'bicycle-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { openAIChat } = useApp();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [bannerData, allProducts] = await Promise.all([
      productService.getBanners(),
      productService.getProducts({ category: selectedCategory }),
    ]);

    setBanners(bannerData);
    setProducts(allProducts);
    setBestSellers(allProducts.filter((p) => p.isBestSeller).slice(0, 6));
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSeriesPress = (seriesLabel: string) => {
    router.push({
      pathname: '/search',
      params: { q: seriesLabel },
    });
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.accent]}
            tintColor={Colors.accent}
          />
        }
      >
        {/* Announcement Ticker Bar */}
        <TouchableOpacity
          style={styles.tickerBar}
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/(tabs)/categories', params: { category: 'T-Shirt' } })}
        >
          <Ionicons name="flash" size={14} color={Colors.textInverse} />
          <Text style={styles.tickerText}>
            ⚡ Buy 5 Economy T-Shirts For 1399 Tk Only! Limited Time Offer
          </Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textInverse} />
        </TouchableOpacity>

        {/* Hero Banners */}
        {banners.length > 0 && <BannerCarousel banners={banners} />}

        {/* Series Combos Horizontal Showcase */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Signature Dawah Series</Text>
          <Text style={styles.sectionSubtitle}>Concept wear inspired by Islamic virtues</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.seriesScroll}
        >
          {SERIES_TAGS.map((s, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.seriesCard}
              activeOpacity={0.85}
              onPress={() => handleSeriesPress(s.label)}
            >
              <View style={styles.seriesIconCircle}>
                <Ionicons name={s.icon as any} size={20} color={Colors.accent} />
              </View>
              <Text style={styles.seriesLabel}>{s.label}</Text>
              <Text style={styles.seriesDesc}>{s.desc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Pills Filter */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Explore Catalog</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/categories')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.seeAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <CategoryPills
          categories={CATEGORY_NAMES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Filtered Products Grid (2 Columns) */}
        <View style={styles.gridContainer}>
          {products.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <ProductCard product={item} />
            </View>
          ))}
        </View>

        {/* Showrooms Teaser Banner */}
        <TouchableOpacity
          style={styles.showroomsTeaser}
          activeOpacity={0.9}
          onPress={() => router.push('/store-locator')}
        >
          <View style={styles.showroomTeaserContent}>
            <View style={styles.showroomIconBox}>
              <Ionicons name="storefront" size={24} color={Colors.accent} />
            </View>
            <View style={styles.showroomTeaserText}>
              <Text style={styles.showroomTeaserTitle}>Visit Our 15+ Showrooms</Text>
              <Text style={styles.showroomTeaserSub}>
                Dhaka • Sylhet • Chattogram • Khulna • Rajshahi & More
              </Text>
            </View>
          </View>
          <View style={styles.showroomTeaserButton}>
            <Text style={styles.showroomTeaserBtnText}>Find Outlet</Text>
          </View>
        </TouchableOpacity>

        {/* Trust Badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.accent} />
            <Text style={styles.trustTitle}>100% Halal Lifestyle</Text>
            <Text style={styles.trustSub}>Alcohol-free & Modest</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="cube" size={20} color={Colors.accent} />
            <Text style={styles.trustTitle}>Cash on Delivery</Text>
            <Text style={styles.trustSub}>Pay upon package receipt</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="repeat" size={20} color={Colors.accent} />
            <Text style={styles.trustTitle}>Easy Exchange</Text>
            <Text style={styles.trustSub}>7-day hassle-free swap</Text>
          </View>
        </View>

        {/* Spacing for bottom tab bar */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating AI Shopping Assistant ("Ummah Bot") FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.88}
        onPress={openAIChat}
        accessibilityLabel="Chat with Ummah Bot AI Assistant"
      >
        <Ionicons name="sparkles" size={20} color={Colors.textInverse} />
        <Text style={styles.fabText}>Ummah Bot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  tickerBar: {
    backgroundColor: Colors.sale,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  tickerText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
  },
  seriesScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  seriesCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: 140,
    ...Shadows.sm,
  },
  seriesIconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  seriesLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  seriesDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  gridItem: {
    width: '48.5%',
  },
  showroomsTeaser: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.md,
  },
  showroomTeaserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  showroomIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showroomTeaserText: {
    flex: 1,
  },
  showroomTeaserTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  showroomTeaserSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  showroomTeaserButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    marginLeft: Spacing.sm,
  },
  showroomTeaserBtnText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  trustRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.md,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  trustSub: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    gap: 6,
    ...Shadows.lg,
    zIndex: 99,
  },
  fabText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
});
