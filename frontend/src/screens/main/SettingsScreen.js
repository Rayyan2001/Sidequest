// src/screens/main/SettingsScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import ToggleRow from '../../components/common/ToggleRow';
import { Divider } from '../../components/common/Divider';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';

const S = Strings.settings;

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { settings, updateSetting } = useAppStore();

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Account */}
        <Section title={S.account}>
          <ToggleRow
            label={S.editProfile}
            type="link"
            icon="person-outline"
            onPress={() => navigation.navigate(Routes.EDIT_PROFILE)}
          />
          <Divider />
          <ToggleRow
            label={S.preferences}
            type="link"
            icon="tune"
            onPress={() => {}}
          />
        </Section>

        {/* App */}
        <Section title={S.app}>
          <ToggleRow
            label={S.notifications}
            type="link"
            icon="notifications-none"
            onPress={() => navigation.navigate(Routes.NOTIFICATIONS_SETTINGS)}
          />
          <Divider />
          <ToggleRow
            label={S.privacyAndSecurity}
            type="link"
            icon="lock-outline"
            onPress={() => navigation.navigate(Routes.PRIVACY_SECURITY)}
          />
          <Divider />
          <ToggleRow
            label={S.language}
            type="link"
            icon="language"
            rightLabel={settings.language}
            onPress={() => {}}
          />
          <Divider />
          <ToggleRow
            label={S.darkMode}
            type="switch"
            icon="dark-mode"
            value={settings.darkMode}
            onValueChange={(v) => updateSetting('darkMode', v)}
          />
          <Divider />
          <ToggleRow
            label={S.location}
            type="switch"
            icon="location-on"
            value={settings.locationEnabled}
            onValueChange={(v) => updateSetting('locationEnabled', v)}
            rightLabel={settings.locationEnabled ? S.on : Strings.general.off}
          />
        </Section>

        {/* More */}
        <Section title={S.more}>
          <ToggleRow
            label={S.aboutSideQuest}
            type="link"
            icon="info-outline"
            onPress={() => {}}
          />
          <Divider />
          <ToggleRow
            label={S.termsAndConditions}
            type="link"
            icon="description"
            onPress={() => {}}
          />
        </Section>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
  },
});
