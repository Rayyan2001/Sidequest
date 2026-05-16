import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { questService } from '../../services/api';

const S = Strings.submitProof;

export default function SubmitProofScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params || {};
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Request permission on mount if not granted
  if (!permission) return null; // still loading

  if (!permission.granted) {
    return (
      <ScreenContainer backgroundColor={Colors.black} padded statusBarStyle="light">
        <View style={styles.body}>
          <Text style={styles.title}>Camera Access Needed</Text>
          <Text style={styles.subtitle}>
            Allow camera access to scan QR codes.
          </Text>
          <AppButton title="Grant Permission" onPress={requestPermission} />
        </View>
      </ScreenContainer>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || scanning) return;
    setScanned(true);
    setScanning(true);
    const res = await questService.submitQRCode({ questId, code: data });
    setScanning(false);
    if (res.ok) {
      navigation.replace(Routes.VERIFYING, { questId });
    } else {
      Alert.alert('Invalid QR', 'This code could not be verified. Try again.');
      setScanned(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.black} padded={false} statusBarStyle="light">
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.title}>{S.title}</Text>
        <Text style={styles.subtitle}>{S.subtitle}</Text>

        {/* Live camera viewfinder */}
        <View style={styles.viewfinder}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          {/* Corner brackets overlaid on top of the camera */}
          <View style={styles.corner} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {scanned && (
          <AppButton
            title="Scan Again"
            onPress={() => setScanned(false)}
            style={[styles.btn, { marginBottom: Spacing.base }]}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.base,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  viewfinder: {
    width: 240,
    height: 240,
    borderRadius: Radius.xl,
    overflow: 'hidden',        // clips the camera to the rounded box
    marginBottom: Spacing.xxl,
    position: 'relative',
    backgroundColor: '#000',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.white,
    borderTopLeftRadius: 8,
    zIndex: 2,
  },
  cornerTR: {
    top: 0,
    left: undefined,
    right: 0,
    borderTopWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    top: undefined,
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    top: undefined,
    bottom: 0,
    left: undefined,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 8,
  },
  btn: { width: '100%' },
  manualLink: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'underline',
  },
});