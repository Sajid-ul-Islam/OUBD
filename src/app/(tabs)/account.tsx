import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { useApp } from '../../store/AppContext';
import { authService } from '../../services/auth/authService';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export default function AccountScreen() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout, orders } = useApp();

  const handleWhatsAppSupport = () => {
    Linking.openURL(APP_CONFIG.SUPPORT_WHATSAPP).catch(() => {
      Alert.alert('Support Phone', `Call us at ${APP_CONFIG.SUPPORT_PHONE_DISPLAY}`);
    });
  };

  const handleAdminToggle = async () => {
    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      // Demo helper: Log in as admin
      const res = await authService.loginAsAdmin();
      setUser(res.user);
      Alert.alert('Admin Access Granted', 'Switched to Admin Role. You can now access the Store Manager Dashboard.');
      router.push('/admin/dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="My Account" showBack={false} />

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        {isAuthenticated && user ? (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
              ) : (
                <Ionicons name="person" size={28} color={Colors.textInverse} />
              )}
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.name}</Text>
                {user.role === 'admin' && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>ADMIN</Text>
                  </View>
                )}
              </View>
              <Text style={styles.userSub}>{user.phone || user.email || 'OUBD Member'}</Text>
            </View>

            <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
              <Ionicons name="log-out-outline" size={22} color={Colors.sale} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.authBanner}>
            <View style={styles.authBannerText}>
              <Text style={styles.authTitle}>Sign in to One Ummah BD</Text>
              <Text style={styles.authSub}>Track orders, manage addresses & get member discounts</Text>
            </View>
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.88}
            >
              <Text style={styles.signInBtnText}>Sign In / Register</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Admin Dashboard Entry (Role Guarded or Demo Access) */}
        {user?.role === 'admin' && (
          <TouchableOpacity style={styles.adminPanelBtn} onPress={() => router.push('/admin/dashboard')} activeOpacity={0.88}>
            <View style={styles.adminLeft}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.accent} />
              <View>
                <Text style={styles.adminTitle}>Admin Management Panel</Text>
                <Text style={styles.adminSub}>Inventory, sales statistics & order fulfillment</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
          </TouchableOpacity>
        )}

        {/* My Orders Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>My Orders ({orders.length})</Text>
          {orders.map((ord) => (
            <View key={ord.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{ord.id}</Text>
                  <Text style={styles.orderDate}>{new Date(ord.createdAt).toLocaleDateString()}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    ord.status === 'delivered'
                      ? styles.statusDelivered
                      : ord.status === 'processing'
                      ? styles.statusProcessing
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      ord.status === 'delivered'
                        ? styles.statusDeliveredText
                        : ord.status === 'processing'
                        ? styles.statusProcessingText
                        : styles.statusPendingText,
                    ]}
                  >
                    {ord.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItemsPreview}>
                <Text style={styles.orderItemCount}>
                  {ord.items.length} item(s) • Total: ৳{ord.total.toLocaleString()} ({ord.paymentMethod.toUpperCase()})
                </Text>
                <Text style={styles.orderDelivery}>{ord.estimatedDelivery}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Navigation Shortcuts */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Quick Services & Stores</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/store-locator')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="storefront-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuLabel}>Physical Showrooms (15+ Outlets)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleWhatsAppSupport}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="logo-whatsapp" size={20} color={Colors.accent} />
              <Text style={styles.menuLabel}>WhatsApp Customer Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Linking.openURL(`tel:${APP_CONFIG.SUPPORT_PHONE}`)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuLabel}>Customer Hotline ({APP_CONFIG.SUPPORT_PHONE_DISPLAY})</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Demo Switch for Admin Evaluation */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Developer & Prototype Controls</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleAdminToggle}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.menuLabel}>
                {user?.role === 'admin' ? 'Open Admin Control Panel' : 'Demo: Switch to Admin Role'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>One Ummah BD Mobile App v1.0.0 (Production Prototype)</Text>
          <Text style={styles.copyrightText}>© 2026 One Ummah BD. All rights reserved.</Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollArea: {
    flex: 1,
    padding: Spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  adminBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  adminBadgeText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: '800',
  },
  userSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutIcon: {
    padding: 8,
  },
  authBanner: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  authBannerText: {
    marginBottom: Spacing.md,
  },
  authTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  authSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    lineHeight: 18,
  },
  signInBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  signInBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  adminPanelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.accentSubtle,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  adminLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  adminTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  adminSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  menuSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusDelivered: {
    backgroundColor: '#E6F9F0',
  },
  statusDeliveredText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  statusProcessing: {
    backgroundColor: '#EFF8FF',
  },
  statusProcessingText: {
    color: Colors.info,
    fontSize: 10,
    fontWeight: '700',
  },
  statusPending: {
    backgroundColor: '#FEF3F2',
  },
  statusPendingText: {
    color: Colors.sale,
    fontSize: 10,
    fontWeight: '700',
  },
  orderItemsPreview: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  orderItemCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  orderDelivery: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  versionText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  copyrightText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
