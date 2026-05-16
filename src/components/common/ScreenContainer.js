// src/components/common/ScreenContainer.js
import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/colors';
import { SCREEN_PADDING } from '../../constants/layout';

/**
 * ScreenContainer wraps every screen:
 * - SafeAreaView (handles notch + status bar + nav bar)
 * - StatusBar control
 * - Optional scroll + keyboard avoidance
 * - Consistent horizontal padding
 */
export default function ScreenContainer({
  children,
  style,
  contentStyle,
  scrollable = false,
  keyboardAvoiding = false,
  backgroundColor = Colors.background,
  statusBarStyle = 'dark',
  statusBarBg,
  padded = true,
  edges = ['top', 'left', 'right', 'bottom'],
  contentContainerStyle,
}) {
  const content = padded ? (
    <View style={[styles.padded, contentStyle]}>{children}</View>
  ) : (
    <View style={[styles.fill, contentStyle]}>{children}</View>
  );

  const scrollContent = scrollable ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={[styles.scrollContent, padded && styles.scrollPadded, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : content;

  const inner = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {scrollContent}
    </KeyboardAvoidingView>
  ) : scrollContent;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }, style]}
      edges={edges}
    >
      <StatusBar style={statusBarStyle} backgroundColor={statusBarBg || backgroundColor} />
      {inner}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  padded: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollPadded: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: SCREEN_PADDING,
  },
});
