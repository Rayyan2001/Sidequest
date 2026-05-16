// src/constants/routes.js
// All navigation route names — centralized, no hardcoded strings in components

const Routes = {
  // Root stacks
  ROOT: 'Root',
  ONBOARDING_STACK: 'OnboardingStack',
  AUTH_STACK: 'AuthStack',
  MAIN_STACK: 'MainStack',

  // Onboarding
  ONBOARDING: 'Onboarding',
  PERMISSIONS: 'Permissions',

  // Auth — EmailVerification lives HERE so SignUpScreen can reach it
  WELCOME: 'Welcome',
  SIGN_IN: 'SignIn',
  SIGN_UP: 'SignUp',
  EMAIL_VERIFICATION: 'EmailVerification',

  // Main tab navigator (the container)
  MAIN_TABS: 'MainTabs',

  // Tab names — used as the screen name inside the BottomTabNavigator
  HOME_TAB: 'HomeTab',
  MAP_TAB: 'MapTab',
  REWARDS_TAB: 'RewardsTab',
  PROFILE_TAB: 'ProfileTab',

  // ── Screens nested inside each tab's own stack ──────────────────
  // All of these live inside their parent tab stack so tab bar stays visible

  // Home tab stack
  HOME: 'Home',
  QUEST_DETAIL: 'QuestDetail',
  PROGRESS_TRACKING: 'ProgressTracking',
  SUBMIT_PROOF: 'SubmitProof',
  VERIFYING: 'Verifying',
  QUEST_COMPLETED: 'QuestCompleted',
  CLAIM_REWARD: 'ClaimReward',
  QUEST_LIST: 'QuestList',

  // Map tab stack
  MAP: 'Map',
  SAVED_PLACE_DETAIL_MAP: 'SavedPlaceDetailMap', // opened from map

  // Rewards tab stack
  REWARDS: 'Rewards',

  // Profile tab stack — all settings/support go here
  PROFILE: 'Profile',
  ACTIVITY_HISTORY: 'ActivityHistory',
  ACTIVITY_DETAIL: 'ActivityDetail',
  SAVED_PLACES: 'SavedPlaces',
  SAVED_PLACE_DETAIL: 'SavedPlaceDetail',
  PAYMENT_METHODS: 'PaymentMethods',
  ADD_PAYMENT_METHOD: 'AddPaymentMethod',
  SETTINGS: 'Settings',
  NOTIFICATIONS_SETTINGS: 'NotificationsSettings',
  PRIVACY_SECURITY: 'PrivacyAndSecurity',
  HELP_SUPPORT: 'HelpAndSupport',
  CONTACT_US: 'ContactUs',
  FAQ: 'FAQ',
  EDIT_PROFILE: 'EditProfile',
};

export default Routes;
