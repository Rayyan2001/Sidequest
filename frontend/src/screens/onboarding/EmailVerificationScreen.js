// src/screens/onboarding/EmailVerificationScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { authService } from '../../services/api';
import { useAppStore } from '../../store/appStore';

const S = Strings.emailVerification;

export default function EmailVerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || 'your email';

  const setEmailVerified = useAppStore((s) => s.setEmailVerified);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await authService.resendVerificationEmail(email);
    setResending(false);
  };

  // Simulate "I've verified" — in production this would be handled by deep link
  const handleContinue = () => {
    setEmailVerified(true);
    navigation.replace(Routes.MAIN_STACK);
  };

  return (
    <ScreenContainer backgroundColor={Colors.white} >
      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <MaterialIcons name="mark-email-read" size={72} color={Colors.primary} />
          <View style={styles.checkOverlay}>
            <MaterialIcons name="check-circle" size={28} color={Colors.accent} />
          </View>
        </View>

        <Text style={styles.title}>{S.title}</Text>
        <Text style={styles.subtitle}>{S.subtitle}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.instruction}>{S.instruction}</Text>

        <AppButton
          title="I've verified my email"
          onPress={handleContinue}
          style={styles.btn}
        />

        <AppButton
          title={S.resendEmail}
          onPress={handleResend}
          loading={resending}
          variant="ghost"
          style={styles.resendBtn}
        />

        <AppButton
          title={S.changeEmail}
          onPress={() => navigation.goBack()}
          variant="ghost"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  iconWrap: {
    position: 'relative',
    marginBottom: Spacing.xxl,
  },
  checkOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.white,
    borderRadius: 14,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  email: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  instruction: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  btn: { width: '100%', marginBottom: Spacing.sm },
  resendBtn: { marginBottom: Spacing.xs },
});
