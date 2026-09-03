import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/auth/authService';
import { useApp } from '../../store/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser } = useApp();

  const [phone, setPhone] = useState('01901165090');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            setCanResend(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleRequestOTP = async () => {
    setErrorMessage(null);
    setLoading(true);
    const res = await authService.requestOTP(phone);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      setCountdown(60);
      setCanResend(false);
      Alert.alert('OTP Sent', res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleVerifyOTP = async () => {
    setErrorMessage(null);
    setLoading(true);
    const res = await authService.verifyOTP(phone, otpCode);
    setLoading(false);

    if (res.success && res.user) {
      setUser(res.user);
      Alert.alert('Welcome', `Assalamu Alaikum, ${res.user.name}!`);
      router.replace('/(tabs)/account');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const res = await authService.loginWithGoogle();
    setLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      router.replace('/(tabs)/account');
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    const res = await authService.loginWithFacebook();
    setLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      router.replace('/(tabs)/account');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Account Login</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.content}>
        {/* Brand Banner */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>OUBD</Text>
          </View>
          <Text style={styles.brandTitle}>ONE UMMAH BD</Text>
          <Text style={styles.brandSub}>Spread Dawah, Look Good!</Text>
        </View>

        {step === 'phone' ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Phone Login / Register</Text>
            <Text style={styles.formDesc}>
              Enter your mobile number to receive a 4-digit verification code.
            </Text>

            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>🇧🇩 +880</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="1901165090"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.btnDisabled]}
              onPress={handleRequestOTP}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <Text style={styles.primaryButtonText}>Send Verification Code</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={handleGoogleLogin}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.googleBtnText}>Google Sign-In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fbBtn}
                onPress={handleFacebookLogin}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-facebook" size={18} color="#1877F2" />
                <Text style={styles.fbBtnText}>Facebook Sign-In</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.formCard}>
            <TouchableOpacity style={styles.changePhoneBtn} onPress={() => setStep('phone')}>
              <Ionicons name="arrow-back" size={14} color={Colors.accent} />
              <Text style={styles.changePhoneText}>Change phone number ({phone})</Text>
            </TouchableOpacity>

            <Text style={styles.formTitle}>Enter Verification Code</Text>
            <Text style={styles.formDesc}>
              A 4-digit code was sent to your phone. (Use <Text style={{ fontWeight: '700' }}>1234</Text> for demo)
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="1 2 3 4"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              value={otpCode}
              onChangeText={setOtpCode}
              autoFocus
            />

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.btnDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <Text style={styles.primaryButtonText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendRow}>
              {canResend ? (
                <TouchableOpacity onPress={handleRequestOTP}>
                  <Text style={styles.resendLink}>Resend OTP Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimer}>Resend code in {countdown}s</Text>
              )}
            </View>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.xs,
    marginBottom: Spacing.xs,
  },
  logoText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  formDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  countryCodeBox: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    height: 46,
    fontSize: 14,
    color: Colors.primary,
  },
  otpInput: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: Radius.sm,
    height: 52,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 13,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  btnDisabled: {
    backgroundColor: Colors.borderStrong,
  },
  primaryButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.sm,
  },
  socialButtons: {
    gap: Spacing.sm,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 11,
    borderRadius: Radius.sm,
    gap: 8,
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  fbBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 11,
    borderRadius: Radius.sm,
    gap: 8,
  },
  fbBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  changePhoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  changePhoneText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  resendTimer: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  resendLink: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '700',
  },
});
