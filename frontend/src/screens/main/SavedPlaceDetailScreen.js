// src/screens/main/SavedPlaceDetailScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import Badge from '../../components/common/Badge';
import QuestCard from '../../components/quest/QuestCard';
import { LoadingState, ErrorState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { placesService, questService } from '../../services/api';
import { useAppStore } from '../../store/appStore';
import useAsync from '../../hooks/useAsync';

const S = Strings.savedPlaces;

export default function SavedPlaceDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { placeId } = route.params || {};
  const { savedPlaceIds, toggleSavedPlace } = useAppStore();
  const isSaved = savedPlaceIds.includes(placeId);

  const { data: place, loading, error, refetch } = useAsync(
    () => placesService.getPlaceById(placeId),
    [placeId]
  );
  const { data: allQuests } = useAsync(questService.getNearbyQuests);

  if (loading) return <LoadingState />;
  if (error || !place) return <ErrorState message={error} onRetry={refetch} />;

  const activeQuests = allQuests?.filter((q) => place.activeQuests?.includes(q.id)) || [];

  return (
    <ScreenContainer backgroundColor={Colors.white} padded={false}>
      <AppHeader
        title=""
        onBack={() => navigation.goBack()}
        rightIcon={isSaved ? 'star' : 'star-border'}
        onRightPress={() => toggleSavedPlace(placeId)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero image */}
        <View style={styles.hero}>
          <MaterialIcons name="storefront" size={64} color={Colors.white} />
        </View>

        <View style={styles.body}>
          {/* Header info */}
          <View style={styles.placeHeader}>
            <View style={styles.logoPlaceholder}>
              <MaterialIcons name="eco" size={20} color={Colors.white} />
            </View>
            <View style={styles.placeInfo}>
              <Text style={styles.placeName}>{place.name}</Text>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={14} color="#F59E0B" />
                <Text style={styles.rating}>{place.rating} ({place.reviewCount})</Text>
                <Text style={styles.distance}>· {place.distance}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{place.description}</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={16} color={Colors.textMuted} />
            <Text style={styles.infoText}>{place.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={16} color={Colors.accent} />
            <Text style={[styles.infoText, { color: Colors.accent }]}>{place.hours}</Text>
          </View>

          {/* Tags */}
          {place.tags?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{S.whyYoullLoveIt}</Text>
              <View style={styles.tagsRow}>
                {place.tags.map((tag) => (
                  <Badge key={tag} label={tag} color={Colors.backgroundTag} textColor={Colors.primary} />
                ))}
              </View>
            </>
          )}

          {/* Active quests */}
          {activeQuests.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{S.activeQuests}</Text>
              {activeQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onPress={() => navigation.navigate(Routes.QUEST_DETAIL, { questId: quest.id })}
                  compact
                  style={styles.questCard}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton title={S.viewOnMap} onPress={() => navigation.navigate(Routes.MAP_TAB, { screen: Routes.MAP })} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxl },
  hero: {
    height: 200,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: Spacing.base },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInfo: { flex: 1 },
  placeName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { fontSize: FontSize.sm, color: Colors.textSecondary },
  distance: { fontSize: FontSize.sm, color: Colors.textMuted },
  description: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.base,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoText: { fontSize: FontSize.sm, color: Colors.textMuted, flex: 1 },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  questCard: { marginTop: Spacing.sm },
  footer: {
    padding: Spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});
