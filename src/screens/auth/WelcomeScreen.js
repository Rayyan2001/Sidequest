// src/screens/auth/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import SocialAuthButton from '../../components/common/SocialAuthButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';
import { authService } from '../../services/api';

const S = Strings.auth;
const App = Strings;

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const setUser = useAppStore((s) => s.setUser);

  const handleGoogle = async () => {
    const res = await authService.signInWithGoogle();
    if (res.ok) {
      setUser(res.data.user);
      navigation.replace(Routes.MAIN_STACK);
    }
  };

  const handleApple = async () => {
    const res = await authService.signInWithApple();
    if (res.ok) {
      setUser(res.data.user);
      navigation.replace(Routes.MAIN_STACK);
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.primary} statusBarStyle="light" padded={false}>
      {/* Hero section */}
      <View style={styles.hero}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <MaterialIcons name="location-on" size={20} color={Colors.white} />
          </View>
          <Text style={styles.logoText}>{App.appName}</Text>
        </View>

        {/* Illustration placeholder */}
        <View style={styles.illustrationPlaceholder}>
          <MaterialIcons name="directions-walk" size={80} color={Colors.accentLight} />
        </View>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.welcomeTo}>{S.welcomeTo}</Text>
        <Text style={styles.appName}>{App.appName}</Text>

        {/* Email CTA */}
        <AppButton
          title={S.continueWithEmail}
          onPress={() => navigation.navigate(Routes.SIGN_UP)}
          style={styles.emailBtn}
        />

        {/* Social */}
        <SocialAuthButton provider="google" onPress={handleGoogle} style={styles.socialBtn} />
        <SocialAuthButton provider="apple" onPress={handleApple} style={styles.socialBtn} />

        {/* Sign in link */}
        <View style={styles.signinRow}>
          <Text style={styles.signinText}>{S.alreadyHaveAccount} </Text>
          <Text
            style={styles.signinLink}
            onPress={() => navigation.navigate(Routes.SIGN_IN)}
            accessibilityRole="link"
          >
            {S.logIn}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  illustrationPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom card
  card: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  welcomeTo: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 2,
  },
  appName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emailBtn: { marginBottom: Spacing.md },
  socialBtn: { marginBottom: Spacing.md },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  signinText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  signinLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
