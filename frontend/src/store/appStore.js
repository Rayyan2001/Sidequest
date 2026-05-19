// src/store/appStore.js
import { create } from 'zustand';

/**
 * Central Zustand store.
 * Persistence is handled separately in src/store/persist.js
 * to avoid circular dependencies and keep this pure.
 */
export const useAppStore = create((set, get) => ({
  // ─── Hydration ───────────────────────────────────────────────
  isHydrated: false,
  setHydrated: (val) => set({ isHydrated: val }),

  // ─── Onboarding ──────────────────────────────────────────────
  hasCompletedOnboarding: false,
  setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
  resetOnboarding: () => set({ hasCompletedOnboarding: false }),

  // ─── Permissions ─────────────────────────────────────────────
  permissionsGranted: false,
  setPermissionsGranted: (val) => set({ permissionsGranted: val }),

  // ─── Auth ────────────────────────────────────────────────────
  isAuthenticated: false,
  isEmailVerified: false,
  user: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setEmailVerified: (val) => set({ isEmailVerified: val }),
  logout: () =>
    set({
      isAuthenticated: false,
      isEmailVerified: false,
      user: null,
    }),

  // ─── UI State ────────────────────────────────────────────────
  isLoading: false,
  setLoading: (val) => set({ isLoading: val }),

  error: null,
  setError: (err) => set({ error: err }),
  clearError: () => set({ error: null }),

  // ─── Quests ──────────────────────────────────────────────────
  activeQuest: null,
  setActiveQuest: (quest) => set({ activeQuest: quest }),
  clearActiveQuest: () => set({ activeQuest: null }),

  questProgress: null,
  setQuestProgress: (progress) => set({ questProgress: progress }),

  completedQuests: [],
  addCompletedQuest: (quest) =>
    set((state) => ({
      completedQuests: [quest, ...state.completedQuests],
    })),

  // ─── Balance ─────────────────────────────────────────────────
  balance: 1250, // pence — £12.50
  greenCredits: 125,
  addReward: ({ amount, credits }) =>
    set((state) => ({
      balance: state.balance + amount,
      greenCredits: state.greenCredits + credits,
    })),

  // ─── Saved Places ────────────────────────────────────────────
  savedPlaceIds: [],
  toggleSavedPlace: (placeId) =>
    set((state) => {
      const already = state.savedPlaceIds.includes(placeId);
      return {
        savedPlaceIds: already
          ? state.savedPlaceIds.filter((id) => id !== placeId)
          : [...state.savedPlaceIds, placeId],
      };
    }),

  // ─── Notification preferences ────────────────────────────────
  notificationPrefs: {
    pushEnabled: true,
    questReminders: true,
    newQuests: true,
    rewardsOffers: true,
    messages: true,
    marketing: false,
  },
  updateNotificationPref: (key, val) =>
    set((state) => ({
      notificationPrefs: { ...state.notificationPrefs, [key]: val },
    })),

  // ─── Privacy preferences ─────────────────────────────────────
  privacyPrefs: {
    activityTracking: true,
    locationAccess: true,
    biometricLogin: true,
    twoFactorAuth: false,
  },
  updatePrivacyPref: (key, val) =>
    set((state) => ({
      privacyPrefs: { ...state.privacyPrefs, [key]: val },
    })),

  // ─── App settings ────────────────────────────────────────────
  settings: {
    darkMode: false,
    language: 'English',
    locationEnabled: true,
  },
  updateSetting: (key, val) =>
    set((state) => ({
      settings: { ...state.settings, [key]: val },
    })),
}));
