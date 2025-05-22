import React, { useCallback, useMemo, useRef } from 'react';
import { Image, StyleSheet, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Scooter } from '@/types/scooter';
import { ChevronLeft, ChevronRight, Navigation2 } from 'lucide-react-native';
import { getBatteryColor } from '@/utils/scooter.util';
import { StatusDot } from '../StatusDot';
import { Divider } from '../Divider';
import { calculateDistanceToScooter } from '@/utils/distance.util';
import { Geolocation } from '@/types/geolocation';

interface ScooterListBottomSheetProps {
  scooters: Scooter[];
  onClose: () => void;
  onScooterPress: (scooter: Scooter) => void;
  currentLocation: Geolocation;
}

const ScooterImage = require('../../assets/images/scooter.png');

export function ScooterListBottomSheet({
  scooters,
  onClose,
  onScooterPress,
  currentLocation,
}: ScooterListBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          Patinetes próximos a você
        </ThemedText>

        {scooters.map((scooter, i) => {
          const distance = calculateDistanceToScooter(
            currentLocation,
            scooter.geolocation,
          );

          return (
            <ThemedView key={scooter.id}>
              <Pressable
                style={styles.scooterItem}
                onPress={() => onScooterPress(scooter)}
              >
                <ThemedView style={styles.scooterInfo}>
                  <ThemedView style={styles.nameContainer}>
                    <ThemedText type="subtitle">{scooter.name}</ThemedText>
                    <StatusDot color={getBatteryColor(scooter.batteryLevel)} />
                  </ThemedView>

                  <ThemedView style={styles.distanceContainer}>
                    <Navigation2 size={16} color="#71717A" />
                    <ThemedText style={styles.distance}>
                      {distance.value}
                      {distance.unit}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <Image source={ScooterImage} style={styles.scooterImage} />

                <ChevronRight
                  size={24}
                  color="#000"
                  style={{ marginLeft: 'auto' }}
                />
              </Pressable>

              {i < scooters.length - 1 && <Divider />}
            </ThemedView>
          );
        })}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
  },
  scooterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  scooterInfo: {
    flex: 1,
    gap: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    color: '#71717A',
    fontSize: 14,
  },
  scooterImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
