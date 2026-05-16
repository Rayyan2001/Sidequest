// src/store/persist.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from './appStore';

const PERSIST_KEY = 'sidequest_persisted_state';

// Keys we want to persist across app sessions
const PERSISTED_KEYS = [
  'hasCompletedOnboarding',
  'permissionsGranted',
  'isAuthenticated',
  'isEmailVerified',
  'user',
  'balance',
  'greenCredits',
  'savedPlaceIds',
  'completedQuests',
  'notificationPrefs',
  'privacyPrefs',
  'settings',
];

/**
 * Load persisted state from AsyncStorage and hydrate the store.
 * Called once on app startup.
 */
export const loadPersistedState = async () => {
  try {
    const raw = await AsyncStorage.getItem(PERSIST_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);

    // Merge only the persisted keys into the store
    const partial = {};
    PERSISTED_KEYS.forEach((key) => {
      if (saved[key] !== undefined) {
        partial[key] = saved[key];
      }
    });

    useAppStore.setState(partial);
  } catch (err) {
    console.warn('[persist] Failed to load persisted state:', err);
  }
};

/**
 * Persist specified state keys to AsyncStorage.
 * Call this after any significant state change.
 */
export const persistState = async () => {
  try {
    const state = useAppStore.getState();
    const toPersist = {};
    PERSISTED_KEYS.forEach((key) => {
      toPersist[key] = state[key];
    });
    await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(toPersist));
  } catch (err) {
    console.warn('[persist] Failed to persist state:', err);
  }
};

/**
 * Clear all persisted state (used on logout / reset).
 */
export const clearPersistedState = async () => {
  try {
    await AsyncStorage.removeItem(PERSIST_KEY);
  } catch (err) {
    console.warn('[persist] Failed to clear persisted state:', err);
  }
};

// Subscribe to store changes and auto-persist
useAppStore.subscribe(() => {
  persistState();
});
