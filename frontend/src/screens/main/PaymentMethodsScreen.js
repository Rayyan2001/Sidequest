// src/screens/main/PaymentMethodsScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import Badge from '../../components/common/Badge';
import { LoadingState, ErrorState } from '../../components/common/EmptyState';
import BalanceCard from '../../components/common/BalanceCard';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { paymentService } from '../../services/api';
import { useAppStore } from '../../store/appStore';
import { formatBalance } from '../../utils/helpers';
import useAsync from '../../hooks/useAsync';

const S = Strings.paymentMethods;

const BRAND_ICONS = {
  visa: { icon: 'cc-visa', color: '#1A1F71' },
  mastercard: { icon: 'cc-mastercard', color: '#EB001B' },
  paypal: { icon: 'cc-paypal', color: '#003087' },
  apple_pay: { icon: 'apple-pay', color: Colors.black },
};

function PaymentMethodCard({ method }) {
  const brand = BRAND_ICONS[method.type === 'paypal' ? 'paypal' : method.type === 'apple_pay' ? 'apple_pay' : method.brand] || {};

  return (
    <View style={styles.pmCard}>
      <FontAwesome5 name={brand.icon || 'credit-card'} size={28} color={brand.color || Colors.textMuted} solid />
      <View style={styles.pmContent}>
        {method.type === 'paypal' ? (
          <Text style={styles.pmLabel}>PayPal · {method.email}</Text>
        ) : method.type === 'apple_pay' ? (
          <Text style={styles.pmLabel}>Apple Pay</Text>
        ) : (
          <>
            <Text style={styles.pmLabel}>{method.brand?.toUpperCase()} ···· {method.last4}</Text>
            <Text style={styles.pmExpiry}>Expires {method.expiry}</Text>
          </>
        )}
      </View>
      {method.isDefault && (
        <Badge label={S.default} color={Colors.backgroundTag} textColor={Colors.primary} />
      )}
    </View>
  );
}

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();
  const { balance, greenCredits } = useAppStore();
  const { data: methods, loading, error, refetch } = useAsync(paymentService.getPaymentMethods);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />
      <FlatList
        data={methods || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Wallet balance */}
            <View style={styles.walletCard}>
              <View style={styles.walletIcon}>
                <MaterialIcons name="account-balance-wallet" size={24} color={Colors.primary} />
              </View>
              <View style={styles.walletContent}>
                <Text style={styles.walletLabel}>{S.walletBalance}</Text>
                <Text style={styles.walletAmount}>{formatBalance(balance)}</Text>
                <Text style={styles.walletCredits}>{greenCredits} Green Credits</Text>
              </View>
            </View>
            <Text style={styles.sectionLabel}>Saved Methods</Text>
          </>
        }
        renderItem={({ item }) => <PaymentMethodCard method={item} />}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate(Routes.ADD_PAYMENT_METHOD)}
            accessibilityRole="button"
          >
            <MaterialIcons name="add-circle-outline" size={22} color={Colors.primary} />
            <Text style={styles.addBtnText}>{S.addPaymentMethod}</Text>
          </TouchableOpacity>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  walletIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundTag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletContent: { flex: 1 },
  walletLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  walletAmount: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  walletCredits: { fontSize: FontSize.xs, color: Colors.accent, marginTop: 2 },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  pmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  pmContent: { flex: 1 },
  pmLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  pmExpiry: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  addBtnText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.semibold },
});
