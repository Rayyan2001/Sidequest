// src/screens/main/ActivityDetailScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import { Divider } from '../../components/common/Divider';
import { LoadingState, ErrorState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import { activityService } from '../../services/api';
import useAsync from '../../hooks/useAsync';

const S = Strings.activityDetails;

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ActivityDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { activityId } = route.params || {};

  const { data: activity, loading, error, refetch } = useAsync(
    () => activityService.getActivityById(activityId),
    [activityId]
  );

  if (loading) return <LoadingState />;
  if (error || !activity) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ScreenContainer backgroundColor={Colors.white} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Image placeholder */}
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="local-cafe" size={52} color={Colors.white} />
        </View>

        <View style={styles.body}>
          {/* Status badge */}
          <View style={styles.statusBadge}>
            <MaterialIcons name="check-circle" size={16} color={Colors.accent} />
            <Text style={styles.statusText}>{activity.status}</Text>
            <Text style={styles.statusDate}>{activity.date}</Text>
          </View>

          <Text style={styles.questTitle}>{activity.questTitle}</Text>

          {/* Business */}
          <View style={styles.businessRow}>
            <MaterialIcons name="eco" size={16} color={Colors.accent} />
            <Text style={styles.businessName}>{activity.businessName}</Text>
          </View>

          {/* Reward earned */}
          <View style={styles.rewardCard}>
            <Text style={styles.youEarned}>You earned</Text>
            <Text style={styles.rewardAmount}>{activity.reward.label}</Text>
            <View style={styles.creditsRow}>
              <MaterialIcons name="eco" size={12} color={Colors.accent} />
              <Text style={styles.creditsText}>{activity.reward.credits} Green Credits</Text>
            </View>
          </View>

          <Divider />

          {/* Details */}
          <Text style={styles.sectionTitle}>Details</Text>
          <DetailRow label={S.status} value={activity.status} />
          <Divider />
          <DetailRow label={S.type} value={activity.type} />
          <Divider />
          <DetailRow label={S.date} value={activity.date} />
          <Divider />
          <DetailRow label={S.reward} value={`${activity.reward.label} (${activity.reward.credits} Credits)`} />
          <Divider />
          <DetailRow label={S.paymentMethod} value={activity.paymentMethod} />
          <Divider />

          <View style={styles.receiptRow}>
            <Text style={styles.detailLabel}>{S.receiptProof}</Text>
            <Text style={styles.viewLink}>{S.view}</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxl },
  imagePlaceholder: {
    height: 180,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: Spacing.base },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  statusText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
  },
  statusDate: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  questTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  businessName: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
  },
  rewardCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  youEarned: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 4 },
  rewardAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
  },
  creditsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  creditsText: { fontSize: FontSize.xs, color: Colors.accent },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  detailValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  viewLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});
