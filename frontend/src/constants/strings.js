// src/constants/strings.js
// All user-facing strings centralized here — no hardcoded strings in components

const Strings = {
  // App
  appName: 'SideQuest',
  appTagline: 'Do good. Get rewarded.',
  appSubtitle: 'Discover local places, complete quests, earn rewards and support businesses that care.',

  // Onboarding
  onboarding: {
    slides: [
      {
        id: 'discover',
        title: 'Discover Local Quests',
        subtitle: 'Find eco-friendly quests and sustainable businesses near you.',
        icon: 'location-on',
      },
      {
        id: 'complete',
        title: 'Complete & Verify',
        subtitle: 'Follow simple steps, take action, and verify your visit instantly.',
        icon: 'check-circle',
      },
      {
        id: 'earn',
        title: 'Earn Rewards',
        subtitle: 'Get rewarded with credits and exclusive offers for doing good.',
        icon: 'card-giftcard',
      },
      {
        id: 'impact',
        title: 'Track Your Impact',
        subtitle: 'See your CO₂ saved and positive impact on the planet.',
        icon: 'eco',
      },
    ],
    next: 'Next',
    skip: 'Skip',
    getStarted: 'Get Started',
  },

  // Auth
  auth: {
    welcomeTo: 'Welcome to',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    continueWithEmail: 'Continue with Email',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    alreadyHaveAccount: 'Already have an account?',
    logIn: 'Log in',
    dontHaveAccount: "Don't have an account?",
    signUpFree: 'Sign up free',
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot password?',
    orContinueWith: 'or continue with',
    bySigningUp: 'By signing up, you agree to our',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
  },

  // Permissions
  permissions: {
    title: 'We need a few permissions',
    subtitle: 'These help us verify your actions and show you relevant quests.',
    location: 'Location',
    locationDesc: 'To find quests near you',
    camera: 'Camera',
    cameraDesc: 'To scan QR codes',
    notifications: 'Notifications',
    notificationsDesc: 'To send updates and rewards',
    activityTracking: 'Activity Tracking',
    activityTrackingDesc: 'To improve your experience',
    continueBtn: 'Continue',
    changeLater: 'You can change this later in settings.',
  },

  // Email Verification
  emailVerification: {
    title: 'Verify your email',
    subtitle: "We've sent a verification link to",
    instruction: 'Please check your inbox and click the link to continue.',
    resendEmail: 'Resend email',
    changeEmail: 'Change email',
  },

  // Home / Dashboard
  home: {
    greeting: 'Hello',
    greetingEmoji: '👋',
    makeAnImpact: "Let's make an impact today.",
    yourBalance: 'Your Balance',
    redeem: 'Redeem',
    greenCredits: 'Green Credits',
    todaysQuest: "Today's Quest",
    viewAll: 'View all',
    nearbyQuests: 'Nearby Quests',
    seeAll: 'See all',
    earn: 'Earn',
  },

  // Quest
  quest: {
    startQuest: 'Start Quest',
    inProgress: 'In Progress',
    completed: 'Completed',
    viewDetails: 'View Details',
    steps: 'Steps',
    reward: 'Reward',
    sponsoredBy: 'Sponsored by',
    youreAlmostThere: "You're almost there!",
    stepOf: 'Step {current} of {total}',
  },

  // Submit Proof
  submitProof: {
    title: 'Scan the QR code at the counter',
    subtitle: 'This verifies your visit and completes the quest.',
  },

  // Verifying
  verifying: {
    title: 'Verifying your action',
    subtitle: 'Please wait a moment while we confirm your visit.',
  },

  // Quest Completed
  questCompleted: {
    title: 'Quest Completed!',
    youEarned: 'You earned',
    greatJob: 'Great job!',
    helpingMessage: "You're helping local businesses and the planet.",
    viewRewards: 'View Rewards',
  },

  // Claim Reward
  claimReward: {
    title: 'Your Reward',
    chooseHow: 'Choose how to claim',
    addToBalance: 'Add to Balance',
    addToBalanceDesc: 'Use credits later',
    instantDiscount: 'Instant Discount',
    instantDiscountDesc: 'Use at this store',
    sendToFriend: 'Send to Friend',
    sendToFriendDesc: 'Share your reward',
    claimBtn: 'Claim Reward',
  },

  // Rewards
  rewards: {
    title: 'Rewards',
    yourBalance: 'Your Balance',
    greenCredits: 'Green Credits',
    redeemOffers: 'Redeem Offers',
    seeAll: 'See all',
    minSpend: 'Min spend',
    perDay: 'per day',
  },

  // Profile
  profile: {
    memberSince: 'Member since',
    questsCompleted: 'Quests Completed',
    co2Saved: 'CO₂ Saved',
    badgesEarned: 'Badges Earned',
    activityHistory: 'Activity History',
    savedPlaces: 'Saved Places',
    paymentMethods: 'Payment Methods',
    settings: 'Settings',
    helpAndSupport: 'Help & Support',
  },

  // Activity History
  activityHistory: {
    title: 'Activity History',
    all: 'All',
    completed: 'Completed',
    rewardsTab: 'Rewards',
  },

  // Activity Details
  activityDetails: {
    title: 'Activity Details',
    status: 'Status',
    type: 'Type',
    date: 'Date',
    reward: 'Reward',
    paymentMethod: 'Payment Method',
    receiptProof: 'Receipt / Proof',
    view: 'View',
    questType: 'Quest',
    walletBalance: 'Wallet Balance',
  },

  // Saved Places
  savedPlaces: {
    title: 'Saved Places',
    discoverMore: 'Discover More Places',
    viewOnMap: 'View on Map',
    activeQuests: 'Active Quests',
    whyYoullLoveIt: "Why you'll love it",
  },

  // Payment Methods
  paymentMethods: {
    title: 'Payment Methods',
    walletBalance: 'Wallet Balance',
    addPaymentMethod: 'Add Payment Method',
    card: 'Card',
    paypal: 'PayPal',
    other: 'Other',
    cardNumber: 'Card Number',
    nameOnCard: 'Name on Card',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    country: 'Country',
    setDefault: 'Set as default payment method',
    saveCard: 'Save Card',
    cancel: 'Cancel',
    default: 'Default',
    secureInfo: 'Your payment information is secure',
  },

  // Settings
  settings: {
    title: 'Settings',
    account: 'Account',
    editProfile: 'Edit Profile',
    preferences: 'Preferences',
    app: 'App',
    notifications: 'Notifications',
    privacyAndSecurity: 'Privacy & Security',
    language: 'Language',
    darkMode: 'Dark Mode',
    location: 'Location',
    more: 'More',
    aboutSideQuest: 'About SideQuest',
    termsAndConditions: 'Terms & Conditions',
    logOut: 'Log Out',
    english: 'English',
    on: 'On',
  },

  // Notifications Settings
  notificationsSettings: {
    title: 'Notifications',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'Receive updates about quests, rewards and offers.',
    whatToReceive: 'What you want to receive',
    questReminders: 'Quest Reminders',
    questRemindersDesc: 'Reminders for ongoing quests',
    newQuests: 'New Quests',
    newQuestsDesc: 'Get notified about new quests',
    rewardsOffers: 'Rewards & Offers',
    rewardsOffersDesc: 'Exclusive rewards and discounts',
    messages: 'Messages',
    messagesDesc: 'Important updates and messages',
    marketing: 'Marketing',
    marketingDesc: 'News and special promotions',
  },

  // Privacy & Security
  privacySecurity: {
    title: 'Privacy & Security',
    privacy: 'Privacy',
    dataPrivacy: 'Data & Privacy',
    dataPrivacyDesc: 'Manage your data and permissions',
    locationAccess: 'Location Access',
    locationAccessDesc: 'Manage your location permissions',
    activityTracking: 'Activity Tracking',
    activityTrackingDesc: 'Allow tracking to improve experience',
    security: 'Security',
    changePassword: 'Change Password',
    biometricLogin: 'Biometric Login',
    biometricLoginDesc: 'Use face ID to login',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorAuthDesc: 'Add an extra layer of security',
    dataEncrypted: 'Your data is encrypted and secure',
    noShareData: 'We never share your data with third parties.',
  },

  // Help & Support
  helpSupport: {
    title: 'Help & Support',
    hiMessage: 'Hi',
    howCanWeHelp: 'How can we help you today?',
    searchPlaceholder: 'Search for help topics',
    quickSupport: 'Quick Support',
    helpCenter: 'Help Center',
    helpCenterDesc: 'Find answers to common questions',
    contactUs: 'Contact Us',
    contactUsDesc: 'Get in touch with our support team',
    reportIssue: 'Report an Issue',
    reportIssueDesc: 'Let us know if something went wrong',
    shareFeedback: 'Share Feedback',
    shareFeedbackDesc: 'Help us improve SideQuest',
    weAreHere: "We're here to help!",
    usuallyReplies: 'Usually replies within a few hours',
    contactUsTitle: 'Contact Us',
    weAreHereFor: "We're here for you",
    contactDesc: 'Send us a message and our team will get back to you.',
    subject: 'Subject',
    subjectPlaceholder: 'I need help with a quest',
    message: 'Message',
    messagePlaceholder: 'I completed the quest but didn\'t receive my reward.',
    attachments: 'Attachments (optional)',
    addScreenshot: 'Add Screenshot',
    sendMessage: 'Send Message',
    stillNeedHelp: 'Still need help?',
    contactSupportTeam: 'Contact our support team',
    faqTitle: 'Help Center',
    searchFAQs: 'Search FAQs',
    popular: 'Popular',
    quests: 'Quests',
    rewardsTab: 'Rewards',
    account: 'Account',
  },

  // Map
  map: {
    title: 'Map',
    nearYou: 'Near You',
  },

  // Navigation labels
  nav: {
    home: 'Home',
    map: 'Map',
    rewards: 'Rewards',
    profile: 'Profile',
  },

  // General
  general: {
    back: 'Back',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    retry: 'Retry',
    done: 'Done',
    edit: 'Edit',
    delete: 'Delete',
    share: 'Share',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    off: 'Off',
    while: 'While Using the App',
  },
};

export default Strings;
