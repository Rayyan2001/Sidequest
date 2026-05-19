// src/components/common/AppHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Spacing, TOUCH_TARGET } from '../../constants/layout';

export default function AppHeader({
  title,
  onBack,
  rightIcon,
  onRightPress,
  backgroundColor = Colors.white,
  titleColor = Colors.textPrimary,
  iconColor = Colors.textPrimary,
  borderBottom = true,
}) {
  return (
    <View style={[styles.header, { backgroundColor }, borderBottom && styles.border]}>
      {/* Left — back button or spacer */}
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.iconBtn}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <MaterialIcons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      {/* Center — title */}
      <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
        {title}
      </Text>

      {/* Right — optional action */}
      <View style={styles.side}>
        {rightIcon && onRightPress ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconBtn}
            accessibilityLabel="Header action"
            accessibilityRole="button"
          >
            <MaterialIcons name={rightIcon} size={24} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: TOUCH_TARGET + Spacing.sm,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  side: {
    width: TOUCH_TARGET + Spacing.sm,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  iconBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
