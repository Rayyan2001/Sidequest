// src/screens/main/ActivityHistoryScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { activityService } from '../../services/api';
import { groupBy } from '../../utils/helpers';
import useAsync from '../../hooks/useAsync';

const S = Strings.activityHistory;
const TABS = [S.all, S.completed, S.rewardsTab];

function ActivityItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.78} accessibilityRole="button">
      <View style={styles.itemIcon}>
        <MaterialIcons name="eco" size={22} color={Colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.questTitle}</Text>
        <Text style={styles.itemBusiness}>{item.businessName}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemReward}>{item.reward.label}</Text>
        <Text style={styles.itemStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ActivityHistoryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(S.all);
  const { data: history, loading, error, refetch } = useAsync(activityService.getHistory);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const filtered = history || [];
  const grouped = groupBy(filtered, 'month');
  const sections = Object.entries(grouped).map(([month, items]) => ({ month, items }));

  const renderSection = ({ item: section }) => (
    <View key={section.month}>
      <Text style={styles.monthLabel}>{section.month}</Text>
      {section.items.map((activity) => (
        <ActivityItem
          key={activity.id}
          item={activity}
          onPress={() => navigation.navigate(Routes.ACTIVITY_DETAIL, { activityId: activity.id })}
        />
      ))}
    </View>
  );

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            accessibilityRole="tab"
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.month}
        renderItem={renderSection}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="history" title="No activity yet" subtitle="Complete quests to see your history here." />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.white },
  list: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  monthLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundTag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  itemBusiness: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  itemRight: { alignItems: 'flex-end' },
  itemReward: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.primary },
  itemStatus: { fontSize: FontSize.xs, color: Colors.accent, marginTop: 2 },
});
