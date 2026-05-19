// src/components/common/AppButton.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing, TOUCH_TARGET } from '../../constants/layout';

/**
 * AppButton — primary, secondary, outline, ghost, danger variants.
 * Never hardcodes any label — always passed as `title` prop.
 */
const VARIANTS = {
  primary: {
    bg: Colors.primary,
    text: Colors.white,
    border: Colors.primary,
  },
  secondary: {
    bg: Colors.accentLight,
    text: Colors.primary,
    border: Colors.accentLight,
  },
  outline: {
    bg: Colors.transparent,
    text: Colors.primary,
    border: Colors.primary,
  },
  ghost: {
    bg: Colors.transparent,
    text: Colors.primary,
    border: Colors.transparent,
  },
  danger: {
    bg: Colors.error,
    text: Colors.white,
    border: Colors.error,
  },
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, minHeight: 40 },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, minHeight: TOUCH_TARGET },
    lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl, minHeight: 54 },
  };

  const fontSizes = { sm: FontSize.sm, md: FontSize.base, lg: FontSize.md };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.78}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      style={[
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          opacity: isDisabled ? 0.55 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} size="small" />
      ) : (
        <View style={styles.inner}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { color: variantStyle.text, fontSize: fontSizes[size] },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.1,
  },
  iconLeft: { marginRight: Spacing.sm },
  iconRight: { marginLeft: Spacing.sm },
});
