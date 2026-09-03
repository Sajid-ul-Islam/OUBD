import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius, Shadows } from '../constants/theme';
import { useApp } from '../store/AppContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showSearch = true,
  showActions = true,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartCount, wishlist } = useApp();

  return (
    <View style={[styles.wrapper, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.bar}>
        {/* Left: Back Button or Actual Brand Logo */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.actionBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              style={styles.logoBtn}
              activeOpacity={0.85}
              accessibilityLabel="One Ummah BD Home"
            >
              <Image
                source={require('../../assets/images/oubd-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          {title && (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {/* Right Actions: Search, Wishlist (Kept in Header), Cart */}
        {showActions && (
          <View style={styles.rightContainer}>
            {showSearch && (
              <TouchableOpacity
                onPress={() => router.push('/search')}
                style={styles.actionBtn}
                accessibilityLabel="Search"
              >
                <Ionicons name="search-outline" size={21} color={Colors.primary} />
              </TouchableOpacity>
            )}

            {/* Wishlist Icon in Header */}
            <TouchableOpacity
              onPress={() => router.push('/wishlist')}
              style={styles.actionBtn}
              accessibilityLabel="Wishlist"
            >
              <Ionicons
                name={wishlist.length > 0 ? 'heart' : 'heart-outline'}
                size={22}
                color={wishlist.length > 0 ? Colors.sale : Colors.primary}
              />
              {wishlist.length > 0 && (
                <View style={[styles.badge, { backgroundColor: Colors.sale }]}>
                  <Text style={styles.badgeText}>{wishlist.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Cart Icon in Header */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/cart')}
              style={styles.actionBtn}
              accessibilityLabel="Cart"
            >
              <Ionicons name="bag-handle-outline" size={21} color={Colors.primary} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
    zIndex: 20,
    ...Shadows.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.xs,
  },
  logoBtn: {
    justifyContent: 'center',
  },
  logoImage: {
    width: 140,
    height: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
    flexShrink: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: '800',
  },
});
