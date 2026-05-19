// src/screens/main/SavedPlacesScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/EmptyState';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { placesService } from '../../services/api';
import { useAppStore } from '../../store/appStore';
import useAsync from '../../hooks/useAsync';

const S = Strings.savedPlaces;

function PlaceCard({ place, isSaved, onPress, onToggleSave }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.78} accessibilityRole="button">
      <View style={styles.cardImage}>
        <MaterialIcons name="storefront" size={32} color={Colors.white} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardName}>{place.name}</Text>
            <Text style={styles.cardCategory}>{place.category}</Text>
            <Text style={styles.cardDistance}>{place.distance}</Text>
          </View>
          <TouchableOpacity onPress={onToggleSave} accessibilityRole="button" accessibilityLabel="Save place">
            <MaterialIcons name={isSaved ? 'star' : 'star-border'} size={24} color={isSaved ? '#F59E0B' : Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SavedPlacesScreen() {
  const navigation = useNavigation();
  const { savedPlaceIds, toggleSavedPlace } = useAppStore();
  const { data: places, loading, error, refetch } = useAsync(placesService.getSavedPlaces);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false}>
      <AppHeader title={S.title} onBack={() => navigation.goBack()} />
      <FlatList
        data={places || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            isSaved={savedPlaceIds.includes(item.id)}
            onPress={() => navigation.navigate(Routes.SAVED_PLACE_DETAIL, { placeId: item.id })}
            onToggleSave={() => toggleSavedPlace(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState icon="bookmark-border" title="No saved places" subtitle="Save your favourite quest locations here." />}
        ListFooterComponent={
          <AppButton
            title={S.discoverMore}
            onPress={() => navigation.navigate(Routes.MAP_TAB, { screen: Routes.MAP })}
            variant="outline"
            style={styles.discoverBtn}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  cardImage: {
    height: 100,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { padding: Spacing.base },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardCategory: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  cardDistance: { fontSize: FontSize.xs, color: Colors.accent, marginTop: 2 },
  discoverBtn: { marginTop: Spacing.sm },
});
