// src/components/common/BalanceCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing, Shadow } from '../../constants/layout';
import { formatBalance, formatNumber } from '../../utils/helpers';
import Strings from '../../constants/strings';

export default function BalanceCard({ balance, greenCredits, onRedeem, style }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.left}>
        <Text style={styles.label}>{Strings.home.yourBalance}</Text>
        <Text style={styles.amount}>{formatBalance(balance)}</Text>
        <View style={styles.creditsRow}>
          <MaterialIcons name="eco" size={14} color={Colors.accent} />
          <Text style={styles.credits}>
            {formatNumber(greenCredits)} {Strings.home.greenCredits}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.redeemBtn}
        onPress={onRedeem}
        accessibilityLabel={Strings.home.redeem}
        accessibilityRole="button"
      >
        <MaterialIcons name="card-giftcard" size={18} color={Colors.primary} />
        <Text style={styles.redeemText}>{Strings.home.redeem}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.sm,
  },
  left: {},
  label: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  amount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  credits: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    fontWeight: FontWeight.medium,
  },
  redeemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  redeemText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
