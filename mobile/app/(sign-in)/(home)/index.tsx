import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { StyleSheet, View, Alert, Pressable, Image } from 'react-native';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedIconButton } from '@/components/ThemedIconButton';
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Map } from '@/components/Map';
import * as scooterService from '@/services/scooter.service';
import { socketService } from '@/services/socket.service';
import { CreateScooter, Scooter, ScooterStatus } from '@/types/scooter';
import { Geolocation } from '@/types/geolocation';
import { LocateFixed, QrCode } from 'lucide-react-native';
import { UnlockScooterBottomSheet } from '@/components/bottom-sheet/UnlockScooterBottomSheet';
import { ScooterInUseBottomSheet } from '@/components/bottom-sheet/ScooterInUseBottomSheet';
import { ScooterListBottomSheet } from '@/components/bottom-sheet/ScooterListBottomSheet';
import { useWallet } from '@/contexts/WalletContext';
import { setInitialRideBalance } from '@/storage/wallet.storage';
import MapView from 'react-native-maps';

const ScooterIcon = require('../../../assets/images/scooter-icon.png');

export default function HomeScreen() {
  // 1. Get params and context
  const { scooterId } = useGlobalSearchParams<{ scooterId: string }>();
  const { user } = useAuth();
  const { updateBalance } = useWallet();
  const mapRef = useRef<MapView>(null);

  // 2. Component state
  const [currentLocation, setCurrentLocation] = useState<Geolocation | null>(
    null,
  );
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [activeRide, setActiveRide] = useState<Scooter | null>(null);
  const [showScooterList, setShowScooterList] = useState(false);

  // 3. Memoized values
  const markers = useMemo(
    () => [
      ...scooters.map((scooter) => ({
        id: scooter.id,
        coordinate: scooter.geolocation,
        status: scooter.status,
        batteryLevel: scooter.batteryLevel,
        onPress: () => handleScooterPress(scooter),
      })),
      ...(!activeRide
        ? [
            {
              id: 'user-location',
              coordinate: currentLocation,
              isUserLocation: true,
            },
          ]
        : []),
    ],
    [scooters, activeRide, currentLocation],
  );

  // 4. Callbacks
  const handleScooterPress = useCallback((scooter: Scooter) => {
    setSelectedScooter(scooter);
  }, []);

  const centerMapOnLocation = useCallback((location: Geolocation) => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500,
    );
  }, []);

  // 5. Effects
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!activeRide?.geolocation || !mapRef.current) return;
    centerMapOnLocation(activeRide.geolocation);
  }, [activeRide?.geolocation, centerMapOnLocation]);

  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        const scooters = await fetchScooters();
        checkActiveRide(scooters);
        if (scooterId) {
          checkQRCodeRedirect(scooters, scooterId);
        }
      };
      initialize();
    }, [scooterId]),
  );

  useEffect(() => {
    if (!activeRide) return;

    setScooters([activeRide]);
    // let isMounted = true; // Adicione flag para controlar montagem

    const setupSocket = async () => {
      try {
        await socketService.joinScooterRoom(activeRide.id);
        socketService.subscribeToScooterPosition((updatedScooter) => {
          // if (!isMounted) return; // Verifique se componente ainda está montado

          if (updatedScooter.id === activeRide.id) {
            const mergedData = { ...activeRide, ...updatedScooter };
            setScooters([mergedData]);
            setActiveRide(mergedData);
            return;
          }
          handleFinishRide(updatedScooter);
        });
      } catch (error) {
        console.error('Error setting up scooter tracking:', error);
      }
    };

    setupSocket();

    return () => {
      // isMounted = false; // Marca componente como desmontado
      socketService.unsubscribeFromScooterPosition();
      socketService.disconnect();
    };
  }, [activeRide]);

  const fetchScooters = async () => {
    try {
      const scootersData = await scooterService.getScooters();
      const availableScooters = scootersData.filter(
        (s) => s.status === ScooterStatus.AVAILABLE,
      );
      setScooters(availableScooters);
      console.log('Scooters:', availableScooters);
      return scootersData;
    } catch (error) {
      console.error('Error fetching scooters:', error);
    }

    return [];
  };

  const checkActiveRide = (scooters: Scooter[]) => {
    const activeScooter = scooters.find((s) => s?.userId === user?.id);
    if (!activeScooter) return;

    setActiveRide(activeScooter);
    setScooters([activeScooter]);
  };

  const checkQRCodeRedirect = (scooters: Scooter[], scooterId: string) => {
    if (!scooterId) return;

    const scooter = scooters.find((s) => s.id === scooterId);
    console.log('chamou', { scooter });
    if (scooter) {
      setShowScooterList(false);
      handleScooterPress(scooter);
      centerMapOnLocation(scooter.geolocation);
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
      centerMapOnLocation(location.coords);
    } catch (error) {
      setErrorMsg('Error getting location');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentPress = async (scooter: Scooter) => {
    try {
      const scooterResponse = await scooterService.unlockScooter(
        scooter?.id || '',
        user?.id || '',
      );
      console.log('Unlock response:', scooterResponse);

      const isScooterUnlocked = scooterResponse.status === ScooterStatus.IN_USE;
      if (isScooterUnlocked) {
        setActiveRide(scooterResponse);
        setSelectedScooter(null);
        await setInitialRideBalance(1);
      } else {
        console.error('Error unlocking scooter');
      }
    } catch (error: any) {
      Alert.alert('Erro ao desbloquear', error?.message);
      console.error('Error during unlock process:', error);
    }
  };

  const handleFinishRide = async (scooter: Scooter) => {
    try {
      await scooterService.finishRide(scooter.id, user?.id || '');
    } catch (error) {
      console.error('Error finishing ride:', error);
    } finally {
      await fetchScooters();
      await updateBalance();
      await setInitialRideBalance(0);
      setActiveRide(null);
    }
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

  const handleScooterIconPress = () => {
    setShowScooterList(true);
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
        ref={mapRef}
        selectedMarkerId={selectedScooter?.id}
        location={currentLocation}
        style={styles.homeMap}
        markers={markers}
      />

      <ThemedView style={[styles.tabBarContainer]}>
        <ThemedView style={styles.compassContainer}>
          <ThemedIconButton
            CustomIcon={() => <LocateFixed color="#000" />}
            onPress={loadInitialData}
            style={styles.actionButton}
          />
        </ThemedView>

        <ThemedView style={styles.tabBar}>
          <ThemedIconButton
            CustomIcon={() => (
              <Image source={ScooterIcon} style={styles.scooterButton} />
            )}
            style={[styles.actionButton]}
            onPress={handleScooterIconPress}
          />

          <ThemedIconButton
            CustomIcon={() => <QrCode size={32} color="#000" />}
            size={40}
            onPress={handleScanPress}
            style={[styles.actionButton, styles.scanButton]}
          />

          <ProfileComponent />
        </ThemedView>
      </ThemedView>

      {showScooterList && (
        <ScooterListBottomSheet
          currentLocation={currentLocation}
          scooters={scooters}
          onClose={() => {
            setShowScooterList(false);
          }}
          onScooterPress={(scooter) => {
            setShowScooterList(false);
            handleScooterPress(scooter);
            centerMapOnLocation(scooter.geolocation);
          }}
        />
      )}

      {selectedScooter && !activeRide && (
        <UnlockScooterBottomSheet
          scooter={selectedScooter}
          currentLocation={currentLocation}
          onClose={() => {
            setSelectedScooter(null);
          }}
          onRentPress={handleRentPress}
        />
      )}

      {activeRide && (
        <ScooterInUseBottomSheet
          scooter={activeRide}
          onClose={() => setActiveRide(null)}
          onFinishRide={handleFinishRide}
        />
      )}
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
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 20,
    right: 20,
    gap: 16,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  compassContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  empty: {
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
  },
  actionButton: {
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  scooterButton: {
    width: 24,
    height: 24,
  },
  scanButton: {
    // elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
});
