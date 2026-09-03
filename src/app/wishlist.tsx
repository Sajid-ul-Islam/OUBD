import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../store/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <View style={styles.container}>
      <Header title="My Saved Wishlist" showBack={true} />

      {wishlist.length === 0 ? (
        <EmptyState
          iconName="heart-outline"
          title="Your Wishlist is Empty"
          description="Explore our authentic modest apparel and tap the heart icon on items you love."
          buttonTitle="Explore Collections"
          onButtonPress={() => router.push('/(tabs)')}
        />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <TouchableOpacity
                onPress={() => router.push(`/product/${item.id}`)}
                style={styles.imageContainer}
                activeOpacity={0.88}
              >
                {item.images.length > 0 ? (
                  <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={styles.imageFallback}>
                    <Ionicons name="shirt-outline" size={32} color={Colors.textMuted} />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.infoArea}>
                <View>
                  <Text style={styles.category}>{item.category.toUpperCase()}</Text>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.price}>
                    {APP_CONFIG.CURRENCY_SYMBOL} {item.price.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.moveBtn}
                    onPress={() => {
                      addToCart(item);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="bag-add-outline" size={16} color={Colors.textInverse} />
                    <Text style={styles.moveBtnText}>Add to Bag</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => toggleWishlist(item)}
                    activeOpacity={0.8}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.sale} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
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
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoArea: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  moveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.xs,
    gap: 4,
  },
  moveBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 6,
  },
});
