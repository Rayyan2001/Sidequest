// src/navigation/MainNavigator.js
//
// Architecture: Each tab gets its OWN nested stack navigator.
// This ensures:
//   ✅ Tab bar stays visible on every screen (sub-screens push within the tab)
//   ✅ navigate('QuestDetail') works from any screen within the same tab stack
//   ✅ Cross-tab navigation uses navigate('MapTab') which works inside BottomTabNavigator
//
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { Spacing, FontSize, TAB_BAR_HEIGHT } from '../constants/layout';
import Routes from '../constants/routes';
import Strings from '../constants/strings';

// ── Tab root screens ──────────────────────────────────────────────
import HomeScreen from '../screens/main/HomeScreen';
import MapScreen from '../screens/main/MapScreen';
import RewardsScreen from '../screens/main/RewardsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// ── Home tab sub-screens ──────────────────────────────────────────
import QuestDetailScreen from '../screens/main/QuestDetailScreen';
import ProgressTrackingScreen from '../screens/main/ProgressTrackingScreen';
import SubmitProofScreen from '../screens/main/SubmitProofScreen';
import VerifyingScreen from '../screens/main/VerifyingScreen';
import QuestCompletedScreen from '../screens/main/QuestCompletedScreen';
import ClaimRewardScreen from '../screens/main/ClaimRewardScreen';
import QuestListScreen from '../screens/main/QuestListScreen';

// ── Map tab sub-screens ───────────────────────────────────────────
import SavedPlaceDetailScreen from '../screens/main/SavedPlaceDetailScreen';

// ── Profile tab sub-screens ───────────────────────────────────────
import ActivityHistoryScreen from '../screens/main/ActivityHistoryScreen';
import ActivityDetailScreen from '../screens/main/ActivityDetailScreen';
import SavedPlacesScreen from '../screens/main/SavedPlacesScreen';
import PaymentMethodsScreen from '../screens/main/PaymentMethodsScreen';
import AddPaymentMethodScreen from '../screens/main/AddPaymentMethodScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import NotificationsSettingsScreen from '../screens/main/NotificationsSettingsScreen';
import PrivacySecurityScreen from '../screens/main/PrivacySecurityScreen';
import HelpSupportScreen from '../screens/main/HelpSupportScreen';
import ContactUsScreen from '../screens/main/ContactUsScreen';
import FAQScreen from '../screens/main/FAQScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';

const Tab = createBottomTabNavigator();

// ─── Per-tab stack factories ──────────────────────────────────────
// Using a factory avoids re-creating the Stack on every render

const HomeStack = createNativeStackNavigator();
function HomeTabStack() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={Routes.HOME} component={HomeScreen} />
      <HomeStack.Screen name={Routes.QUEST_DETAIL} component={QuestDetailScreen} />
      <HomeStack.Screen name={Routes.QUEST_LIST} component={QuestListScreen} />
      <HomeStack.Screen name={Routes.PROGRESS_TRACKING} component={ProgressTrackingScreen} />
      <HomeStack.Screen name={Routes.SUBMIT_PROOF} component={SubmitProofScreen} />
      <HomeStack.Screen name={Routes.VERIFYING} component={VerifyingScreen} />
      <HomeStack.Screen name={Routes.QUEST_COMPLETED} component={QuestCompletedScreen} />
      <HomeStack.Screen name={Routes.CLAIM_REWARD} component={ClaimRewardScreen} />
    </HomeStack.Navigator>
  );
}

const MapStack = createNativeStackNavigator();
function MapTabStack() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name={Routes.MAP} component={MapScreen} />
      <MapStack.Screen name={Routes.SAVED_PLACE_DETAIL_MAP} component={SavedPlaceDetailScreen} />
    </MapStack.Navigator>
  );
}

const RewardsStack = createNativeStackNavigator();
function RewardsTabStack() {
  return (
    <RewardsStack.Navigator screenOptions={{ headerShown: false }}>
      <RewardsStack.Screen name={Routes.REWARDS} component={RewardsScreen} />
    </RewardsStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileTabStack() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name={Routes.PROFILE} component={ProfileScreen} />
      <ProfileStack.Screen name={Routes.ACTIVITY_HISTORY} component={ActivityHistoryScreen} />
      <ProfileStack.Screen name={Routes.ACTIVITY_DETAIL} component={ActivityDetailScreen} />
      <ProfileStack.Screen name={Routes.SAVED_PLACES} component={SavedPlacesScreen} />
      <ProfileStack.Screen name={Routes.SAVED_PLACE_DETAIL} component={SavedPlaceDetailScreen} />
      <ProfileStack.Screen name={Routes.PAYMENT_METHODS} component={PaymentMethodsScreen} />
      <ProfileStack.Screen name={Routes.ADD_PAYMENT_METHOD} component={AddPaymentMethodScreen} />
      <ProfileStack.Screen name={Routes.SETTINGS} component={SettingsScreen} />
      <ProfileStack.Screen name={Routes.NOTIFICATIONS_SETTINGS} component={NotificationsSettingsScreen} />
      <ProfileStack.Screen name={Routes.PRIVACY_SECURITY} component={PrivacySecurityScreen} />
      <ProfileStack.Screen name={Routes.HELP_SUPPORT} component={HelpSupportScreen} />
      <ProfileStack.Screen name={Routes.CONTACT_US} component={ContactUsScreen} />
      <ProfileStack.Screen name={Routes.FAQ} component={FAQScreen} />
      <ProfileStack.Screen name={Routes.EDIT_PROFILE} component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// ─── Tab icon map ─────────────────────────────────────────────────
const TAB_ICON_MAP = {
  [Routes.HOME_TAB]: 'home',
  [Routes.MAP_TAB]: 'map',
  [Routes.REWARDS_TAB]: 'card-giftcard',
  [Routes.PROFILE_TAB]: 'person',
};

// ─── Root: BottomTabNavigator wrapping all tab stacks ─────────────
export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={TAB_ICON_MAP[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name={Routes.HOME_TAB}
        component={HomeTabStack}
        options={{ tabBarLabel: Strings.nav.home }}
      />
      <Tab.Screen
        name={Routes.MAP_TAB}
        component={MapTabStack}
        options={{ tabBarLabel: Strings.nav.map }}
      />
      <Tab.Screen
        name={Routes.REWARDS_TAB}
        component={RewardsTabStack}
        options={{ tabBarLabel: Strings.nav.rewards }}
      />
      <Tab.Screen
        name={Routes.PROFILE_TAB}
        component={ProfileTabStack}
        options={{ tabBarLabel: Strings.nav.profile }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors.tabBackground,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.sm,
    paddingTop: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginTop: 2,
  },
});
