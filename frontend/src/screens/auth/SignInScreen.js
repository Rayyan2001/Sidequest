// src/screens/auth/SignInScreen.js
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

export default function SignInScreen() {
  const navigation = useNavigation();
  const setUser = useAppStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!isValidEmail(email)) e.email = 'Please enter a valid email.';
    if (!isValidPassword(password)) e.password = 'Password must be at least 8 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await authService.signInWithEmail({ email, password });
    setLoading(false);
    if (res.ok) {
      setUser(res.data.user);
      navigation.replace(Routes.MAIN_STACK);
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
        title={S.signIn}
        onBack={() => navigation.goBack()}
        borderBottom={false}
      />

      <View style={styles.body}>
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
          placeholder="••••••••"
          value={password}
          onChangeText={(v) => { setPassword(v); setErrors({}); }}
          secureTextEntry
          error={errors.password}
        />

        <Text
          style={styles.forgotLink}
          onPress={() => {}}
          accessibilityRole="link"
        >
          {S.forgotPassword}
        </Text>

        {errors.form ? (
          <Text style={styles.formError}>{errors.form}</Text>
        ) : null}

        <AppButton
          title={S.signIn}
          onPress={handleSignIn}
          loading={loading}
          style={styles.btn}
        />

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>{S.orContinueWith}</Text>
          <View style={styles.orLine} />
        </View>

        <SocialAuthButton provider="google" onPress={handleGoogle} style={styles.socialBtn} />

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>{S.dontHaveAccount} </Text>
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate(Routes.SIGN_UP)}
            accessibilityRole="link"
          >
            {S.signUpFree}
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
  forgotLink: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    textAlign: 'right',
    marginBottom: Spacing.xl,
    marginTop: -Spacing.sm,
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
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  signupText: { fontSize: FontSize.sm, color: Colors.textMuted },
  signupLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
