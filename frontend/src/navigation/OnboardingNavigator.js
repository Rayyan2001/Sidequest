// src/navigation/OnboardingNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Routes from '../constants/routes';

import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name={Routes.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={Routes.PERMISSIONS} component={PermissionsScreen} />
    </Stack.Navigator>
  );
}
