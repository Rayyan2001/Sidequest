// src/screens/main/ContactUsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import { supportService } from '../../services/api';

const S = Strings.helpSupport;

export default function ContactUsScreen() {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!subject.trim()) e.subject = 'Subject is required.';
    if (!message.trim() || message.length < 10) e.message = 'Please write a detailed message.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await supportService.sendMessage({ subject, message });
    setLoading(false);
    if (res.ok) setSent(true);
  };

  if (sent) {
    return (
      <ScreenContainer backgroundColor={Colors.white}>
        <AppHeader title={S.contactUsTitle} onBack={() => navigation.goBack()} />
        <View style={styles.sentContainer}>
          <View style={styles.sentIcon}>
            <MaterialIcons name="check-circle" size={64} color={Colors.accent} />
          </View>
          <Text style={styles.sentTitle}>Message sent!</Text>
          <Text style={styles.sentDesc}>{S.usuallyReplies}</Text>
          <AppButton title="Go back" onPress={() => navigation.goBack()} style={styles.sentBtn} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={Colors.white} padded={false} keyboardAvoiding scrollable>
      <AppHeader title={S.contactUsTitle} onBack={() => navigation.goBack()} />
      <View style={styles.body}>

        {/* Agent header */}
        <View style={styles.agentRow}>
          <View style={styles.agentAvatar}>
            <MaterialIcons name="support-agent" size={28} color={Colors.white} />
          </View>
          <View style={styles.agentInfo}>
            <Text style={styles.agentTitle}>{S.weAreHereFor}</Text>
            <Text style={styles.agentDesc}>{S.contactDesc}</Text>
          </View>
        </View>

        <AppInput
          label={S.subject}
          placeholder={S.subjectPlaceholder}
          value={subject}
          onChangeText={(v) => { setSubject(v); setErrors({}); }}
          autoCapitalize="sentences"
          error={errors.subject}
        />
        <AppInput
          label={S.message}
          placeholder={S.messagePlaceholder}
          value={message}
          onChangeText={(v) => { setMessage(v); setErrors({}); }}
          multiline
          numberOfLines={5}
          autoCapitalize="sentences"
          error={errors.message}
        />

        <AppButton
          title={S.sendMessage}
          onPress={handleSend}
          loading={loading}
          style={styles.sendBtn}
        />

        <View style={styles.agentFooter}>
          <View style={styles.agentAvatarSm}>
            <MaterialIcons name="support-agent" size={20} color={Colors.white} />
          </View>
          <Text style={styles.replyNote}>{S.usuallyReplies}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.base },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.backgroundTag,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentAvatarSm: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInfo: { flex: 1 },
  agentTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  agentDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
  sendBtn: { marginBottom: Spacing.base },
  agentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  replyNote: { fontSize: FontSize.xs, color: Colors.textMuted },
  sentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  sentIcon: {},
  sentTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sentDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  sentBtn: { marginTop: Spacing.base, paddingHorizontal: Spacing.xxl },
});
