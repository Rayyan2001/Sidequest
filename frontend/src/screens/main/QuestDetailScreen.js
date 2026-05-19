// src/screens/main/QuestDetailScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import Badge from '../../components/common/Badge';
import { LoadingState, ErrorState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { questService } from '../../services/api';
import { useAppStore } from '../../store/appStore';
import useAsync from '../../hooks/useAsync';

const S = Strings.quest;

function StepItem({ step, index }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepDot}>
        <MaterialIcons name="check" size={14} color={Colors.white} />
      </View>
      <Text style={styles.stepText}>{step.instruction}</Text>
    </View>
  );
}

export default function QuestDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params || {};
  const setActiveQuest = useAppStore((s) => s.setActiveQuest);
  const [starting, setStarting] = useState(false);

  const { data: quest, loading, error, refetch } = useAsync(
    () => questService.getQuestById(questId),
    [questId]
  );

  if (loading) return <LoadingState />;
  if (error || !quest) return <ErrorState message={error} onRetry={refetch} />;

  const handleStartQuest = async () => {
    setStarting(true);
    const res = await questService.startQuest(questId);
    setStarting(false);
    if (res.ok) {
      setActiveQuest(quest);
      navigation.navigate(Routes.PROGRESS_TRACKING, { questId });
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.white} padded={false}>
      <AppHeader
        title=""
        onBack={() => navigation.goBack()}
        rightIcon="ios-share"
        onRightPress={() => {}}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Image placeholder */}
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="local-cafe" size={72} color={Colors.white} />
        </View>

        <View style={styles.body}>
          {/* Sponsor */}
          {quest.isSponsored && (
            <View style={styles.sponsorRow}>
              <MaterialIcons name="eco" size={16} color={Colors.accent} />
              <Text style={styles.sponsorLabel}>
                {S.sponsoredBy} {quest.sponsoredBy}
              </Text>
            </View>
          )}

          <Text style={styles.title}>{quest.title}</Text>
          <Text style={styles.description}>{quest.description}</Text>

          {/* Tags */}
          {quest.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {quest.tags.map((tag) => (
                <Badge
                  key={tag}
                  label={tag}
                  color={Colors.backgroundTag}
                  textColor={Colors.primary}
                  style={styles.tag}
                />
              ))}
            </View>
          )}

          {/* Steps */}
          <Text style={styles.sectionLabel}>{S.steps}</Text>
          <View style={styles.stepsContainer}>
            {quest.steps.map((step, i) => (
              <StepItem key={step.id} step={step} index={i} />
            ))}
          </View>

          {/* Reward */}
          <View style={styles.rewardCard}>
            <Text style={styles.rewardLabel}>{S.reward}</Text>
            <Text style={styles.rewardAmount}>{quest.reward?.label}</Text>
            <View style={styles.creditsRow}>
              <MaterialIcons name="eco" size={14} color={Colors.accent} />
              <Text style={styles.creditsText}>{quest.reward?.credits} Green Credits</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Start button */}
      <View style={styles.footer}>
        <AppButton
          title={S.startQuest}
          onPress={handleStartQuest}
          loading={starting}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxl },
  imagePlaceholder: {
    height: 220,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: Spacing.base },
  sponsorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sponsorLabel: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.base,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tag: {},
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  stepsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  rewardCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rewardLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  rewardAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  creditsText: {
    fontSize: FontSize.xs,
    color: Colors.accent,
  },
  footer: {
    padding: Spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});
