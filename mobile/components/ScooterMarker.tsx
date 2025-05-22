import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Marker } from 'react-native-maps';
import { ThemedText } from './ThemedText';
import { Geolocation } from '@/types/geolocation';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedView } from './ThemedView';
import { Scooter, ScooterStatus } from '@/types/scooter';
import { getBatteryColor } from '@/utils/scooter.util';

export interface ScooterMarkerProps extends Partial<Scooter> {
  coordinate: Geolocation;
  onPress?: () => void;
  draggable?: boolean;
  onDragEnd?: (coordinate: Geolocation) => void;
  style?: StyleProp<ViewStyle>;
  isSelected?: boolean;
  isUserLocation?: boolean;
}

const COLOR = Colors.light.tint;

export function ScooterMarker({
  coordinate,
  onPress,
  status = ScooterStatus.AVAILABLE,
  batteryLevel = 100,
  draggable = false,
  onDragEnd,
  isSelected = false,
}: ScooterMarkerProps) {
  const batteryColor = getBatteryColor(batteryLevel);

  return (
    <Marker
      coordinate={coordinate}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.nativeEvent.coordinate)}
      onPress={onPress}
    >
      <ThemedView
        style={[styles.marker, isSelected && { backgroundColor: batteryColor }]}
      >
        <Image
          source={require('../assets/images/scooter-icon.png')}
          style={[
            styles.icon,
            {
              borderColor: isSelected ? 'white' : batteryColor,
              tintColor: isSelected ? 'white' : batteryColor,
            },
          ]}
        />
      </ThemedView>
    </Marker>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderRadius: 100,
    padding: 4,
  },
  marker: {
    padding: 3,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
});
