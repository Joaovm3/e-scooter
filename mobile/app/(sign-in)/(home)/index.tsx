import React, { useState, useEffect } from 'react';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { StyleSheet, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { ScooterMarker } from '@/components/ScooterMarker';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedIconButton } from '@/components/ThemedIconButton';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const panambi = {
  latitude: -28.308441080928095,
  longitude: -53.51704424369822,
};

const sao_paulo = {
  latitude: -23.5505,
  longitude: -46.6333,
};

const INITIAL_REGION: Region = {
  latitude: sao_paulo.latitude,
  longitude: sao_paulo.longitude,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const MOCK_SCOOTERS = [
  {
    id: '1',
    latitude: -28.308441080928095,
    longitude: -53.51704424369822,
  },
  {
    id: '2',
    latitude: -28.309441080928095,
    longitude: -53.51804424369822,
  },
];

export default function HomeScreen() {
  const [currentRegion, setCurrentRegion] = useState(INITIAL_REGION);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      Alert.alert(
        'Permission Denied',
        'Please enable location services to use this app.',
      );
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentRegion({
        ...currentRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log({ location, currentRegion });
    } catch (error) {
      setErrorMsg('Error getting location');
      console.error('Location error:', error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleScooterPress = (scooterId: string) => {
    console.log(`Scooter ${scooterId} pressed`);
    // Handle scooter selection
  };

  const handleSettingPress = () => {
    router.push('/profile');
  };

  const handleScanPress = () => {
    router.push('/scan');
  };

  return (
    <ThemedView style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChangeComplete} // Track user interaction
        region={currentRegion}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
      >
        <Marker
          coordinate={{
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          }}
        />

        {MOCK_SCOOTERS.map((scooter) => (
          <ScooterMarker
            key={scooter.id}
            latitude={scooter.latitude}
            longitude={scooter.longitude}
            onPress={() => handleScooterPress(scooter.id)}
          />
        ))}
      </MapView>

      <ThemedView style={styles.tabBar}>
        {/* Por hora não há nenhum componente, apenas para centralizar os demais */}
        {/* <ThemedView style={styles.empty}></ThemedView> */}

        <ThemedIconButton
          icon="settings"
          onPress={handleSettingPress}
          style={styles.actionButtons}
        />

        <ThemedIconButton
          icon="qr-code"
          size={40}
          onPress={handleScanPress}
          style={styles.scanButton}
        />

        <ThemedIconButton
          icon="compass"
          onPress={getCurrentLocation}
          style={styles.actionButtons}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 20,
    right: 20,
    flex: 1,
    margin: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  empty: {
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
  },
  actionButtons: {
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  scanButton: {
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
