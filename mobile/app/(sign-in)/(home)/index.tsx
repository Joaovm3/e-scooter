import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert, Pressable, Image } from 'react-native';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedIconButton } from '@/components/ThemedIconButton';
import { router, useFocusEffect } from 'expo-router';
import { Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Map } from '@/components/Map';
import * as scooterService from '@/services/scooter.service';
import { CreateScooter, Scooter, ScooterStatus } from '@/types/scooter';
import { Geolocation } from '@/types/geolocation';

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Geolocation | null>(
    null,
  );
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchScooters();
    }, []),
  );

  const fetchScooters = async () => {
    try {
      const scootersData = await scooterService.getScooters();
      setScooters(scootersData);
      console.log('Scooters:', scootersData);
    } catch (error) {
      console.error('Error fetching scooters:', error);
    }
  };

  const loadInitialData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Permission Denied',
          'Please enable location services to use this app.',
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      setErrorMsg('Error getting location');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScooterPress = (scooter: Scooter) => {
    console.log('Scooter pressed:', scooter);
    // Handle scooter selection
  };

  const handleSettingPress = () => {
    router.push({
      pathname: '/profile',
      params: { headerTitle: 'Perfil' },
    });
  };

  const handleScanPress = () => {
    router.push({
      pathname: '/scan',
    });
  };

  const ProfileComponent = () => {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/profile',
            params: { headerTitle: 'Perfil' },
          })
        }
        style={{
          // marginLeft: 16,
          width: 40,
          height: 40,
          borderRadius: 100,
          overflow: 'hidden',
          // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Image
          source={{ uri: user?.picture }}
          style={{ width: '100%', height: '100%' }}
        />
      </Pressable>
    );
  };

  if (!currentLocation || isLoading) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <Map
        location={currentLocation}
        style={styles.homeMap}
        markers={scooters.map((scooter) => ({
          id: scooter.id,
          coordinate: scooter.geolocation,
          status: scooter.status,
          batteryLevel: scooter.batteryLevel,
          onPress: () => handleScooterPress(scooter),
        }))}
      />

      <ThemedView style={styles.tabBar}>
        <ThemedIconButton
          icon="compass"
          onPress={loadInitialData}
          style={styles.actionButtons}
        />

        <ThemedIconButton
          icon="qr-code"
          size={40}
          onPress={handleScanPress}
          style={styles.scanButton}
        />

        {/* <ThemedIconButton
          icon="settings"
          onPress={handleSettingPress}
          style={styles.actionButtons}
        /> */}

        <ProfileComponent />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeMap: {
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
