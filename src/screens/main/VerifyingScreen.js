// src/screens/main/VerifyingScreen.js
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';

const S = Strings.verifying;

export default function VerifyingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params || {};

  useEffect(() => {
    // Simulate verification delay then navigate
    const timer = setTimeout(() => {
      navigation.replace(Routes.QUEST_COMPLETED, { questId });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.container}>
        <View style={styles.ring}>
          <View style={styles.iconInner}>
            <ActivityIndicator size={48} color={Colors.primary} />
          </View>
        </View>
        <Text style={styles.title}>{S.title}</Text>
        <Text style={styles.subtitle}>{S.subtitle}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
});
