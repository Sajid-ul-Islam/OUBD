import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { BannerCarousel } from '../../components/BannerCarousel';
import { CategoryPills } from '../../components/CategoryPills';
import { ProductCard } from '../../components/ProductCard';
import { CategoryShowcaseSection } from '../../components/CategoryShowcaseSection';
import { AnimatedFadeIn } from '../../components/AnimatedFadeIn';
import { productService } from '../../services/products/productService';
import { Product, Banner } from '../../types';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';

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

const CATEGORY_SHOWCASES = [
  {
    id: 'panjabi-thobe',
    title: 'Royal Panjabi & Emirati Thobes',
    subtitle: 'Fine Egyptian combed cotton with luxury collar embroidery',
    badge: 'LUXURY SUNNAH WEAR',
    badgeColor: Colors.accent,
    coverPhoto: 'https://oneummahbd.shop/cdn/shop/files/premium-panjabi-banner.png?v=1778589962&width=1920',
    categories: ['PANJABI', 'Thobe'],
    targetCategory: 'PANJABI',
  },
  {
    id: 'dawah-tshirts',
    title: 'Dawah Concept Streetwear',
    subtitle: 'Heavyweight 220+ GSM cotton • Buy 5 Combo @ ৳1399',
    badge: 'DAWAH STREETWEAR',
    badgeColor: Colors.sale,
    coverPhoto: 'https://oneummahbd.shop/cdn/shop/files/Banner_v2_3.png?v=1778489445&width=1920',
    categories: ['T-Shirt'],
    targetCategory: 'T-Shirt',
  },
  {
    id: 'denim-joggers',
    title: 'Stretch Denim Joggers & Cargo',
    subtitle: 'Classic denim aesthetics with flexible, athletic jogger comfort',
    badge: 'MODEST FIT TWILL',
    badgeColor: Colors.info,
    coverPhoto: 'https://cdn.shopify.com/s/files/1/0708/1289/3263/files/MPfGeKmqbGOSFnYXG8BzPZ2u4EKHw64dWMLAJtZb.webp?v=1778559091',
    categories: ['PANTS'],
    targetCategory: 'PANTS',
  },
  {
    id: 'docker-caps',
    title: 'Authentic Brimless Docker Caps',
    subtitle: 'Brimless Sunnah-inspired silhouette in breathable cotton twill',
    badge: 'SUNNAH HEADWEAR',
    badgeColor: Colors.warning,
    coverPhoto: 'https://oneummahbd.shop/cdn/shop/files/visor-cap-banner.png?v=1778590026&width=1920',
    categories: ['Docker Cap', 'Cap'],
    targetCategory: 'Docker Cap',
  },
  {
    id: 'attar-perfume',
    title: 'Pure Artisanal Attar Oils',
    subtitle: '100% Halal alcohol-free perfume oils with deep lasting sillage',
    badge: '100% NON-ALCOHOLIC',
    badgeColor: Colors.accent,
    coverPhoto: 'https://oneummahbd.shop/cdn/shop/files/Banner_v2_2_3f7dbbed-1222-4aa7-a98b-da88de5f7e50.png?v=1778678354',
    categories: ['Perfume'],
    targetCategory: 'Perfume',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredGridProducts, setFilteredGridProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [bannerData, catalogProducts, gridItems] = await Promise.all([
      productService.getBanners(),
      productService.getProducts(),
      productService.getProducts({ category: selectedCategory }),
    ]);

    setBanners(bannerData);
    setAllProducts(catalogProducts);
    setFilteredGridProducts(gridItems);
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

  const getProductsForShowcase = (categories: string[]) => {
    return allProducts.filter((p) =>
      categories.some((cat) => p.category.toLowerCase() === cat.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      {/* Edge-to-edge status bar Header with brand logo & notifications */}
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
        {/* Animated Announcement Ticker Bar */}
        <AnimatedFadeIn delay={100} duration={350}>
          <TouchableOpacity
            style={styles.tickerBar}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/categories',
                params: { category: 'T-Shirt' },
              })
            }
          >
            <View style={styles.tickerInner}>
              <Ionicons name="flash" size={13} color={Colors.textInverse} />
              <Text style={styles.tickerText}>
                Buy 5 Economy T-Shirts For 1399 Tk Only! Limited Time Offer
              </Text>
              <Ionicons name="chevron-forward" size={13} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>
        </AnimatedFadeIn>

        {/* Hero Campaign Banners Carousel */}
        {banners.length > 0 && (
          <AnimatedFadeIn delay={150} duration={400}>
            <BannerCarousel banners={banners} />
          </AnimatedFadeIn>
        )}

        {/* Signature Dawah Series Showcase */}
        <AnimatedFadeIn delay={200} duration={400}>
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
        </AnimatedFadeIn>

        {/* Dynamic Category Showcases with Authentic Cover Photos */}
        <View style={styles.showcaseMasterSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Category Collections</Text>
            <Text style={styles.sectionSubtitle}>
              Authentic Sunnah apparel crafted with premium materials
            </Text>
          </View>

          {CATEGORY_SHOWCASES.map((showcase) => {
            const showcaseProducts = getProductsForShowcase(showcase.categories);
            return (
              <CategoryShowcaseSection
                key={showcase.id}
                title={showcase.title}
                subtitle={showcase.subtitle}
                badge={showcase.badge}
                badgeColor={showcase.badgeColor}
                coverPhoto={showcase.coverPhoto}
                targetCategory={showcase.targetCategory}
                products={showcaseProducts}
              />
            );
          })}
        </View>

        {/* Interactive Filter Grid */}
        <AnimatedFadeIn delay={250} duration={400}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>All Products & New Drops</Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/categories')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.seeAllText}>Browse Catalog →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Filter instantly by category with smooth transitions
            </Text>
          </View>

          <CategoryPills
            categories={CATEGORY_NAMES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </AnimatedFadeIn>

        {/* Product Showcase Grid with Transition Animations */}
        <View style={styles.gridContainer}>
          {filteredGridProducts.map((item, idx) => (
            <View key={item.id} style={styles.gridItem}>
              <AnimatedFadeIn delay={Math.min(idx * 30, 250)} duration={300}>
                <ProductCard product={item} />
              </AnimatedFadeIn>
            </View>
          ))}
        </View>

        {/* Showrooms Teaser Banner */}
        <AnimatedFadeIn delay={300} duration={400}>
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
                  Bashundhara City • Uttara • Sylhet • Chattogram & More
                </Text>
              </View>
            </View>
            <View style={styles.showroomTeaserButton}>
              <Text style={styles.showroomTeaserBtnText}>Outlets</Text>
            </View>
          </TouchableOpacity>
        </AnimatedFadeIn>

        {/* Trust Badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.accent} />
            <Text style={styles.trustTitle}>100% Halal Lifestyle</Text>
            <Text style={styles.trustSub}>Alcohol-free & Modest</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="cube" size={18} color={Colors.accent} />
            <Text style={styles.trustTitle}>Cash on Delivery</Text>
            <Text style={styles.trustSub}>Pay upon delivery</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="repeat" size={18} color={Colors.accent} />
            <Text style={styles.trustTitle}>Easy Exchange</Text>
            <Text style={styles.trustSub}>7-day hassle-free</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
  },
  tickerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tickerText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
  },
  seriesScroll: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  seriesCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: 135,
    ...Shadows.sm,
  },
  seriesIconCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  seriesLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  seriesDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  showcaseMasterSection: {
    marginTop: Spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  gridItem: {
    width: '48.5%',
  },
  showroomsTeaser: {
    marginHorizontal: Spacing.md,
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
    gap: Spacing.sm,
    flex: 1,
  },
  showroomIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showroomTeaserText: {
    flex: 1,
  },
  showroomTeaserTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  showroomTeaserSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  showroomTeaserButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    marginLeft: Spacing.xs,
  },
  showroomTeaserBtnText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  trustRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
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
    fontSize: 10,
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
});
