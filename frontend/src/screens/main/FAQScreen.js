// src/screens/main/FAQScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { MOCK_FAQ } from '../../services/mockData';

const S = Strings.helpSupport;
const TABS = [S.popular, S.quests, S.rewardsTab, S.account];

function FAQItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.78}
      accessibilityRole="button"
    >
      <View style={styles.faqRow}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <MaterialIcons name={expanded ? 'expand-less' : 'expand-more'} size={22} color={Colors.textMuted} />
      </View>
      {expanded && (
        <Text style={styles.faqAnswer}>
          For detailed information about this topic, please contact our support team or visit our Help Center.
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function FAQScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(S.popular);
  const [search, setSearch] = useState('');

  const filtered = MOCK_FAQ.filter(
    (f) => f.category.includes(activeTab) &&
    (search === '' || f.question.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.faqTitle} onBack={() => navigation.goBack()} />

      <AppInput
        placeholder={S.searchFAQs}
        value={search}
        onChangeText={setSearch}
        leftIcon={<MaterialIcons name="search" size={20} color={Colors.textMuted} />}
        style={styles.searchInput}
      />

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
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
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.faqList}>
          {filtered.map((item) => (
            <FAQItem key={item.id} item={item} />
          ))}
        </View>

        {/* Still need help */}
        <View style={styles.stillNeedHelp}>
          <View style={styles.agentIcon}>
            <MaterialIcons name="support-agent" size={24} color={Colors.white} />
          </View>
          <Text style={styles.stillTitle}>{S.stillNeedHelp}</Text>
          <Text style={styles.stillDesc}>{S.contactSupportTeam}</Text>
          <AppButton
            title={S.contactUs}
            onPress={() => navigation.navigate(Routes.CONTACT_US)}
            variant="outline"
            size="sm"
            style={styles.contactBtn}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  tabScroll: { flexGrow: 0, marginTop: Spacing.sm },
  tabContent: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.white, fontWeight: FontWeight.semibold },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  faqList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  faqItem: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  faqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: FontWeight.medium, flex: 1, paddingRight: Spacing.sm },
  faqAnswer: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 20 },
  stillNeedHelp: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  agentIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  stillTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  stillDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.md },
  contactBtn: { paddingHorizontal: Spacing.xl },
});
