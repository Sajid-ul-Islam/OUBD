import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Showroom } from '../types';
import { Colors, Spacing, Typography, Radius, Shadows } from '../constants/theme';

interface ShowroomCardProps {
  showroom: Showroom;
}

export const ShowroomCard: React.FC<ShowroomCardProps> = ({ showroom }) => {
  const handleCall = () => {
    const rawNumber = showroom.phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${rawNumber}`).catch(() => {});
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${showroom.name} One Ummah BD ${showroom.city}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url!).catch(() => {});
  };

  return (
    <View style={styles.card}>
      {showroom.isGrandOpening && (
        <View style={styles.grandOpeningBanner}>
          <Ionicons name="sparkles" size={13} color={Colors.textInverse} />
          <Text style={styles.grandOpeningText}>Grand Opening Special Offer!</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.name}>{showroom.name}</Text>
          <View style={styles.cityBadge}>
            <Text style={styles.cityText}>{showroom.city}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={Colors.accent} style={styles.icon} />
        <Text style={styles.address}>{showroom.address}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color={Colors.textMuted} style={styles.icon} />
        <Text style={styles.hours}>{showroom.businessHours}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.8}>
          <Ionicons name="call" size={15} color={Colors.textInverse} />
          <Text style={styles.callButtonText}>Call Showroom</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.directionsButton} onPress={handleDirections} activeOpacity={0.8}>
          <Ionicons name="navigate-outline" size={15} color={Colors.primary} />
          <Text style={styles.directionsButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  grandOpeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
    gap: 4,
  },
  grandOpeningText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  header: {
    marginBottom: Spacing.xs,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },
  cityBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginLeft: Spacing.xs,
  },
  cityText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  address: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  hours: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    gap: 6,
  },
  callButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '600',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    gap: 6,
  },
  directionsButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
