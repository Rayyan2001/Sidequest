// src/screens/main/MapScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import Colors from '../../constants/colors';
import { FontSize, FontWeight, Radius, Spacing } from '../../constants/layout';
import Strings from '../../constants/strings';
import Routes from '../../constants/routes';
import { placesService } from '../../services/api';
import useAsync from '../../hooks/useAsync';
import { LoadingState, ErrorState } from '../../components/common/EmptyState';

const S = Strings.map;

function PlacePin({ place, onPress }) {
  return (
    <TouchableOpacity style={styles.pin} onPress={onPress} accessibilityRole="button">
      <View style={styles.pinDot}>
        <MaterialIcons name="location-on" size={16} color={Colors.white} />
      </View>
      <Text style={styles.pinLabel} numberOfLines={1}>{place.name}</Text>
    </TouchableOpacity>
  );
}

function PlaceRow({ place, onPress }) {
  return (
    <TouchableOpacity style={styles.placeRow} onPress={onPress} activeOpacity={0.78} accessibilityRole="button">
      <View style={styles.placeIconWrap}>
        <MaterialIcons name="place" size={22} color={Colors.primary} />
      </View>
      <View style={styles.placeContent}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeCategory}>{place.category} · {place.distance}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const navigation = useNavigation();
  const { data: places, loading, error, refetch } = useAsync(placesService.getNearbyPlaces);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ScreenContainer backgroundColor={Colors.backgroundAlt} padded={false} statusBarStyle="dark">
      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={64} color={Colors.textMuted} />
        <Text style={styles.mapText}>Interactive Map</Text>
        <Text style={styles.mapSub}>Map integration placeholder</Text>

        {/* Fake pins */}
        <View style={styles.pinsOverlay}>
          {(places || []).slice(0, 3).map((place, i) => (
            <PlacePin
              key={place.id}
              place={place}
              onPress={() => navigation.navigate(Routes.SAVED_PLACE_DETAIL_MAP, { placeId: place.id })}
            />
          ))}
        </View>
      </View>

      {/* Nearby list */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>{S.nearYou}</Text>
      </View>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {(places || []).map((place) => (
          <PlaceRow
            key={place.id}
            place={place}
            onPress={() => navigation.navigate(Routes.SAVED_PLACE_DETAIL_MAP, { placeId: place.id })}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    height: '45%',
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  mapText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  mapSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  pinsOverlay: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.base,
  },
  pin: {
    alignItems: 'center',
  },
  pinDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pinLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    maxWidth: 80,
    textAlign: 'center',
  },
  listHeader: {
    padding: Spacing.base,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  listTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  list: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  placeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundTag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeContent: { flex: 1 },
  placeName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  placeCategory: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
