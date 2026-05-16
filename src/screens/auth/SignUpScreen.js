// src/screens/auth/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import SocialAuthButton from '../../components/common/SocialAuthButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { authService } from '../../services/api';
import { useAppStore } from '../../store/appStore';
import { isValidEmail, isValidPassword } from '../../utils/helpers';

const S = Strings.auth;

export default function SignUpScreen() {
  const navigation = useNavigation();
  const setUser = useAppStore((s) => s.setUser);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    if (!isValidEmail(email)) e.email = 'Please enter a valid email.';
    if (!isValidPassword(password)) e.password = 'Password must be at least 8 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await authService.signUpWithEmail({ fullName, email, password });
    setLoading(false);
    if (res.ok) {
      setUser(res.data.user);
      if (res.data.requiresVerification) {
        navigation.navigate(Routes.EMAIL_VERIFICATION, { email });
      } else {
        navigation.replace(Routes.MAIN_STACK);
      }
    } else {
      setErrors({ form: res.error });
    }
  };

  const handleGoogle = async () => {
    const res = await authService.signInWithGoogle();
    if (res.ok) {
      setUser(res.data.user);
      navigation.replace(Routes.MAIN_STACK);
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.white} keyboardAvoiding scrollable padded={false}>
      <AppHeader
        title={S.signUp}
        onBack={() => navigation.goBack()}
        borderBottom={false}
      />

      <View style={styles.body}>
        <AppInput
          label={S.fullName}
          placeholder="Sarah Johnson"
          value={fullName}
          onChangeText={(v) => { setFullName(v); setErrors({}); }}
          autoCapitalize="words"
          autoComplete="name"
          error={errors.fullName}
        />
        <AppInput
          label={S.email}
          placeholder="sarah@email.com"
          value={email}
          onChangeText={(v) => { setEmail(v); setErrors({}); }}
          keyboardType="email-address"
          autoComplete="email"
          error={errors.email}
        />
        <AppInput
          label={S.password}
          placeholder="Min. 8 characters"
          value={password}
          onChangeText={(v) => { setPassword(v); setErrors({}); }}
          secureTextEntry
          error={errors.password}
        />

        {errors.form ? (
          <Text style={styles.formError}>{errors.form}</Text>
        ) : null}

        <AppButton
          title={S.signUp}
          onPress={handleSignUp}
          loading={loading}
          style={styles.btn}
        />

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>{S.orContinueWith}</Text>
          <View style={styles.orLine} />
        </View>

        <SocialAuthButton provider="google" onPress={handleGoogle} style={styles.socialBtn} />

        <Text style={styles.terms}>
          {S.bySigningUp}{' '}
          <Text style={styles.termsLink}>{S.termsOfService}</Text>{' '}
          {S.and}{' '}
          <Text style={styles.termsLink}>{S.privacyPolicy}</Text>
        </Text>

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
  body: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  formError: {
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  btn: { marginBottom: Spacing.lg },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { fontSize: FontSize.xs, color: Colors.textMuted },
  socialBtn: { marginBottom: Spacing.xl },
  terms: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.xl,
  },
  termsLink: { color: Colors.primary, fontWeight: FontWeight.medium },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signinText: { fontSize: FontSize.sm, color: Colors.textMuted },
  signinLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
