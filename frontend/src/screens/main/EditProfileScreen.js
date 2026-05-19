// src/screens/main/EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import { userService } from '../../services/api';
import { useAppStore } from '../../store/appStore';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useAppStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await userService.updateProfile({ fullName, email });
    setLoading(false);
    if (res.ok) {
      setUser({ ...user, ...res.data });
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer backgroundColor={Colors.white} padded={false} keyboardAvoiding scrollable>
      <AppHeader
        title={Strings.settings.editProfile}
        onBack={() => navigation.goBack()}
        rightIcon="check"
        onRightPress={handleSave}
      />

      <View style={styles.body}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={48} color={Colors.white} />
          </View>
          <TouchableOpacity style={styles.changePhotoBtn} accessibilityRole="button">
            <MaterialIcons name="camera-alt" size={16} color={Colors.primary} />
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        <AppInput
          label={Strings.auth.fullName}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          placeholder="Your full name"
        />
        <AppInput
          label={Strings.auth.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="your@email.com"
        />

        <AppButton
          title={Strings.general.save}
          onPress={handleSave}
          loading={loading}
          style={styles.saveBtn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.base },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.base,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  changePhotoText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  saveBtn: { marginTop: Spacing.base },
});
