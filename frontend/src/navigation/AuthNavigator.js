// src/navigation/AuthNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Routes from '../constants/routes';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import EmailVerificationScreen from '../screens/onboarding/EmailVerificationScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name={Routes.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={Routes.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={Routes.SIGN_UP} component={SignUpScreen} />
      {/* EmailVerification lives here so SignUpScreen can navigate to it directly */}
      <Stack.Screen name={Routes.EMAIL_VERIFICATION} component={EmailVerificationScreen} />
    </Stack.Navigator>
  );
}

