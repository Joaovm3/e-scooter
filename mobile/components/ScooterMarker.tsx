import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { ThemedText } from './ThemedText';
import { Geolocation } from '@/types/geolocation';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedView } from './ThemedView';
import { ScooterStatus } from '@/types/scooter';

export interface ScooterMarkerProps {
  coordinate: Geolocation;
  onPress?: () => void;
  status?: ScooterStatus;
  batteryLevel?: number;
  draggable?: boolean;
  onDragEnd?: (coordinate: Geolocation) => void;
}

const COLOR = Colors.light.tint;

export function ScooterMarker({
  coordinate,
  onPress,
  status = ScooterStatus.AVAILABLE,
  batteryLevel = 100,
  draggable = false,
  onDragEnd,
}: ScooterMarkerProps) {
  const [isSelected, setIsSelected] = useState(false);

  const batteryColorLevels = [
    { limit: 10, color: '#FF3131' },
    { limit: 20, color: 'yellow' },
    { limit: 100, color: '#00C853' },
  ];

  const getBatteryColor = (batteryLevel: number) => {
    const color = batteryColorLevels.find(
      (level) => batteryLevel <= level.limit,
    );
    return color ? color.color : 'green';
  };

  const handlePress = () => {
    setIsSelected(!isSelected);
    onPress?.();
  };

  const batteryColor = getBatteryColor(batteryLevel);

  return (
    <Marker
      coordinate={coordinate}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.nativeEvent.coordinate)}
      onPress={handlePress}
    >
      <ThemedView
        style={[styles.marker, isSelected && { backgroundColor: batteryColor }]}
      >
        <Image
          source={require('../assets/images/scooter.png')}
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
