// src/components/common/Divider.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/layout';

export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

// src/components/common/SectionHeader.js — exported from same file for convenience
import { Text } from 'react-native';
import { FontSize, FontWeight } from '../../constants/layout';

export function SectionHeader({ title, action, onActionPress, style }) {
  return (
    <View style={[styles.sectionRow, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Text
          style={styles.sectionAction}
          onPress={onActionPress}
          accessibilityRole="button"
        >
          {action}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  sectionAction: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  },
});
