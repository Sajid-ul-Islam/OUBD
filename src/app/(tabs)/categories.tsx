import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/products/productService';
import { Product, Collection } from '../../types';
import { Colors, Spacing, Radius } from '../../constants/theme';

export default function CategoriesScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>(params.category || 'all');
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'newest'>('popular');

  useEffect(() => {
    (async () => {
      const col = await productService.getCollections();
      setCollections(col);
    })();
  }, []);

  useEffect(() => {
    if (params.category) {
      setSelectedCat(params.category);
    }
  }, [params.category]);

  useEffect(() => {
    (async () => {
      const p = await productService.getProducts({
        category: selectedCat === 'all' ? undefined : selectedCat,
        sort: sortBy,
      });
      setProducts(p);
    })();
  }, [selectedCat, sortBy]);

  return (
    <View style={styles.container}>
      <Header title="Collections & Categories" showBack={false} />

      {/* Horizontal Category Selector */}
      <View style={styles.catNav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {collections.map((c) => {
            const isSelected =
              selectedCat.toLowerCase() === c.handle.toLowerCase() ||
              selectedCat.toLowerCase() === c.title.toLowerCase() ||
              (selectedCat === 'all' && c.handle === 'all');

            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.catChip, isSelected && styles.catChipActive]}
                onPress={() => setSelectedCat(c.handle === 'all' ? 'all' : c.title)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                  {c.title}
                </Text>
                <View style={[styles.countBadge, isSelected && styles.countBadgeActive]}>
                  <Text style={[styles.countText, isSelected && styles.countTextActive]}>
                    {c.productCount}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort & Count Bar */}
      <View style={styles.sortBar}>
        <Text style={styles.resultCountText}>
          Showing {products.length} Products
        </Text>

        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'popular' && styles.sortBtnActive]}
            onPress={() => setSortBy('popular')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'popular' && styles.sortBtnTextActive]}>
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'price_low' && styles.sortBtnActive]}
            onPress={() => setSortBy('price_low')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'price_low' && styles.sortBtnTextActive]}>
              Price: ৳ Low
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'price_high' && styles.sortBtnActive]}
            onPress={() => setSortBy('price_high')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'price_high' && styles.sortBtnTextActive]}>
              Price: ৳ High
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  catNav: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
  },
  catScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catChipTextActive: {
    color: Colors.textInverse,
  },
  countBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  countTextActive: {
    color: Colors.textInverse,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultCountText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  sortBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    backgroundColor: Colors.surfaceVariant,
  },
  sortBtnActive: {
    backgroundColor: Colors.accent,
  },
  sortBtnText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sortBtnTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48.5%',
  },
});
