// src/constants/layout.js
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scale helpers
const guidelineBaseWidth = 390; // iPhone 14 reference
const guidelineBaseHeight = 844;

export const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const SCREEN_WIDTH_VAL = SCREEN_WIDTH;
export const SCREEN_HEIGHT_VAL = SCREEN_HEIGHT;

// Spacing system (8-point grid)
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  section: 48,
};

// Typography scale
export const FontSize = {
  xs: moderateScale(11),
  sm: moderateScale(13),
  base: moderateScale(15),
  md: moderateScale(17),
  lg: moderateScale(19),
  xl: moderateScale(22),
  xxl: moderateScale(26),
  xxxl: moderateScale(32),
  display: moderateScale(40),
};

// Font weights (cross-platform safe names)
export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Border radius
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 100,
  circle: 9999,
};

// Shadows — cross-platform
export const Shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: '#1A4731',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#1A4731',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#1A4731',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),
};

// Min touch target size (accessibility)
export const TOUCH_TARGET = 44;

// Screen padding
export const SCREEN_PADDING = Spacing.base;
export const CARD_PADDING = Spacing.base;

// Tab bar height
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 84 : 64;

// Header height
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 96 : 64;
