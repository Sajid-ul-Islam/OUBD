import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  islamicReminders: boolean;
}

interface NotificationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onSavePreferences?: (prefs: NotificationPreferences) => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  visible,
  onClose,
  onSavePreferences,
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: true,
    newArrivals: true,
    islamicReminders: true,
  });

  const togglePref = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEnable = () => {
    onSavePreferences?.(preferences);
    Alert.alert(
      'Notifications Enabled',
      'You will now receive order updates, flash combo deals, and Jummah reminders. You can adjust this anytime in Account settings.'
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="notifications" size={28} color={Colors.accent} />
          </View>

          {/* Title & Value Explanation */}
          <Text style={styles.title}>Stay Updated with One Ummah BD</Text>
          <Text style={styles.subtitle}>
            Choose what you want to hear about. We respect your peace and send only valuable updates.
          </Text>

          {/* Value Categories with Toggles */}
          <View style={styles.preferencesList}>
            <View style={styles.prefRow}>
              <View style={styles.prefIconBox}>
                <Ionicons name="cube-outline" size={18} color={Colors.info} />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Orders & Deliveries</Text>
                <Text style={styles.prefSub}>Steadfast tracking, dispatch & arrival updates</Text>
              </View>
              <Switch
                value={preferences.orderUpdates}
                onValueChange={() => togglePref('orderUpdates')}
                trackColor={{ false: Colors.borderStrong, true: Colors.accent }}
                thumbColor={Colors.textInverse}
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefIconBox}>
                <Ionicons name="pricetag-outline" size={18} color={Colors.sale} />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Flash Deals & Combos</Text>
                <Text style={styles.prefSub}>5 T-Shirts for ৳1,399 & seasonal discounts</Text>
              </View>
              <Switch
                value={preferences.promotions}
                onValueChange={() => togglePref('promotions')}
                trackColor={{ false: Colors.borderStrong, true: Colors.accent }}
                thumbColor={Colors.textInverse}
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefIconBox}>
                <Ionicons name="sparkles-outline" size={18} color={Colors.accent} />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>New Drops & Collections</Text>
                <Text style={styles.prefSub}>Panjabi, Moroccan Thobes & limited caps</Text>
              </View>
              <Switch
                value={preferences.newArrivals}
                onValueChange={() => togglePref('newArrivals')}
                trackColor={{ false: Colors.borderStrong, true: Colors.accent }}
                thumbColor={Colors.textInverse}
              />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefIconBox}>
                <Ionicons name="moon-outline" size={18} color={Colors.warning} />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Jummah & Sunnah Reminders</Text>
                <Text style={styles.prefSub}>Surah Kahf, Durood & Halal Attar checklist</Text>
              </View>
              <Switch
                value={preferences.islamicReminders}
                onValueChange={() => togglePref('islamicReminders')}
                trackColor={{ false: Colors.borderStrong, true: Colors.accent }}
                thumbColor={Colors.textInverse}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonCol}>
            <TouchableOpacity
              style={styles.enableBtn}
              activeOpacity={0.88}
              onPress={handleEnable}
            >
              <Text style={styles.enableBtnText}>Confirm Notification Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.maybeLaterBtn}
              activeOpacity={0.75}
              onPress={onClose}
            >
              <Text style={styles.maybeLaterText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 40, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.lg,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  preferencesList: {
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  prefIconBox: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTextCol: {
    flex: 1,
  },
  prefTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  prefSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  buttonCol: {
    width: '100%',
    gap: Spacing.xs,
  },
  enableBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  enableBtnText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  maybeLaterBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  maybeLaterText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
