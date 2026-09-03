import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../store/AppContext';
import { orderService } from '../../services/orders/orderService';
import { Order } from '../../types';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, refreshOrders } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<'orders' | 'inventory' | 'promos'>('orders');

  // Role Guard: Customers are strictly forbidden from viewing the admin panel
  useEffect(() => {
    if (user?.role !== 'admin') {
      Alert.alert('Access Denied', 'Admin privileges required to view this section.');
      router.replace('/(tabs)');
    }
  }, [user]);

  const loadOrders = async () => {
    const data = await orderService.getOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, currentStatus: Order['status']) => {
    let nextStatus: Order['status'] = 'processing';
    if (currentStatus === 'pending') nextStatus = 'processing';
    else if (currentStatus === 'processing') nextStatus = 'shipped';
    else if (currentStatus === 'shipped') nextStatus = 'delivered';
    else nextStatus = 'pending';

    await orderService.updateOrderStatus(orderId, nextStatus);
    await loadOrders();
    await refreshOrders();
    Alert.alert('Order Updated', `Order ${orderId} transitioned to ${nextStatus.toUpperCase()}`);
  };

  if (user?.role !== 'admin') {
    return null;
  }

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0) + 1284500;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerLeft}>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
          <Text style={styles.headerTitle}>Store Manager Control</Text>
        </View>

        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => router.replace('/(tabs)/account')}
          activeOpacity={0.8}
        >
          <Ionicons name="exit-outline" size={18} color={Colors.textInverse} />
          <Text style={styles.exitBtnText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* KPI Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Revenue (BDT)</Text>
            <Text style={styles.metricValue}>৳{totalSales.toLocaleString()}</Text>
            <Text style={styles.metricGrowth}>+14.2% this month</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active Orders</Text>
            <Text style={styles.metricValue}>{orders.length + 84}</Text>
            <Text style={styles.metricPending}>
              {orders.filter((o) => o.status === 'pending').length} Pending Dispatch
            </Text>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'orders' && styles.tabActive]}
            onPress={() => setSelectedTab('orders')}
          >
            <Text style={[styles.tabText, selectedTab === 'orders' && styles.tabTextActive]}>
              Order Fulfillment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'inventory' && styles.tabActive]}
            onPress={() => setSelectedTab('inventory')}
          >
            <Text style={[styles.tabText, selectedTab === 'inventory' && styles.tabTextActive]}>
              Showroom Stock
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'promos' && styles.tabActive]}
            onPress={() => setSelectedTab('promos')}
          >
            <Text style={[styles.tabText, selectedTab === 'promos' && styles.tabTextActive]}>
              Promotions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Orders Fulfillment */}
        {selectedTab === 'orders' && (
          <View style={styles.ordersList}>
            <Text style={styles.sectionTitle}>Recent Customer Orders</Text>
            {orders.map((ord) => (
              <View key={ord.id} style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <View>
                    <Text style={styles.orderId}>{ord.id}</Text>
                    <Text style={styles.customerName}>{ord.shippingAddress.fullName}</Text>
                    <Text style={styles.customerPhone}>{ord.shippingAddress.phone}</Text>
                  </View>
                  <View style={styles.statusCol}>
                    <View
                      style={[
                        styles.statusPill,
                        ord.status === 'delivered'
                          ? styles.pillDelivered
                          : ord.status === 'processing'
                          ? styles.pillProcessing
                          : styles.pillPending,
                      ]}
                    >
                      <Text style={styles.statusPillText}>{ord.status.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.orderTotal}>৳{ord.total.toLocaleString()}</Text>
                  </View>
                </View>

                <View style={styles.addressLine}>
                  <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.addressText} numberOfLines={1}>
                    {ord.shippingAddress.address}, {ord.shippingAddress.city}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <Text style={styles.payMethod}>
                    Payment: {ord.paymentMethod.toUpperCase()}
                  </Text>
                  <TouchableOpacity
                    style={styles.advanceStatusBtn}
                    onPress={() => handleUpdateStatus(ord.id, ord.status)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.advanceStatusText}>Advance Status →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab 2: Showroom Stock */}
        {selectedTab === 'inventory' && (
          <View style={styles.stockList}>
            <Text style={styles.sectionTitle}>Showroom Inventory Sync</Text>
            {[
              { outlet: 'Bashundhara City Flagship', count: '1,420 Units', status: 'Healthy' },
              { outlet: 'Uttara Sector 7 Showroom', count: '890 Units', status: 'Healthy' },
              { outlet: 'Mirpur 01 Outlet', count: '610 Units', status: 'Healthy' },
              { outlet: 'Sylhet Zindabazar', count: '940 Units', status: 'Healthy' },
              { outlet: 'Chattogram Finlay Square', count: '780 Units', status: 'Healthy' },
              { outlet: 'Khulna Shonadanga', count: '520 Units', status: 'Low on XL Tees' },
              { outlet: 'Barishal Outlet (Grand Opening)', count: '1,200 Units', status: 'Restocked' },
            ].map((st, i) => (
              <View key={i} style={styles.stockItem}>
                <View>
                  <Text style={styles.outletName}>{st.outlet}</Text>
                  <Text style={styles.outletCount}>{st.count}</Text>
                </View>
                <View style={styles.stockStatusBadge}>
                  <Text style={styles.stockStatusText}>{st.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab 3: Promotions */}
        {selectedTab === 'promos' && (
          <View style={styles.promoList}>
            <Text style={styles.sectionTitle}>Active Campaign Rules</Text>
            {[
              {
                title: '⚡ Buy 5 Economy T-Shirts for 1399 Tk',
                sub: 'Automatic bundle discount at checkout',
                status: 'LIVE',
              },
              {
                title: '🎉 Barishal Grand Opening Offer',
                sub: 'Free Signature Barishal T-shirt on ৳1000+ purchase',
                status: 'ACTIVE',
              },
              {
                title: '🏷️ OUBD10 Member Discount',
                sub: '10% discount on cart subtotal',
                status: 'ACTIVE',
              },
              {
                title: '🕌 Eid 2026 Early Bird (EID2026)',
                sub: '15% discount on Panjabi & Thobe collections',
                status: 'SCHEDULED',
              },
            ].map((pr, i) => (
              <View key={i} style={styles.promoCard}>
                <View style={styles.promoInfo}>
                  <Text style={styles.promoTitle}>{pr.title}</Text>
                  <Text style={styles.promoSub}>{pr.sub}</Text>
                </View>
                <View style={styles.promoLiveBadge}>
                  <Text style={styles.promoLiveText}>{pr.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  adminBadgeText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    gap: 4,
  },
  exitBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
    padding: Spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginVertical: 4,
  },
  metricGrowth: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '700',
  },
  metricPending: {
    fontSize: 11,
    color: Colors.sale,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    padding: 4,
    borderRadius: Radius.sm,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.xs,
  },
  tabActive: {
    backgroundColor: Colors.background,
    ...Shadows.sm,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  ordersList: {
    gap: Spacing.sm,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  customerName: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusCol: {
    alignItems: 'flex-end',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    marginBottom: 4,
  },
  pillDelivered: {
    backgroundColor: '#E6F9F0',
  },
  pillProcessing: {
    backgroundColor: '#EFF8FF',
  },
  pillPending: {
    backgroundColor: '#FEF3F2',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  addressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addressText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  payMethod: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  advanceStatusBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.xs,
  },
  advanceStatusText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  stockList: {
    gap: Spacing.xs,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outletName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  outletCount: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  stockStatusBadge: {
    backgroundColor: Colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  stockStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
  },
  promoList: {
    gap: Spacing.xs,
  },
  promoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promoInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  promoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  promoSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  promoLiveBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  promoLiveText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
});
