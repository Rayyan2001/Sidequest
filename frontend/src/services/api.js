// src/services/api.js
// Mock service layer — mirrors real API shape. Swap implementations later.

import {
  MOCK_USER,
  MOCK_QUESTS,
  MOCK_ACTIVITY_HISTORY,
  MOCK_REDEEM_OFFERS,
  MOCK_SAVED_PLACES,
  MOCK_PAYMENT_METHODS,
  MOCK_FAQ,
  MOCK_MAP_LOCATIONS,
} from './mockData';

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

const success = (data) => ({ ok: true, data, error: null });
const failure = (message) => ({ ok: false, data: null, error: message });

// ─── Auth ──────────────────────────────────────────────────────

export const authService = {
  signInWithEmail: async ({ email, password }) => {
    await delay(800);
    if (!email || !password) return failure('Email and password are required.');
    return success({ user: { ...MOCK_USER, email } });
  },

  signUpWithEmail: async ({ fullName, email, password }) => {
    await delay(800);
    if (!fullName || !email || !password) return failure('All fields are required.');
    return success({ user: { ...MOCK_USER, fullName, email }, requiresVerification: true });
  },

  signInWithGoogle: async () => {
    await delay(600);
    return success({ user: MOCK_USER });
  },

  signInWithApple: async () => {
    await delay(600);
    return success({ user: MOCK_USER });
  },

  resendVerificationEmail: async (email) => {
    await delay(500);
    return success({ sent: true, email });
  },

  signOut: async () => {
    await delay(300);
    return success({ signed_out: true });
  },
};

// ─── Quests ────────────────────────────────────────────────────

export const questService = {
  getNearbyQuests: async () => {
    await delay(700);
    return success(MOCK_QUESTS);
  },

  getTodaysQuest: async () => {
    await delay(400);
    return success(MOCK_QUESTS[0]);
  },

  getQuestById: async (id) => {
    await delay(300);
    const quest = MOCK_QUESTS.find((q) => q.id === id);
    if (!quest) return failure('Quest not found.');
    return success(quest);
  },

  startQuest: async (questId) => {
    await delay(400);
    const quest = MOCK_QUESTS.find((q) => q.id === questId);
    if (!quest) return failure('Quest not found.');
    return success({ questId, started: true, progress: 0 });
  },

  submitQRCode: async ({ questId, code }) => {
    await delay(1500); // simulate verification delay
    if (!code) return failure('No QR code provided.');
    return success({ questId, verified: true });
  },

  claimReward: async ({ questId, method }) => {
    await delay(600);
    const quest = MOCK_QUESTS.find((q) => q.id === questId);
    if (!quest) return failure('Quest not found.');
    return success({ questId, method, reward: quest.reward, claimed: true });
  },
};

// ─── Activity ──────────────────────────────────────────────────

export const activityService = {
  getHistory: async () => {
    await delay(500);
    return success(MOCK_ACTIVITY_HISTORY);
  },

  getActivityById: async (id) => {
    await delay(300);
    const item = MOCK_ACTIVITY_HISTORY.find((a) => a.id === id);
    if (!item) return failure('Activity not found.');
    return success(item);
  },
};

// ─── Rewards ───────────────────────────────────────────────────

export const rewardsService = {
  getRedeemOffers: async () => {
    await delay(500);
    return success(MOCK_REDEEM_OFFERS);
  },

  redeemOffer: async (offerId) => {
    await delay(800);
    const offer = MOCK_REDEEM_OFFERS.find((o) => o.id === offerId);
    if (!offer) return failure('Offer not found.');
    return success({ offerId, redeemed: true });
  },
};

// ─── Places ────────────────────────────────────────────────────

export const placesService = {
  getSavedPlaces: async () => {
    await delay(500);
    return success(MOCK_SAVED_PLACES);
  },

  getPlaceById: async (id) => {
    await delay(300);
    const place = MOCK_SAVED_PLACES.find((p) => p.id === id);
    if (!place) return failure('Place not found.');
    return success(place);
  },

  getNearbyPlaces: async () => {
    await delay(600);
    return success(MOCK_SAVED_PLACES);
  },

  getMapLocations: async () => {
    await delay(400);
    return success(MOCK_MAP_LOCATIONS);
  },
};

// ─── Payments ──────────────────────────────────────────────────

export const paymentService = {
  getPaymentMethods: async () => {
    await delay(500);
    return success(MOCK_PAYMENT_METHODS);
  },

  addCard: async (cardData) => {
    await delay(900);
    const newCard = {
      id: `pm_${Date.now()}`,
      type: 'card',
      brand: 'visa',
      last4: cardData.cardNumber?.slice(-4) || '0000',
      expiry: cardData.expiry || '01/30',
      name: cardData.name,
      isDefault: cardData.isDefault || false,
    };
    return success(newCard);
  },

  removePaymentMethod: async (id) => {
    await delay(400);
    return success({ id, removed: true });
  },

  setDefault: async (id) => {
    await delay(300);
    return success({ id, isDefault: true });
  },
};

// ─── User / Profile ────────────────────────────────────────────

export const userService = {
  getProfile: async () => {
    await delay(400);
    return success(MOCK_USER);
  },

  updateProfile: async (updates) => {
    await delay(600);
    return success({ ...MOCK_USER, ...updates });
  },
};

// ─── Support ───────────────────────────────────────────────────

export const supportService = {
  getFAQs: async (category = 'Popular') => {
    await delay(400);
    const filtered = MOCK_FAQ.filter((f) => f.category.includes(category));
    return success(filtered);
  },

  sendMessage: async ({ subject, message }) => {
    await delay(800);
    if (!subject || !message) return failure('Subject and message are required.');
    return success({ sent: true });
  },
};
