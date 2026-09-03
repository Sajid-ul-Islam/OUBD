import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Colors, Radius, Shadows } from '../constants/theme';

interface StartupAnimationProps {
  onFinish?: () => void;
  duration?: number;
}

export const StartupAnimation: React.FC<StartupAnimationProps> = ({
  onFinish,
  duration = 1800,
}) => {
  const [visible, setVisible] = useState(true);

  // Animation values
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(0.75)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(12)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.85)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance sequence
    Animated.parallel([
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0.35,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(ringScale, {
        toValue: 1.15,
        friction: 5,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Logo & Tagline reveal
    const timerLogo = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    const timerTag = setTimeout(() => {
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 600);

    // 3. Smooth fadeout and dismiss
    const timerExit = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      clearTimeout(timerLogo);
      clearTimeout(timerTag);
      clearTimeout(timerExit);
    };
  }, []);

  const handleDismiss = () => {
    Animated.timing(containerOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onFinish?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={1}
        onPress={handleDismiss}
      >
        {/* Ambient Ring */}
        <Animated.View
          style={[
            styles.ambientRing,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        {/* Official Brand App Icon */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              opacity: iconOpacity,
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.iconImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Official White Logo Wordmark */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/oubd-logo-white.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Tagline & Slogan */}
        <Animated.View style={[styles.tagWrapper, { opacity: tagOpacity }]}>
          <View style={styles.badgeContainer}>
            <View style={styles.greenDot} />
            <Text style={styles.badgeText}>CRAFTED FOR THE UMMAH</Text>
            <View style={styles.greenDot} />
          </View>
          <Text style={styles.subText}>Modest Lifestyle • Authentic Sunnah Apparel</Text>
        </Animated.View>

        {/* Bottom subtle progress indicator */}
        <View style={styles.bottomBar}>
          <Text style={styles.skipHint}>Tap anywhere to enter</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    backgroundColor: '#101828', // Core Brand Charcoal
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ambientRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(5, 174, 122, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(5, 174, 122, 0.4)',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1D2939',
    borderWidth: 2,
    borderColor: 'rgba(5, 174, 122, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Shadows.lg,
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 200,
    height: 48,
  },
  tagWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(5, 174, 122, 0.3)',
    marginBottom: 8,
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  badgeText: {
    color: '#05AE7A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  skipHint: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
