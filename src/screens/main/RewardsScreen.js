// src/screens/main/RewardsScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import { SectionHeader } from '../../components/common/Divider';
import { LoadingState, ErrorState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import { useAppStore } from '../../store/appStore';
import { rewardsService } from '../../services/api';
import { formatBalance, formatNumber } from '../../utils/helpers';
import useAsync from '../../hooks/useAsync';

const S = Strings.rewards;

function OfferCard({ offer }) {
  const badgeColors = {
    '#1A4731': Colors.primary,
    '#0D9488': '#0D9488',
    '#2563EB': '#2563EB',
  };
  const badgeColor = badgeColors[offer.color] || Colors.primary;

  return (
    <TouchableOpacity style={styles.offerCard} accessibilityRole="button" activeOpacity={0.78}>
      <View style={styles.offerIcon}>
        <MaterialIcons name="local-offer" size={28} color={Colors.primary} />
      </View>
      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        {offer.minSpend > 0 ? (
          <Text style={styles.offerSub}>{S.minSpend} £{offer.minSpend}</Text>
        ) : (
          <Text style={styles.offerSub}>1 {S.perDay}</Text>
        )}
      </View>
      <View style={[styles.offerBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.offerBadgeText}>{offer.badgeLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RewardsScreen() {
  const { balance, greenCredits } = useAppStore();
  const { data: offers, loading, error, refetch } = useAsync(rewardsService.getRedeemOffers);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false} statusBarStyle="dark">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{S.title}</Text>
        </View>

        <View style={styles.content}>
          {/* Balance card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{S.yourBalance}</Text>
            <Text style={styles.balanceAmount}>{formatBalance(balance)}</Text>
            <View style={styles.creditsRow}>
              <MaterialIcons name="eco" size={14} color={Colors.accent} />
              <Text style={styles.creditsText}>{formatNumber(greenCredits)} {S.greenCredits}</Text>
            </View>
          </View>

          {/* Redeem offers */}
          <SectionHeader
            title={S.redeemOffers}
            action={S.seeAll}
            onActionPress={() => {}}
          />
          {(offers || []).map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    paddingTop: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  pageTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  content: { padding: Spacing.base },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'flex-start',
  },
  balanceLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  balanceAmount: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.white },
  creditsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.xs },
  creditsText: { fontSize: FontSize.sm, color: Colors.accentLight },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  offerIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundTag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerContent: { flex: 1 },
  offerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  offerSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  offerBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    minWidth: 52,
    alignItems: 'center',
  },
  offerBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white },
});
