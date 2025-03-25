import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

interface ScooterMarkerProps {
  latitude: number;
  longitude: number;
  onPress?: () => void;
}
const COLOR = Colors.light.tint;

export function ScooterMarker({
  latitude,
  longitude,
  onPress,
}: ScooterMarkerProps) {
  return (
    <Marker coordinate={{ latitude, longitude }} onPress={onPress}>
      <View style={styles.markerContainer}>
        <IconSymbol name="scooter" size={24} color={COLOR} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
