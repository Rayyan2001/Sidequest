// src/components/quest/QuestCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing, Shadow, TOUCH_TARGET } from '../../constants/layout';
import Badge from '../common/Badge';

export default function QuestCard({ quest, onPress, compact = false, style }) {
  if (!quest) return null;

  const { title, businessName, reward, distance, category } = quest;

  const categoryIconMap = {
    eco: 'eco',
    'zero-waste': 'delete-outline',
    refill: 'water-drop',
    food: 'restaurant',
    fitness: 'fitness-center',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityLabel={`Quest: ${title}`}
      accessibilityRole="button"
      style={[styles.card, compact && styles.cardCompact, style]}
    >
      {/* Quest icon placeholder */}
      <View style={[styles.iconWrap, compact && styles.iconCompact]}>
        <MaterialIcons
          name={categoryIconMap[category] || 'star'}
          size={compact ? 22 : 28}
          color={Colors.primary}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.business} numberOfLines={1}>
          {businessName}
        </Text>
        {!compact && distance ? (
          <Text style={styles.distance}>📍 {distance}</Text>
        ) : null}
      </View>

      {/* Reward */}
      <View style={styles.rewardWrap}>
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardText}>{reward?.label || ''}</Text>
          {reward?.credits ? (
            <Text style={styles.creditText}>{reward.credits} 🌿</Text>
          ) : null}
        </View>
        <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

export function TodaysQuestCard({ quest, onPress, style }) {
  if (!quest) return null;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      style={[styles.todayCard, style]}
      accessibilityLabel={`Today's quest: ${quest.title}`}
      accessibilityRole="button"
    >
      <View style={styles.todayImagePlaceholder}>
        <MaterialIcons name="local-cafe" size={40} color={Colors.white} />
      </View>
      <View style={styles.todayContent}>
        <Text style={styles.todayBusiness}>{quest.businessName}</Text>
        <Text style={styles.todayTitle} numberOfLines={2}>{quest.title}</Text>
        <View style={styles.todayReward}>
          <Text style={styles.todayRewardText}>Earn {quest.reward?.label}</Text>
          <Badge
            label={`${quest.reward?.credits} 🌿`}
            color={Colors.accentLight}
            textColor={Colors.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  cardCompact: {
    padding: Spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundTag,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconCompact: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  titleCompact: {
    fontSize: FontSize.sm,
  },
  business: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  distance: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  rewardWrap: {
    alignItems: 'flex-end',
  },
  rewardBadge: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  creditText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  // Today's card
  todayCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  todayImagePlaceholder: {
    width: 100,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayContent: {
    flex: 1,
    padding: Spacing.base,
  },
  todayBusiness: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  todayTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  todayReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  todayRewardText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
