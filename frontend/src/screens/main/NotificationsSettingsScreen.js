// src/screens/main/NotificationsSettingsScreen.js
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
import { useAppStore } from '../../store/appStore';

const S = Strings.notificationsSettings;

export default function NotificationsSettingsScreen() {
  const navigation = useNavigation();
  const { notificationPrefs, updateNotificationPref } = useAppStore();

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Main push toggle */}
        <View style={styles.card}>
          <ToggleRow
            label={S.pushNotifications}
            description={S.pushNotificationsDesc}
            type="switch"
            value={notificationPrefs.pushEnabled}
            onValueChange={(v) => updateNotificationPref('pushEnabled', v)}
          />
        </View>

        <Text style={styles.sectionTitle}>{S.whatToReceive}</Text>
        <View style={styles.card}>
          <ToggleRow
            label={S.questReminders}
            description={S.questRemindersDesc}
            type="switch"
            value={notificationPrefs.questReminders}
            onValueChange={(v) => updateNotificationPref('questReminders', v)}
          />
          <Divider />
          <ToggleRow
            label={S.newQuests}
            description={S.newQuestsDesc}
            type="switch"
            value={notificationPrefs.newQuests}
            onValueChange={(v) => updateNotificationPref('newQuests', v)}
          />
          <Divider />
          <ToggleRow
            label={S.rewardsOffers}
            description={S.rewardsOffersDesc}
            type="switch"
            value={notificationPrefs.rewardsOffers}
            onValueChange={(v) => updateNotificationPref('rewardsOffers', v)}
          />
          <Divider />
          <ToggleRow
            label={S.messages}
            description={S.messagesDesc}
            type="switch"
            value={notificationPrefs.messages}
            onValueChange={(v) => updateNotificationPref('messages', v)}
          />
          <Divider />
          <ToggleRow
            label={S.marketing}
            description={S.marketingDesc}
            type="switch"
            value={notificationPrefs.marketing}
            onValueChange={(v) => updateNotificationPref('marketing', v)}
          />
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
});
