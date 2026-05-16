// src/screens/main/ProgressTrackingScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';
import { interpolate } from '../../utils/helpers';

const S = Strings.quest;

export default function ProgressTrackingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params || {};
  const activeQuest = useAppStore((s) => s.activeQuest);

  const currentStep = 2; // Mock: step 2 of 3
  const totalSteps = activeQuest?.totalSteps || 3;
  const progress = currentStep / totalSteps;

  return (
    <ScreenContainer backgroundColor={Colors.white} padded={false}>
      <AppHeader title={S.inProgress} onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Map placeholder */}
        <View style={styles.mapPlaceholder}>
          <MaterialIcons name="map" size={48} color={Colors.textMuted} />
        </View>

        <View style={styles.content}>
          {/* Steps */}
          <View style={styles.stepHeader}>
            <Text style={styles.stepLabel}>
              {interpolate(S.stepOf, { current: currentStep, total: totalSteps })}
            </Text>
            <Text style={styles.stepHint}>{S.youreAlmostThere}</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          {/* Current step */}
          {activeQuest?.steps?.map((step, i) => (
            <View key={step.id} style={[styles.stepRow, i < currentStep - 1 && styles.stepDone]}>
              <View style={[styles.stepDot, i < currentStep - 1 && styles.stepDotDone]}>
                {i < currentStep - 1
                  ? <MaterialIcons name="check" size={14} color={Colors.white} />
                  : <Text style={styles.stepNum}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepText, i < currentStep - 1 && styles.stepTextDone]}>
                {step.instruction}
              </Text>
            </View>
          ))}

          <AppButton
            title={S.viewDetails}
            onPress={() => navigation.navigate(Routes.SUBMIT_PROOF, { questId })}
            style={styles.btn}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  mapPlaceholder: {
    height: 200,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: { padding: Spacing.base, flex: 1 },
  stepHeader: { marginBottom: Spacing.base },
  stepLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium },
  stepHint: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: 2 },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.pill,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepDone: { opacity: 0.6 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: Colors.primary },
  stepNum: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted },
  stepText: { fontSize: FontSize.base, color: Colors.textPrimary, flex: 1 },
  stepTextDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },
  btn: { marginTop: 'auto' },
});
