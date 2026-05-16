// src/components/common/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Spacing } from '../../constants/layout';
import AppButton from './AppButton';

export function EmptyState({ icon = 'inbox', title, subtitle, actionTitle, onAction }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={56} color={Colors.border} style={styles.icon} />
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionTitle && onAction ? (
        <AppButton title={actionTitle} onPress={onAction} style={styles.btn} />
      ) : null}
    </View>
  );
}

export function LoadingState({ message }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.loadingText}>{message}</Text> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry, retryLabel = 'Retry' }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error-outline" size={56} color={Colors.error} style={styles.icon} />
      <Text style={styles.title}>{message || 'Something went wrong.'}</Text>
      {onRetry ? (
        <AppButton title={retryLabel} onPress={onRetry} style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  icon: { marginBottom: Spacing.base },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.base,
  },
  btn: { marginTop: Spacing.base, paddingHorizontal: Spacing.xxl },
  loadingText: {
    marginTop: Spacing.base,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
