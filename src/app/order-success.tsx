import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={44} color={Colors.textInverse} />
        </View>

        <Text style={styles.title}>JazakAllah Khair!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully and is being prepared for dispatch.
        </Text>

        <View style={styles.orderIdBadge}>
          <Text style={styles.orderIdLabel}>Order Reference ID:</Text>
          <Text style={styles.orderIdValue}>{orderId || 'OUBD-CONFIRMED'}</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={Colors.accent} />
            <Text style={styles.infoText}>
              Our dispatch team will call you before courier delivery to verify your availability.
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cube-outline" size={16} color={Colors.accent} />
            <Text style={styles.infoText}>
              Estimated Delivery: 1-2 Days (Dhaka) / 3-4 Days (Outside Dhaka).
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace('/(tabs)/account')}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryBtnText}>View My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.88}
        >
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.lg,
  },
  orderIdBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  orderIdLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  orderIdValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: Colors.accentSubtle,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.primary,
    lineHeight: 16,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  primaryBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    paddingVertical: 14,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
