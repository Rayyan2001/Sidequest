// src/screens/main/ProfileScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import { Divider } from '../../components/common/Divider';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing, TOUCH_TARGET } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';
import { clearPersistedState } from '../../store/persist';

const S = Strings.profile;

function StatBox({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuRow({ icon, label, onPress, danger = false, rightLabel }) {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <MaterialIcons name={icon} size={22} color={danger ? Colors.error : Colors.textSecondary} style={styles.menuIcon} />
      <Text style={[styles.menuLabel, danger && styles.menuDanger]}>{label}</Text>
      {rightLabel ? <Text style={styles.menuRight}>{rightLabel}</Text> : null}
      {!danger && <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearPersistedState();
          logout();
          navigation.reset({ index: 0, routes: [{ name: Routes.AUTH_STACK }] });
        },
      },
    ]);
  };

  const stats = user?.stats || { questsCompleted: 12, co2Saved: '24kg', badgesEarned: 8 };

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false} statusBarStyle="dark">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatarWrap}>
              <MaterialIcons name="person" size={40} color={Colors.white} />
            </View>
            <TouchableOpacity style={styles.shareBtn} accessibilityRole="button">
              <MaterialIcons name="ios-share" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.fullName || 'Sarah Johnson'}</Text>
          <Text style={styles.memberSince}>{S.memberSince} {user?.memberSince || 'May 2024'}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatBox value={stats.questsCompleted} label={S.questsCompleted} />
            <View style={styles.statDivider} />
            <StatBox value={stats.co2Saved} label={S.co2Saved} />
            <View style={styles.statDivider} />
            <StatBox value={stats.badgesEarned} label={S.badgesEarned} />
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <MenuRow icon="history" label={S.activityHistory} onPress={() => navigation.navigate(Routes.ACTIVITY_HISTORY)} />
          <Divider />
          <MenuRow icon="bookmark" label={S.savedPlaces} onPress={() => navigation.navigate(Routes.SAVED_PLACES)} />
          <Divider />
          <MenuRow icon="payment" label={S.paymentMethods} onPress={() => navigation.navigate(Routes.PAYMENT_METHODS)} />
          <Divider />
          <MenuRow icon="settings" label={S.settings} onPress={() => navigation.navigate(Routes.SETTINGS)} />
          <Divider />
          <MenuRow icon="help-outline" label={S.helpAndSupport} onPress={() => navigation.navigate(Routes.HELP_SUPPORT)} />
          <Divider />
          <MenuRow icon="logout" label={Strings.settings.logOut} onPress={handleLogout} danger />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxl },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    minHeight: TOUCH_TARGET,
  },
  menuIcon: { marginRight: Spacing.md },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  menuDanger: { color: Colors.error },
  menuRight: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
});
