// src/screens/main/AddPaymentMethodScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import { paymentService } from '../../services/api';

const S = Strings.paymentMethods;
const TABS = [S.card, S.paypal, S.other];

export default function AddPaymentMethodScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(S.card);
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number.';
    if (!name.trim()) e.name = 'Name on card is required.';
    if (!expiry || expiry.length < 5) e.expiry = 'Enter a valid expiry date (MM/YY).';
    if (!cvv || cvv.length < 3) e.cvv = 'Enter a valid CVV.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatCardNumber = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await paymentService.addCard({ cardNumber, name, expiry, isDefault });
    setLoading(false);
    if (res.ok) navigation.goBack();
  };

  return (
    <ScreenContainer backgroundColor={Colors.white} padded={false} keyboardAvoiding scrollable>
      <AppHeader title={S.addPaymentMethod} onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        {/* Type tabs */}
        <View style={styles.tabs}>
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

        {activeTab === S.card && (
          <>
            <AppInput
              label={S.cardNumber}
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChangeText={(v) => { setCardNumber(formatCardNumber(v)); setErrors({}); }}
              keyboardType="numeric"
              error={errors.cardNumber}
            />
            <AppInput
              label={S.nameOnCard}
              placeholder="Sarah Johnson"
              value={name}
              onChangeText={(v) => { setName(v); setErrors({}); }}
              autoCapitalize="words"
              error={errors.name}
            />
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <AppInput
                  label={S.expiryDate}
                  placeholder="12/26"
                  value={expiry}
                  onChangeText={(v) => { setExpiry(formatExpiry(v)); setErrors({}); }}
                  keyboardType="numeric"
                  error={errors.expiry}
                />
              </View>
              <View style={styles.halfInput}>
                <AppInput
                  label={S.cvv}
                  placeholder="123"
                  value={cvv}
                  onChangeText={(v) => { setCvv(v.replace(/\D/g, '').slice(0, 4)); setErrors({}); }}
                  keyboardType="numeric"
                  secureTextEntry
                  error={errors.cvv}
                />
              </View>
            </View>

            <View style={styles.defaultRow}>
              <Text style={styles.defaultLabel}>{S.setDefault}</Text>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{ false: Colors.border, true: Colors.accentLight }}
                thumbColor={isDefault ? Colors.primary : Colors.white}
              />
            </View>
          </>
        )}

        {activeTab !== S.card && (
          <View style={styles.placeholder}>
            <MaterialIcons name="payment" size={48} color={Colors.textMuted} />
            <Text style={styles.placeholderText}>{activeTab} integration coming soon</Text>
          </View>
        )}

        <View style={styles.secureRow}>
          <MaterialIcons name="lock" size={16} color={Colors.textMuted} />
          <Text style={styles.secureText}>{S.secureInfo}</Text>
        </View>

        <AppButton
          title={S.saveCard}
          onPress={handleSave}
          loading={loading}
          style={styles.saveBtn}
          disabled={activeTab !== S.card}
        />
        <AppButton
          title={S.cancel}
          onPress={() => navigation.goBack()}
          variant="ghost"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.base },
  tabs: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.white },
  rowInputs: { flexDirection: 'row', gap: Spacing.md },
  halfInput: { flex: 1 },
  defaultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  defaultLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  secureText: { fontSize: FontSize.xs, color: Colors.textMuted },
  saveBtn: { marginBottom: Spacing.sm },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    gap: Spacing.base,
  },
  placeholderText: { fontSize: FontSize.base, color: Colors.textMuted },
});
