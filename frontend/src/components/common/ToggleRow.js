// src/components/common/ToggleRow.js
import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Spacing, TOUCH_TARGET } from '../../constants/layout';

/**
 * ToggleRow — used in Settings, Notifications, Privacy screens.
 * Supports: toggle switch OR chevron-link variant.
 */
export default function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  type = 'switch', // 'switch' | 'link'
  onPress,
  rightLabel,
  icon,
  iconColor = Colors.primary,
  style,
}) {
  return (
    <TouchableOpacity
      style={[styles.row, style]}
      onPress={type === 'link' ? onPress : undefined}
      activeOpacity={type === 'link' ? 0.7 : 1}
      accessibilityRole={type === 'switch' ? 'switch' : 'button'}
      accessibilityLabel={label}
      disabled={type === 'switch'}
    >
      {icon && (
        <View style={styles.iconWrap}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
      )}

      <View style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.border, true: Colors.accentLight }}
          thumbColor={value ? Colors.primary : Colors.white}
          ios_backgroundColor={Colors.border}
        />
      )}

      {type === 'link' && (
        <View style={styles.linkRight}>
          {rightLabel ? (
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          ) : null}
          <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH_TARGET,
    paddingVertical: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  labelWrap: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  description: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  linkRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginRight: Spacing.xs,
  },
});
