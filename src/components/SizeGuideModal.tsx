import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';

interface SizeGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tshirt' | 'panjabi' | 'pants'>('tshirt');

  const tshirtSizes = [
    { size: 'M', chest: '38-40"', length: '27"', sleeve: '8.5"' },
    { size: 'L', chest: '40-42"', length: '28"', sleeve: '9.0"' },
    { size: 'XL', chest: '42-44"', length: '29"', sleeve: '9.5"' },
    { size: 'XXL', chest: '44-46"', length: '30"', sleeve: '10.0"' },
  ];

  const panjabiSizes = [
    { size: '40 (M)', chest: '41"', length: '40"', collar: '15.5"' },
    { size: '42 (L)', chest: '43"', length: '42"', collar: '16.0"' },
    { size: '44 (XL)', chest: '45"', length: '44"', collar: '16.5"' },
    { size: '46 (XXL)', chest: '47"', length: '46"', collar: '17.0"' },
  ];

  const pantsSizes = [
    { size: '30', waist: '30"', length: '38"', thigh: '23"' },
    { size: '32', waist: '32"', length: '39"', thigh: '24"' },
    { size: '34', waist: '34"', length: '40"', thigh: '25"' },
    { size: '36', waist: '36"', length: '41"', thigh: '26"' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Size & Measurement Guide</Text>
              <Text style={styles.subtitle}>All measurements in inches (standard BD sizing)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Segment Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'tshirt' && styles.activeTab]}
              onPress={() => setActiveTab('tshirt')}
            >
              <Text style={[styles.tabText, activeTab === 'tshirt' && styles.activeTabText]}>
                T-Shirts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'panjabi' && styles.activeTab]}
              onPress={() => setActiveTab('panjabi')}
            >
              <Text style={[styles.tabText, activeTab === 'panjabi' && styles.activeTabText]}>
                Panjabi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pants' && styles.activeTab]}
              onPress={() => setActiveTab('pants')}
            >
              <Text style={[styles.tabText, activeTab === 'pants' && styles.activeTabText]}>
                Pants & Joggers
              </Text>
            </TouchableOpacity>
          </View>

          {/* Size Table */}
          <ScrollView style={styles.tableScroll}>
            {activeTab === 'tshirt' && (
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                  <Text style={[styles.tableCell, styles.headerCell]}>Size</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Chest</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Length</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Sleeve</Text>
                </View>
                {tshirtSizes.map((row, i) => (
                  <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.alternateRow]}>
                    <Text style={[styles.tableCell, styles.boldCell]}>{row.size}</Text>
                    <Text style={styles.tableCell}>{row.chest}</Text>
                    <Text style={styles.tableCell}>{row.length}</Text>
                    <Text style={styles.tableCell}>{row.sleeve}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'panjabi' && (
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                  <Text style={[styles.tableCell, styles.headerCell]}>Size</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Chest</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Length</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Collar</Text>
                </View>
                {panjabiSizes.map((row, i) => (
                  <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.alternateRow]}>
                    <Text style={[styles.tableCell, styles.boldCell]}>{row.size}</Text>
                    <Text style={styles.tableCell}>{row.chest}</Text>
                    <Text style={styles.tableCell}>{row.length}</Text>
                    <Text style={styles.tableCell}>{row.collar}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'pants' && (
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                  <Text style={[styles.tableCell, styles.headerCell]}>Size</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Waist</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Length</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>Thigh</Text>
                </View>
                {pantsSizes.map((row, i) => (
                  <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.alternateRow]}>
                    <Text style={[styles.tableCell, styles.boldCell]}>{row.size}</Text>
                    <Text style={styles.tableCell}>{row.waist}</Text>
                    <Text style={styles.tableCell}>{row.length}</Text>
                    <Text style={styles.tableCell}>{row.thigh}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>Fitting Advice:</Text>
              <Text style={styles.tipsText}>
                • For drop shoulder t-shirts, choose your standard size for an intentionally relaxed, modern fit.
              </Text>
              <Text style={styles.tipsText}>
                • All Panjabis are 100% combed cotton and pre-shrunk to prevent shrinkage after wash.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.sm,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.xs,
  },
  activeTab: {
    backgroundColor: Colors.background,
    ...Shadows.sm,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  tableScroll: {
    marginBottom: Spacing.md,
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableHeaderRow: {
    backgroundColor: Colors.surfaceVariant,
  },
  alternateRow: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: '700',
    color: Colors.primary,
  },
  boldCell: {
    fontWeight: '700',
    color: Colors.primary,
  },
  tipsBox: {
    backgroundColor: Colors.accentSubtle,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.md,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
