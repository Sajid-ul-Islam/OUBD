import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius, Shadows } from '../constants/theme';
import { useApp } from '../store/AppContext';
import { APP_CONFIG } from '../constants/config';

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
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.content}>
        {/* Left Section: Back Button or Brand Logo */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
              accessibilityLabel="Go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              style={styles.logoRow}
              activeOpacity={0.8}
            >
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>OUBD</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>ONE UMMAH BD</Text>
                <Text style={styles.brandSlogan}>Spread Dawah, Look Good!</Text>
              </View>
            </TouchableOpacity>
          )}

          {title && <Text style={styles.title}>{title}</Text>}
        </View>

        {/* Right Section: Search, Wishlist & Cart */}
        {showActions && (
          <View style={styles.rightSection}>
            {showSearch && (
              <TouchableOpacity
                onPress={() => router.push('/search')}
                style={styles.iconButton}
                accessibilityLabel="Search products"
              >
                <Ionicons name="search-outline" size={22} color={Colors.primary} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/wishlist')}
              style={styles.iconButton}
              accessibilityLabel="View Wishlist"
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

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/cart')}
              style={styles.iconButton}
              accessibilityLabel="View Cart"
            >
              <Ionicons name="bag-handle-outline" size={22} color={Colors.primary} />
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
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    ...Shadows.sm,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  logoBadgeText: {
    color: Colors.textInverse,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  brandSlogan: {
    fontSize: 10,
    color: Colors.accent,
    fontWeight: '600',
  },
  title: {
    ...Typography.title,
    marginLeft: Spacing.sm,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
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
    fontWeight: '700',
  },
});
