// src/screens/onboarding/OnboardingScreen.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Spacing, Radius } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';

const { slides } = Strings.onboarding;

function Slide({ item, width }) {
  const iconMap = {
    'location-on': 'location-on',
    'check-circle': 'check-circle',
    'card-giftcard': 'card-giftcard',
    eco: 'eco',
  };

  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.iconCircle}>
        <MaterialIcons name={iconMap[item.icon] || 'star'} size={64} color={Colors.primary} />
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  );
}

function Dots({ count, active }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === active && styles.dotActive]}
        />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const flatRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

  const isLast = activeIndex === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      finishOnboarding();
    } else {
      const nextIndex = activeIndex + 1;
      flatRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }
  };

  const handleSkip = () => finishOnboarding();

  const finishOnboarding = () => {
    setOnboardingComplete();
    navigation.reset({ index: 0, routes: [{ name: Routes.AUTH_STACK }] });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} statusBarStyle="dark" padded={false}>
      {/* Skip */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={handleSkip}
        accessibilityLabel={Strings.onboarding.skip}
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>{Strings.onboarding.skip}</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Slide item={item} width={width} />}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        style={styles.list}
      />

      {/* Bottom section */}
      <View style={styles.bottom}>
        <Dots count={slides.length} active={activeIndex} />

        <AppButton
          title={isLast ? Strings.onboarding.getStarted : Strings.onboarding.next}
          onPress={handleNext}
          style={styles.nextBtn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  skipBtn: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  list: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.section,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  slideTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slideSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  nextBtn: {
    width: '100%',
  },
});
