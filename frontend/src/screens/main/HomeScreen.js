// src/screens/main/HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import BalanceCard from '../../components/common/BalanceCard';
import { TodaysQuestCard } from '../../components/quest/QuestCard';
import QuestCard from '../../components/quest/QuestCard';
import { SectionHeader } from '../../components/common/Divider';
import { LoadingState, ErrorState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Spacing, Radius } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';
import { questService } from '../../services/api';
import useAsync from '../../hooks/useAsync';

const S = Strings.home;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, balance, greenCredits } = useAppStore();
  const firstName = user?.fullName?.split(' ')[0] || 'There';

  const { data: quests, loading, error, refetch } = useAsync(questService.getNearbyQuests);

  const todaysQuest = quests?.[0] || null;
  const nearbyQuests = quests?.slice(1, 3) || [];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false} statusBarStyle="dark">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {S.greeting}, {firstName} {S.greetingEmoji}
            </Text>
            <Text style={styles.subGreeting}>{S.makeAnImpact}</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <MaterialIcons name="notifications-none" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Balance */}
          <BalanceCard
            balance={balance}
            greenCredits={greenCredits}
            onRedeem={() => navigation.navigate(Routes.REWARDS_TAB, { screen: Routes.REWARDS })}
            style={styles.card}
          />

          {/* Today's Quest */}
          <SectionHeader
            title={S.todaysQuest}
            action={S.viewAll}
            onActionPress={() => navigation.navigate(Routes.QUEST_LIST)}
          />
          {todaysQuest && (
            <TodaysQuestCard
              quest={todaysQuest}
              onPress={() => navigation.navigate(Routes.QUEST_DETAIL, { questId: todaysQuest.id })}
              style={styles.card}
            />
          )}

          {/* Nearby Quests */}
          <SectionHeader
            title={S.nearbyQuests}
            action={S.seeAll}
            onActionPress={() => navigation.navigate(Routes.QUEST_LIST)}
            style={styles.sectionHeader}
          />
          {nearbyQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onPress={() => navigation.navigate(Routes.QUEST_DETAIL, { questId: quest.id })}
              compact
              style={styles.card}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  greeting: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subGreeting: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  card: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    marginTop: Spacing.sm,
  },
});
