// src/screens/onboarding/PermissionsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { useAppStore } from '../../store/appStore';

const S = Strings.permissions;

const PERMISSION_ITEMS = [
  { key: 'location', icon: 'location-on', label: S.location, desc: S.locationDesc },
  { key: 'camera', icon: 'camera-alt', label: S.camera, desc: S.cameraDesc },
  { key: 'notifications', icon: 'notifications', label: S.notifications, desc: S.notificationsDesc },
  { key: 'tracking', icon: 'track-changes', label: S.activityTracking, desc: S.activityTrackingDesc },
];

function PermissionItem({ icon, label, desc, granted }) {
  return (
    <View style={styles.permItem}>
      <View style={styles.permIconWrap}>
        <MaterialIcons name={icon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.permContent}>
        <Text style={styles.permLabel}>{label}</Text>
        <Text style={styles.permDesc}>{desc}</Text>
      </View>
      {/* ✅ Show granted/pending state visually */}
      <MaterialIcons
        name={granted ? 'check-circle' : 'radio-button-unchecked'}
        size={22}
        color={granted ? Colors.accent : Colors.textMuted}
      />
    </View>
  );
}

export default function PermissionsScreen() {
  const navigation = useNavigation();
  const setPermissionsGranted = useAppStore((s) => s.setPermissionsGranted);
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState({
    location: false,
    camera: false,
    notifications: false,
    tracking: false,
  });

  // ✅ Actually request each permission from the OS one by one
  const requestAllPermissions = async () => {
    setLoading(true);

    try {
      // 1. Location
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      setGranted((prev) => ({ ...prev, location: locStatus === 'granted' }));

      // 2. Camera
      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      setGranted((prev) => ({ ...prev, camera: camStatus === 'granted' }));

      // 3. Notifications
      const { status: notifStatus } = await Notifications.requestPermissionsAsync();
      setGranted((prev) => ({ ...prev, notifications: notifStatus === 'granted' }));

      // 4. Tracking (iOS only — on Android this resolves 'granted' automatically)
      const { status: trackStatus } = await requestTrackingPermissionsAsync();
      setGranted((prev) => ({ ...prev, tracking: trackStatus === 'granted' }));

    } catch (e) {
      console.warn('Permission request error:', e);
    }

    setLoading(false);
    // ✅ Mark granted regardless of individual results (user can deny some)
    setPermissionsGranted(true);
    navigation.reset({ index: 0, routes: [{ name: Routes.AUTH_STACK }] });
  };

  return (
    <ScreenContainer scrollable backgroundColor={Colors.white}>
      <View style={styles.header}>
        <Text style={styles.title}>{S.title}</Text>
        <Text style={styles.subtitle}>{S.subtitle}</Text>
      </View>

      <View style={styles.list}>
        {PERMISSION_ITEMS.map((item) => (
          <PermissionItem key={item.key} {...item} granted={granted[item.key]} />
        ))}
      </View>

      <AppButton
        title={S.continueBtn}
        onPress={requestAllPermissions}
        loading={loading}
        style={styles.btn}
      />
      <Text style={styles.note}>{S.changeLater}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  list: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  permItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  permIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permContent: { flex: 1 },
  permLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  permDesc: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  btn: { marginBottom: Spacing.base },
  note: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
});