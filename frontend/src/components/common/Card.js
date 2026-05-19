// src/components/common/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import { Radius, Spacing, Shadow } from '../../constants/layout';

export default function Card({ children, style, padded = true }) {
  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  padded: {
    padding: Spacing.base,
  },
});
