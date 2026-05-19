// src/screens/main/QuestListScreen.js
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import QuestCard from '../../components/quest/QuestCard';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/layout';
import Routes from '../../constants/routes';
import { questService } from '../../services/api';
import useAsync from '../../hooks/useAsync';

export default function QuestListScreen() {
  const navigation = useNavigation();
  const { data: quests, loading, error, refetch } = useAsync(questService.getNearbyQuests);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title="All Quests" onBack={() => navigation.goBack()} />
      <FlatList
        data={quests || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <QuestCard
            quest={item}
            onPress={() => navigation.navigate(Routes.QUEST_DETAIL, { questId: item.id })}
            style={styles.card}
          />
        )}
        ListEmptyComponent={<EmptyState icon="search" title="No quests found" subtitle="Check back soon for new quests near you." />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  card: { marginBottom: Spacing.md },
});
