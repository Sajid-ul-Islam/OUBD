import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows, Typography } from '../constants/theme';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'campaign' | 'order' | 'reminder';
  time: string;
  unread: boolean;
  actionLabel?: string;
  route?: string;
  params?: Record<string, string>;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: '🔥 Mega Combo Deal: 5 T-Shirts @ 1399 Tk',
    message: 'Limited time stock! Buy any 5 Economy Dawah T-Shirts for only ৳1,399. Auto-applied at checkout.',
    type: 'campaign',
    time: '10m ago',
    unread: true,
    actionLabel: 'Shop T-Shirts',
    route: '/(tabs)/categories',
    params: { category: 'T-Shirt' },
  },
  {
    id: '2',
    title: '📦 Order #OUBD-91450 Dispatched',
    message: 'Your parcel has been handed over to Steadfast Courier. Estimated delivery: 24-48 hours. Consignment ID: ST-882194.',
    type: 'order',
    time: '3h ago',
    unread: true,
    actionLabel: 'View Orders',
    route: '/(tabs)/account',
  },
  {
    id: '3',
    title: '🕌 Jummah Mubarak Sunnah Reminder',
    message: 'Today is Friday. Remember to recite Surah Al-Kahf, send Durood upon the Prophet (ﷺ), and apply Halal non-alcoholic Attar.',
    type: 'reminder',
    time: 'Today',
    unread: true,
    actionLabel: 'Browse Attars',
    route: '/(tabs)/categories',
    params: { category: 'Perfume' },
  },
  {
    id: '4',
    title: '🎉 Barishal Grand Outlet Opening',
    message: 'Visit our newest showroom at Sadar Road, Barishal! Flat 15% discount on all Royal Panjabis and Thobes this week.',
    type: 'campaign',
    time: 'Yesterday',
    unread: false,
    actionLabel: 'View Outlets',
    route: '/store-locator',
  },
  {
    id: '5',
    title: '✨ Royal Moroccan Thobes In Stock',
    message: 'Our signature Emirati & Moroccan style Thobes in Olive, Charcoal, and Navy are now restocked with premium stitching.',
    type: 'campaign',
    time: '2d ago',
    unread: false,
    actionLabel: 'Explore Thobes',
    route: '/(tabs)/categories',
    params: { category: 'Thobe' },
  },
  {
    id: '6',
    title: '✅ Order #OUBD-90821 Delivered',
    message: 'Your package containing 1x Sabr Dawah T-shirt (Navy, L) has been delivered successfully. Jazakallahu Khair!',
    type: 'order',
    time: '3d ago',
    unread: false,
    actionLabel: 'Account History',
    route: '/(tabs)/account',
  },
  {
    id: '7',
    title: '🌙 Sunnah Reminder: Monday Fasting',
    message: 'Following the Sunnah of our beloved Prophet (ﷺ) brings Barakah and spiritual rejuvenation into daily life.',
    type: 'reminder',
    time: '4d ago',
    unread: false,
  },
];

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  onUnreadCountChange,
}) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'campaign' | 'order' | 'reminder'>('all');

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    onUnreadCountChange?.(0);
  };

  const markItemAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    setNotifications(updated);
    const newCount = updated.filter((n) => n.unread).length;
    onUnreadCountChange?.(newCount);
  };

  const handleAction = (item: NotificationItem) => {
    markItemAsRead(item.id);
    onClose();
    if (item.route) {
      if (item.params) {
        router.push({ pathname: item.route as any, params: item.params });
      } else {
        router.push(item.route as any);
      }
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'campaign':
        return { name: 'megaphone-outline' as const, color: Colors.accent, bg: Colors.accentSubtle };
      case 'order':
        return { name: 'cube-outline' as const, color: Colors.info, bg: '#E0F2FE' };
      case 'reminder':
        return { name: 'moon-outline' as const, color: Colors.warning, bg: Colors.warningSubtle };
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Modal Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Notification Center</Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount} New</Text>
                  </View>
                )}
              </View>
              <Text style={styles.subtitle}>Campaign deals, orders & Sunnah reminders</Text>
            </View>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markReadBtn}>
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'campaign', label: '🔥 Campaigns' },
              { key: 'order', label: '📦 Orders' },
              { key: 'reminder', label: '🕌 Reminders' },
            ] as const
          ).map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No notifications here</Text>
              <Text style={styles.emptySub}>You are all caught up with latest updates!</Text>
            </View>
          ) : (
            filtered.map((item) => {
              const iconMeta = getTypeIcon(item.type);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, item.unread && styles.itemCardUnread]}
                  activeOpacity={0.9}
                  onPress={() => markItemAsRead(item.id)}
                >
                  <View style={[styles.iconBox, { backgroundColor: iconMeta.bg }]}>
                    <Ionicons name={iconMeta.name} size={20} color={iconMeta.color} />
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={[styles.cardTitle, item.unread && styles.cardTitleUnread]}>
                        {item.title}
                      </Text>
                      {item.unread && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.cardMessage}>{item.message}</Text>

                    <View style={styles.cardFooter}>
                      <Text style={styles.cardTime}>{item.time}</Text>

                      {item.actionLabel && (
                        <TouchableOpacity
                          style={styles.cardActionBtn}
                          onPress={() => handleAction(item)}
                        >
                          <Text style={styles.cardActionText}>{item.actionLabel} →</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  unreadBadgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  markReadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceVariant,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  itemCardUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.accent,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    ...Shadows.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  cardTitleUnread: {
    color: Colors.primary,
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginLeft: 6,
  },
  cardMessage: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  cardActionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.accentSubtle,
    borderRadius: Radius.sm,
  },
  cardActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
