// src/screens/main/PrivacySecurityScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import ToggleRow from '../../components/common/ToggleRow';
import { Divider } from '../../components/common/Divider';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import { useAppStore } from '../../store/appStore';

const S = Strings.privacySecurity;

export default function PrivacySecurityScreen() {
  const navigation = useNavigation();
  const { privacyPrefs, updatePrivacyPref } = useAppStore();

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Privacy section */}
        <Text style={styles.sectionLabel}>{S.privacy}</Text>
        <View style={styles.card}>
          <ToggleRow
            label={S.dataPrivacy}
            description={S.dataPrivacyDesc}
            type="link"
            onPress={() => {}}
          />
          <Divider />
          <ToggleRow
            label={S.locationAccess}
            description={`${S.locationAccessDesc} · ${Strings.general.while}`}
            type="link"
            onPress={() => {}}
          />
          <Divider />
          <ToggleRow
            label={S.activityTracking}
            description={S.activityTrackingDesc}
            type="switch"
            value={privacyPrefs.activityTracking}
            onValueChange={(v) => updatePrivacyPref('activityTracking', v)}
          />
        </View>

        {/* Security section */}
        <Text style={styles.sectionLabel}>{S.security}</Text>
        <View style={styles.card}>
          <ToggleRow
            label={S.changePassword}
            type="link"
            onPress={() => {}}
          />
          <Divider />
          <ToggleRow
            label={S.biometricLogin}
            description={S.biometricLoginDesc}
            type="switch"
            value={privacyPrefs.biometricLogin}
            onValueChange={(v) => updatePrivacyPref('biometricLogin', v)}
          />
          <Divider />
          <ToggleRow
            label={S.twoFactorAuth}
            description={S.twoFactorAuthDesc}
            type="switch"
            value={privacyPrefs.twoFactorAuth}
            onValueChange={(v) => updatePrivacyPref('twoFactorAuth', v)}
          />
        </View>

        {/* Footer note */}
        <View style={styles.secureNote}>
          <MaterialIcons name="lock" size={18} color={Colors.primary} />
          <View style={styles.secureContent}>
            <Text style={styles.secureTitle}>{S.dataEncrypted}</Text>
            <Text style={styles.secureDesc}>{S.noShareData}</Text>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.backgroundTag,
    borderRadius: Radius.lg,
    padding: Spacing.base,
  },
  secureContent: { flex: 1 },
  secureTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginBottom: 4,
  },
  secureDesc: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
