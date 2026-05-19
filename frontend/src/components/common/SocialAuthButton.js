// src/components/common/SocialAuthButton.js
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing, TOUCH_TARGET } from '../../constants/layout';

const PROVIDERS = {
  google: {
    label: 'Continue with Google',
    icon: <FontAwesome name="google" size={20} color="#DB4437" />,
    bg: Colors.white,
    border: Colors.border,
    text: Colors.textPrimary,
  },
  apple: {
    label: 'Continue with Apple',
    icon: <MaterialIcons name="apple" size={22} color={Colors.black} />,
    bg: Colors.black,
    border: Colors.black,
    text: Colors.white,
  },
};

export default function SocialAuthButton({ provider = 'google', onPress, label, style }) {
  const config = PROVIDERS[provider] || PROVIDERS.google;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityLabel={label || config.label}
      accessibilityRole="button"
      style={[
        styles.btn,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <View style={styles.iconWrap}>{config.icon}</View>
      <Text style={[styles.label, { color: config.text }]}>{label || config.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    minHeight: TOUCH_TARGET,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  iconWrap: {
    marginRight: Spacing.md,
    width: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
});
