import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { useApp } from '../../store/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export default function CartScreen() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    cartTotal,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.valid) {
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <Header title="Shopping Bag" showBack={false} />

      {cart.length === 0 ? (
        <EmptyState
          iconName="bag-handle-outline"
          title="Your Shopping Bag is Empty"
          description="Looks like you haven't added any modest apparel or attars yet."
          buttonTitle="Start Shopping"
          onButtonPress={() => router.push('/(tabs)')}
        />
      ) : (
        <View style={styles.mainLayout}>
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Free Delivery Progress Banner */}
            <View style={styles.freeDeliveryBanner}>
              <Ionicons
                name={cartSubtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD ? 'checkmark-circle' : 'gift-outline'}
                size={18}
                color={Colors.accent}
              />
              <Text style={styles.freeDeliveryText}>
                {cartSubtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD
                  ? 'Alhamdulillah! You unlocked FREE Delivery nationwide.'
                  : `Add ৳${(APP_CONFIG.FREE_DELIVERY_THRESHOLD - cartSubtotal).toLocaleString()} more to get FREE Delivery!`}
              </Text>
            </View>

            {/* Cart Items List */}
            <View style={styles.itemsList}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartCard}>
                  <TouchableOpacity
                    onPress={() => router.push(`/product/${item.product.id}`)}
                    style={styles.itemImage}
                  >
                    {item.product.images.length > 0 ? (
                      <Image source={{ uri: item.product.images[0] }} style={styles.img} resizeMode="cover" />
                    ) : (
                      <View style={styles.imgFallback}>
                        <Ionicons name="shirt-outline" size={32} color={Colors.textMuted} />
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={styles.itemDetails}>
                    <View style={styles.titleRow}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.product.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="close" size={18} color={Colors.textMuted} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.variantInfo}>
                      Size: {item.selectedSize} • Color: {item.selectedColor}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.unitPrice}>
                        {APP_CONFIG.CURRENCY_SYMBOL} {(item.product.price * item.quantity).toLocaleString()}
                      </Text>

                      {/* Stepper */}
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepperBtn}
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Ionicons name="remove" size={14} color={Colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepperBtn}
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Ionicons name="add" size={14} color={Colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Delivery Zone Selector */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>Select Delivery Destination:</Text>
              <View style={styles.zoneOptions}>
                <TouchableOpacity
                  style={[styles.zoneOption, deliveryZone === 'inside_dhaka' && styles.zoneOptionActive]}
                  onPress={() => setDeliveryZone('inside_dhaka')}
                  activeOpacity={0.8}
                >
                  <View style={styles.zoneRadio}>
                    {deliveryZone === 'inside_dhaka' && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.zoneInfo}>
                    <Text style={styles.zoneName}>Inside Dhaka City</Text>
                    <Text style={styles.zoneTime}>1 - 2 Business Days</Text>
                  </View>
                  <Text style={styles.zoneFee}>৳{APP_CONFIG.DELIVERY_FEE_INSIDE_DHAKA}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.zoneOption, deliveryZone === 'outside_dhaka' && styles.zoneOptionActive]}
                  onPress={() => setDeliveryZone('outside_dhaka')}
                  activeOpacity={0.8}
                >
                  <View style={styles.zoneRadio}>
                    {deliveryZone === 'outside_dhaka' && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.zoneInfo}>
                    <Text style={styles.zoneName}>Outside Dhaka (All Districts)</Text>
                    <Text style={styles.zoneTime}>2 - 4 Business Days</Text>
                  </View>
                  <Text style={styles.zoneFee}>৳{APP_CONFIG.DELIVERY_FEE_OUTSIDE_DHAKA}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Coupon Section */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>Apply Promo / Coupon Code:</Text>
              {appliedCoupon ? (
                <View style={styles.appliedCouponRow}>
                  <View style={styles.couponTag}>
                    <Ionicons name="pricetag" size={14} color={Colors.accent} />
                    <Text style={styles.couponCodeText}>{appliedCoupon} Applied</Text>
                    <Text style={styles.couponSaving}>(-৳{couponDiscount})</Text>
                  </View>
                  <TouchableOpacity onPress={removeCoupon} style={styles.removeCouponBtn}>
                    <Text style={styles.removeCouponText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.couponInputRow}>
                    <TextInput
                      style={styles.couponInput}
                      placeholder="Try: OUBD10 or EID2026"
                      placeholderTextColor={Colors.textMuted}
                      value={couponInput}
                      onChangeText={setCouponInput}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={styles.applyBtn}
                      onPress={handleApplyCoupon}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.applyBtnText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                  {couponError && <Text style={styles.errorText}>{couponError}</Text>}
                </View>
              )}
            </View>

            {/* Bill Summary */}
            <View style={styles.billBox}>
              <Text style={styles.billTitle}>Order Bill Summary</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal ({cart.length} items)</Text>
                <Text style={styles.billValue}>৳{cartSubtotal.toLocaleString()}</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Charge</Text>
                <Text style={styles.billValue}>
                  {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}
                </Text>
              </View>

              {couponDiscount > 0 && (
                <View style={styles.billRow}>
                  <Text style={[styles.billLabel, { color: Colors.accent }]}>Coupon Discount</Text>
                  <Text style={[styles.billValue, { color: Colors.accent }]}>-৳{couponDiscount}</Text>
                </View>
              )}

              <View style={[styles.billRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>৳{cartTotal.toLocaleString()}</Text>
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Sticky Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.totalBlock}>
              <Text style={styles.bottomTotalLabel}>Total Payable:</Text>
              <Text style={styles.bottomTotalAmount}>৳{cartTotal.toLocaleString()}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.88}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainLayout: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    padding: Spacing.lg,
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentSubtle,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  freeDeliveryText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '700',
    flex: 1,
  },
  itemsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceVariant,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  variantInfo: {
    fontSize: 11,
    color: Colors.textMuted,
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    paddingHorizontal: 6,
  },
  sectionBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  zoneOptions: {
    gap: Spacing.xs,
  },
  zoneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zoneOptionActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  zoneRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  zoneTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  zoneFee: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  couponInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    fontSize: 13,
    color: Colors.primary,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  applyBtnText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 11,
    color: Colors.error,
    marginTop: 4,
  },
  appliedCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.accentSubtle,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  couponTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  couponCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  couponSaving: {
    fontSize: 12,
    color: Colors.accent,
  },
  removeCouponBtn: {
    padding: 4,
  },
  removeCouponText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
  },
  billBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  totalValue: {
    fontSize: 16,
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
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.lg,
  },
  totalBlock: {},
  bottomTotalLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomTotalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    gap: 8,
  },
  checkoutBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});
