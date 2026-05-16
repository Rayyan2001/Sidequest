// src/screens/main/QuestCompletedScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';
import { formatBalance } from '../../utils/helpers';

const S = Strings.questCompleted;

export default function QuestCompletedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params || {};
  const { activeQuest, addCompletedQuest, clearActiveQuest } = useAppStore();

  const reward = activeQuest?.reward;

  const handleViewRewards = () => {
    if (activeQuest) {
      addCompletedQuest(activeQuest);
      clearActiveQuest();
    }
    navigation.navigate(Routes.CLAIM_REWARD, { questId });
  };

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.container}>
        {/* Confetti-like particles (decorative) */}
        <View style={styles.confettiRow}>
          {['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((c, i) => (
            <View key={i} style={[styles.confetti, { backgroundColor: c, transform: [{ rotate: `${i * 25}deg` }] }]} />
          ))}
        </View>

        {/* Check icon */}
        <View style={styles.iconCircle}>
          <MaterialIcons name="check" size={52} color={Colors.white} />
        </View>

        <Text style={styles.title}>{S.title}</Text>

        <View style={styles.rewardCard}>
          <Text style={styles.youEarned}>{S.youEarned}</Text>
          <Text style={styles.amount}>{reward?.label || '£2.00'}</Text>
          <View style={styles.creditsRow}>
            <MaterialIcons name="eco" size={16} color={Colors.accent} />
            <Text style={styles.credits}>{reward?.credits || 50} Green Credits</Text>
          </View>
        </View>

        <View style={styles.messageRow}>
          <MaterialIcons name="eco" size={20} color={Colors.accent} />
          <View style={styles.messageContent}>
            <Text style={styles.greatJob}>{S.greatJob}</Text>
            <Text style={styles.helpMsg}>{S.helpingMessage}</Text>
          </View>
        </View>

        <AppButton
          title={S.viewRewards}
          onPress={handleViewRewards}
          style={styles.btn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  confettiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  confetti: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  rewardCard: {
    width: '100%',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  youEarned: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  amount: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  credits: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.medium,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
    width: '100%',
    backgroundColor: Colors.backgroundTag,
    borderRadius: Radius.lg,
    padding: Spacing.base,
  },
  messageContent: { flex: 1 },
  greatJob: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginBottom: 2,
  },
  helpMsg: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  btn: { width: '100%' },
});
