// src/screens/main/HelpSupportScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';

const S = Strings.helpSupport;

const QUICK_SUPPORT = [
  { key: 'help', icon: 'help-outline', label: S.helpCenter, desc: S.helpCenterDesc, route: Routes.FAQ },
  { key: 'contact', icon: 'chat-bubble-outline', label: S.contactUs, desc: S.contactUsDesc, route: Routes.CONTACT_US },
  { key: 'report', icon: 'report-problem', label: S.reportIssue, desc: S.reportIssueDesc, route: null },
  { key: 'feedback', icon: 'thumb-up-off-alt', label: S.shareFeedback, desc: S.shareFeedbackDesc, route: null },
];

export default function HelpSupportScreen() {
  const navigation = useNavigation();
  const { user } = useAppStore();
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Greeting */}
        <View style={styles.greetingCard}>
          <Text style={styles.greeting}>{S.hiMessage} {firstName},</Text>
          <Text style={styles.greetingQuestion}>{S.howCanWeHelp}</Text>
          <AppInput
            placeholder={S.searchPlaceholder}
            leftIcon={<MaterialIcons name="search" size={20} color={Colors.textMuted} />}
            style={styles.searchInput}
          />
        </View>

        {/* Quick Support */}
        <Text style={styles.sectionLabel}>{S.quickSupport}</Text>
        <View style={styles.supportGrid}>
          {QUICK_SUPPORT.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.supportCard}
              onPress={() => item.route ? navigation.navigate(item.route) : null}
              activeOpacity={0.78}
              accessibilityRole="button"
            >
              <MaterialIcons name={item.icon} size={28} color={Colors.primary} style={styles.supportIcon} />
              <Text style={styles.supportLabel}>{item.label}</Text>
              <Text style={styles.supportDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Agent CTA */}
        <View style={styles.agentCard}>
          <View style={styles.agentAvatar}>
            <MaterialIcons name="support-agent" size={32} color={Colors.white} />
          </View>
          <View style={styles.agentContent}>
            <Text style={styles.agentTitle}>{S.weAreHere}</Text>
            <Text style={styles.agentDesc}>{S.usuallyReplies}</Text>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  greetingCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  greeting: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  greetingQuestion: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.base },
  searchInput: { marginBottom: 0 },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.md,
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  supportCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  supportIcon: { marginBottom: Spacing.sm },
  supportLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 4 },
  supportDesc: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16 },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.backgroundTag,
    borderRadius: Radius.lg,
    padding: Spacing.base,
  },
  agentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentContent: { flex: 1 },
  agentTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.primary },
  agentDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
});
