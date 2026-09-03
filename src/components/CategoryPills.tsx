import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '../constants/theme';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.toLowerCase() ||
            (selectedCategory === '' && cat === 'All');

          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.pill,
                isSelected ? styles.selectedPill : styles.unselectedPill,
              ]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPill: {
    backgroundColor: Colors.primary,
  },
  unselectedPill: {
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedText: {
    color: Colors.textInverse,
  },
  unselectedText: {
    color: Colors.textSecondary,
  },
});
