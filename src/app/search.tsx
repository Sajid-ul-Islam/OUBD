import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/products/productService';
import { Product } from '../types';
import { Colors, Spacing, Radius } from '../constants/theme';

const TRENDING_KEYWORDS = [
  'Panjabi',
  'Insaf',
  'Drop Shoulder',
  'Denim',
  'Thobe',
  'Docker Cap',
  'Attar',
  'Polo',
];

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(params.q || '');
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    (async () => {
      if (query.trim()) {
        const data = await productService.getProducts({ query });
        setResults(data);
        setHasSearched(true);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    })();
  }, [query]);

  return (
    <View style={styles.container}>
      {/* Top Search Input Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Search Panjabi, T-Shirts, Thobe, Attar..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Trending Suggestions (when query is empty) */}
      {!query && (
        <View style={styles.trendingSection}>
          <Text style={styles.trendingTitle}>Trending Searches</Text>
          <View style={styles.chipsRow}>
            {TRENDING_KEYWORDS.map((kw, i) => (
              <TouchableOpacity
                key={i}
                style={styles.keywordChip}
                onPress={() => setQuery(kw)}
                activeOpacity={0.8}
              >
                <Ionicons name="trending-up" size={13} color={Colors.accent} />
                <Text style={styles.keywordText}>{kw}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Search Results Grid */}
      {query.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardCol}>
              <ProductCard product={item} />
            </View>
          )}
          ListHeaderComponent={
            hasSearched ? (
              <Text style={styles.resultCount}>
                Found {results.length} result(s) for "{query}"
              </Text>
            ) : null
          }
          ListEmptyComponent={
            hasSearched ? (
              <View style={styles.emptyBox}>
                <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No matching products</Text>
                <Text style={styles.emptySub}>
                  Try checking your spelling or search for popular terms like "Panjabi" or "T-Shirt".
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    height: 42,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
  },
  trendingSection: {
    padding: Spacing.lg,
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  keywordText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  resultCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardCol: {
    width: '48.5%',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
  },
});
