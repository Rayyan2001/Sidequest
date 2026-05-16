// src/screens/main/ClaimRewardScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { questService } from '../../services/api';
import { useAppStore } from '../../store/appStore';

const S = Strings.claimReward;

const CLAIM_OPTIONS = [
  {
    key: 'balance',
    icon: 'account-balance-wallet',
    label: S.addToBalance,
    desc: S.addToBalanceDesc,
  },
  {
    key: 'discount',
    icon: 'local-offer',
    label: S.instantDiscount,
    desc: S.instantDiscountDesc,
  },
  {
    key: 'friend',
    icon: 'share',
    label: S.sendToFriend,
    desc: S.sendToFriendDesc,
  },
];

export default function ClaimRewardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params || {};
  const { activeQuest, addReward } = useAppStore();

  const [selected, setSelected] = useState('balance');
  const [loading, setLoading] = useState(false);

  const reward = activeQuest?.reward;

  const handleClaim = async () => {
    setLoading(true);
    const res = await questService.claimReward({ questId, method: selected });
    setLoading(false);
    if (res.ok) {
      if (selected === 'balance') {
        addReward({ amount: reward?.amount || 200, credits: reward?.credits || 50 });
      }
      navigation.navigate(Routes.HOME_TAB, { screen: Routes.HOME });
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Amount display */}
        <View style={styles.amountCard}>
          <Text style={styles.amount}>{reward?.label || '£2.00'}</Text>
          <View style={styles.creditsRow}>
            <MaterialIcons name="eco" size={14} color={Colors.accent} />
            <Text style={styles.credits}>{reward?.credits || 50} Green Credits</Text>
          </View>
        </View>

        <Text style={styles.chooseLabel}>{S.chooseHow}</Text>

        {/* Claim options */}
        {CLAIM_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.option, selected === opt.key && styles.optionSelected]}
            onPress={() => setSelected(opt.key)}
            accessibilityLabel={opt.label}
            accessibilityRole="radio"
          >
            <View style={styles.optionIcon}>
              <MaterialIcons
                name={opt.icon}
                size={24}
                color={selected === opt.key ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            <View style={[styles.radio, selected === opt.key && styles.radioSelected]}>
              {selected === opt.key && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <AppButton
          title={S.claimBtn}
          onPress={handleClaim}
          loading={loading}
          style={styles.claimBtn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: Spacing.base },
  amountCard: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
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
  credits: { fontSize: FontSize.sm, color: Colors.accent },
  chooseLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundTag,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: { flex: 1 },
  optionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  optionDesc: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  claimBtn: { marginTop: 'auto' },
});
