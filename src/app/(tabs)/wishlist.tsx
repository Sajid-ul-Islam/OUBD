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
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { useApp } from '../../store/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <View style={styles.container}>
      <Header title="My Wishlist" showBack={false} />

      {wishlist.length === 0 ? (
        <EmptyState
          iconName="heart-outline"
          title="Your Wishlist is Empty"
          description="Explore our authentic modest apparel and save your favorite Dawah pieces for later."
          buttonTitle="Explore Products"
          onButtonPress={() => router.push('/(tabs)')}
        />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <TouchableOpacity
                onPress={() => router.push(`/product/${item.id}`)}
                style={styles.imageContainer}
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
                <Text style={styles.category}>{item.category.toUpperCase()}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.price}>
                  {APP_CONFIG.CURRENCY_SYMBOL} {item.price.toLocaleString()}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.moveBtn}
                    onPress={() => addToCart(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="bag-add-outline" size={16} color={Colors.textInverse} />
                    <Text style={styles.moveBtnText}>Add to Cart</Text>
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
    width: 90,
    height: 90,
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
    color: Colors.textMuted,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
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
    marginTop: 4,
  },
  moveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
