import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';
import { orderService } from '../services/orders/orderService';
import { PaymentMethod, DeliveryZone } from '../types';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    cart,
    cartSubtotal,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    appliedCoupon,
    couponDiscount,
    cartTotal,
    clearCart,
    user,
    refreshOrders,
  } = useApp();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(
    user?.savedAddresses?.[0]?.address || ''
  );
  const [city, setCity] = useState(user?.savedAddresses?.[0]?.city || 'Dhaka');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!fullName.trim()) {
      Alert.alert('Missing Field', 'Please enter your full recipient name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Invalid Phone', 'Please provide a valid 11-digit mobile number for courier confirmation.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Missing Field', 'Please enter your street address and house/flat details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await orderService.createOrder({
        items: cart,
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          zone: deliveryZone,
          deliveryNotes: notes,
        },
        paymentMethod,
        couponCode: appliedCoupon || undefined,
      });

      clearCart();
      await refreshOrders();

      router.replace({
        pathname: '/order-success',
        params: { orderId: order.id },
      });
    } catch (e: any) {
      Alert.alert('Error', 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout & Shipping</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Step 1: Recipient & Address */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={20} color={Colors.accent} />
            <Text style={styles.cardTitle}>Shipping Address</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipient Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Abdullah Al-Mamun"
              placeholderTextColor={Colors.textMuted}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Phone Number (for delivery) *</Text>
            <TextInput
              style={styles.input}
              placeholder="01XXXXXXXXX"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Street Address / Area *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="House #, Road #, Sector / Area, Post Code"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={2}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City / District</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dhaka, Sylhet, Chattogram"
              placeholderTextColor={Colors.textMuted}
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Special Delivery Note (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Call before delivery, deliver after 3 PM"
              placeholderTextColor={Colors.textMuted}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* Step 2: Delivery Zone */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="car-outline" size={20} color={Colors.accent} />
            <Text style={styles.cardTitle}>Delivery Speed & Destination</Text>
          </View>

          <View style={styles.zoneList}>
            <TouchableOpacity
              style={[styles.zoneRow, deliveryZone === 'inside_dhaka' && styles.zoneRowActive]}
              onPress={() => setDeliveryZone('inside_dhaka')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={deliveryZone === 'inside_dhaka' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={deliveryZone === 'inside_dhaka' ? Colors.accent : Colors.textMuted}
              />
              <View style={styles.zoneTextCol}>
                <Text style={styles.zoneTitle}>Inside Dhaka Metro</Text>
                <Text style={styles.zoneSub}>Delivered within 24 to 48 Hours</Text>
              </View>
              <Text style={styles.zonePrice}>
                {cartSubtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD ? 'FREE' : '৳70'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zoneRow, deliveryZone === 'outside_dhaka' && styles.zoneRowActive]}
              onPress={() => setDeliveryZone('outside_dhaka')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={deliveryZone === 'outside_dhaka' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={deliveryZone === 'outside_dhaka' ? Colors.accent : Colors.textMuted}
              />
              <View style={styles.zoneTextCol}>
                <Text style={styles.zoneTitle}>Outside Dhaka (Nationwide)</Text>
                <Text style={styles.zoneSub}>Delivered within 3 to 4 Days (Steadfast / Pathao)</Text>
              </View>
              <Text style={styles.zonePrice}>
                {cartSubtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD ? 'FREE' : '৳130'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step 3: Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet-outline" size={20} color={Colors.accent} />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentList}>
            <TouchableOpacity
              style={[styles.paymentRow, paymentMethod === 'cod' && styles.paymentRowActive]}
              onPress={() => setPaymentMethod('cod')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={paymentMethod === 'cod' ? Colors.accent : Colors.textMuted}
              />
              <View style={styles.paymentTextCol}>
                <Text style={styles.paymentTitle}>Cash on Delivery (COD)</Text>
                <Text style={styles.paymentSub}>Pay with cash when courier delivers package</Text>
              </View>
              <View style={styles.recBadge}>
                <Text style={styles.recText}>POPULAR</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentRow, paymentMethod === 'bkash' && styles.paymentRowActive]}
              onPress={() => setPaymentMethod('bkash')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={paymentMethod === 'bkash' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={paymentMethod === 'bkash' ? Colors.accent : Colors.textMuted}
              />
              <View style={styles.paymentTextCol}>
                <Text style={styles.paymentTitle}>bKash Direct / Merchant</Text>
                <Text style={styles.paymentSub}>Instant mobile banking checkout</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentRow, paymentMethod === 'nagad' && styles.paymentRowActive]}
              onPress={() => setPaymentMethod('nagad')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={paymentMethod === 'nagad' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={paymentMethod === 'nagad' ? Colors.accent : Colors.textMuted}
              />
              <View style={styles.paymentTextCol}>
                <Text style={styles.paymentTitle}>Nagad Online</Text>
                <Text style={styles.paymentSub}>Pay securely via Nagad wallet</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step 4: Final Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Breakdown</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cart.length} items)</Text>
            <Text style={styles.summaryValue}>৳{cartSubtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}</Text>
          </View>
          {couponDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.accent }]}>Discount ({appliedCoupon})</Text>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>-৳{couponDiscount}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.totalTitle}>Total Amount Payable</Text>
            <Text style={styles.totalAmount}>৳{cartTotal.toLocaleString()}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Confirmation Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View>
          <Text style={styles.bottomLabel}>Payable Total:</Text>
          <Text style={styles.bottomValue}>৳{cartTotal.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
          activeOpacity={0.88}
        >
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
          </Text>
          <Ionicons name="checkmark-circle" size={18} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollArea: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    fontSize: 13,
    color: Colors.primary,
  },
  multilineInput: {
    height: 64,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  zoneList: {
    gap: Spacing.xs,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zoneRowActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  zoneTextCol: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  zoneTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  zoneSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  zonePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  paymentList: {
    gap: Spacing.xs,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentRowActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  paymentTextCol: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  paymentSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  recBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  recText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  totalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.accent,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.lg,
  },
  bottomLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    gap: 6,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.borderStrong,
  },
  confirmBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});
