// src/navigation/RootNavigator.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppStore } from '../store/appStore';
import Colors from '../constants/colors';
import Routes from '../constants/routes';

import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isHydrated, hasCompletedOnboarding, isAuthenticated } = useAppStore();

  // Wait for AsyncStorage hydration before rendering
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  /**
   * Navigation decision tree:
   * 1. First-time user           → OnboardingStack
   * 2. Not authenticated         → AuthStack
   * 3. Authenticated             → MainStack (BottomTabNavigator)
   */
  const getInitialRoute = () => {
    if (!hasCompletedOnboarding) return Routes.ONBOARDING_STACK;
    if (!isAuthenticated) return Routes.AUTH_STACK;
    return Routes.MAIN_STACK;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name={Routes.ONBOARDING_STACK} component={OnboardingNavigator} />
        <Stack.Screen name={Routes.AUTH_STACK} component={AuthNavigator} />
        {/*
          MainNavigator IS the BottomTabNavigator (no extra wrapper stack).
          Each tab has its own nested stack — sub-screens push within the tab
          so the tab bar always remains visible.
        */}
        <Stack.Screen name={Routes.MAIN_STACK} component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
