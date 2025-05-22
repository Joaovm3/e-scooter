import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Image, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { ThemedView } from '../ThemedView';
import { Scooter } from '@/types/scooter';
import { Clock, Radius } from 'lucide-react-native';
import { getScooterStatus } from '@/utils/scooter.util';
import { Divider } from '../Divider';
import { useWallet } from '@/contexts/WalletContext';
import { useRide } from '@/contexts/RideContext';
import { calculateDistance } from '@/utils/distance.util';
import AnimatedRollingNumber from 'react-native-animated-rolling-numbers';
import { Easing } from 'react-native-reanimated';

interface ScooterInUseBottomSheetProps {
  scooter: Scooter;
  onClose: () => void;
  onFinishRide: (scooter: Scooter) => void;
}

const formatTime = (totalSeconds: number) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

const ScooterImage = require('../../assets/images/scooter.png');

export function ScooterInUseBottomSheet({
  scooter,
  onClose,
  onFinishRide,
}: ScooterInUseBottomSheetProps) {
  const { balance, addBalance } = useWallet();
  const {
    config,
    initialRideBalance,
    initialGeolocation,
    startTime,
    totalDistance,
    setTotalDistance,
    setInitialRideBalance,
    setInitialGeolocation,
    setStartTime,
    clearRideData,
  } = useRide();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const lastPositionRef = useRef(scooter.geolocation);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);

  useEffect(() => {
    if (!scooter.geolocation || !lastPositionRef.current) return;

    const newDistance = calculateDistance(
      lastPositionRef.current.latitude,
      lastPositionRef.current.longitude,
      scooter.geolocation.latitude,
      scooter.geolocation.longitude,
    );

    if (newDistance > 0) {
      const updatedDistance = totalDistance + newDistance;
      setTotalDistance(updatedDistance);
      console.log('[Ride] Distance updated:', {
        new: newDistance,
        total: totalDistance + newDistance,
        from: lastPositionRef.current,
        to: scooter.geolocation,
      });
    }
    console.log('[Ride] Distance updated:', {
      newDistance,
      new: newDistance,
      total: totalDistance + newDistance,
      from: lastPositionRef.current,
      to: scooter.geolocation,
    });
    // Update last known position
    lastPositionRef.current = scooter.geolocation;
  }, [scooter.geolocation]);

  // Calculate distance when position updates
  // useEffect(() => {
  //   if (!initialGeolocation || !scooter.geolocation) return;

  //   const distance = calculateDistance(
  //     initialGeolocation.latitude,
  //     initialGeolocation.longitude,
  //     scooter.geolocation.latitude,
  //     scooter.geolocation.longitude,
  //   );

  //   console.log(
  //     '[Ride] Distance updated:',
  //     distance,
  //     scooter.geolocation.latitude,
  //   );
  //   setTotalDistance(distance.toString());
  // }, [scooter.geolocation, initialGeolocation]);

  useEffect(() => {
    const initializeRide = async () => {
      if (!initialRideBalance) {
        await setInitialRideBalance(balance);
      }

      if (!initialGeolocation) {
        await setInitialGeolocation(scooter.geolocation);
      }

      if (!startTime) {
        await setStartTime(
          scooter.startTime ? new Date(scooter.startTime) : new Date(),
        );
      }
    };

    initializeRide();
  }, []);

  useEffect(() => {
    if (!startTime) return;

    const elapsedTimeInterval = setInterval(() => {
      const now = new Date();
      const diffInMs = now.getTime() - new Date(startTime).getTime();
      const diffInSeconds = Math.floor(diffInMs / 1000);

      setElapsedSeconds(diffInSeconds);
    }, 1000);

    const updateWalletInterval = setInterval(async () => {
      try {
        await addBalance(-config.SPENT_AMOUNT_PER_MINUTE); // TODO: DESCOMENTAR PRA DESCONTAR SALDO
      } catch (error: any) {
        Alert.alert('Ops!', error?.message, [
          {
            text: 'Ok, finalizar a corrida',
            onPress: async () => {
              await clearRideData();
              onFinishRide(scooter);
            },
          },
        ]);
        clearInterval(elapsedTimeInterval);
        clearInterval(updateWalletInterval);
      }
    }, config.FACTOR_IN_SECONDS * 1000);

    return () => {
      clearInterval(elapsedTimeInterval);
      clearInterval(updateWalletInterval);
    };
  }, [startTime]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  const handleFinishRide = async () => {
    await clearRideData();
    onFinishRide(scooter);
  };

  const spentTokens = initialRideBalance ? initialRideBalance - balance : 0;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ThemedText type="subtitle" style={{ color: '#9F9FA9' }}>
          {scooter.name}
        </ThemedText>

        <ThemedView style={styles.header}>
          <ThemedText type="title">
            {getScooterStatus(scooter?.status)}
          </ThemedText>
          <Image source={ScooterImage} style={styles.scooterImage} />
        </ThemedView>

        <ThemedView style={styles.costInfo}>
          <Radius size={24} color="#27272A" />
          <ThemedText type="subtitle" style={styles.cost}>
            {config.SPENT_AMOUNT_PER_MINUTE}
          </ThemedText>
          <ThemedText style={styles.zinc}>
            /{config.TIME_IN_MINUTES} min
          </ThemedText>
        </ThemedView>

        <Divider />

        <ThemedView style={styles.rideInfoContainer}>
          <ThemedView style={styles.infoItem}>
            <Radius size={16} color="#27272A" />
            <ThemedText type="subtitle">{spentTokens}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoItem}>
            <AnimatedRollingNumber
              value={totalDistance}
              textStyle={{
                fontSize: 20,
                fontWeight: 'bold',
              }}
              spinningAnimationConfig={{
                duration: 500,
              }}
              formattedText={totalDistance.toFixed(2)}
            />
            <ThemedText style={styles.zinc}>{config.UNIT_MEASURE}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoItem}>
            <Clock size={16} color="#27272A" />
            <ThemedText type="subtitle">
              {formatTime(elapsedSeconds)}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedButton
          title="Finalizar"
          type="primary"
          onPress={handleFinishRide}
          style={styles.button}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  scooterImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  costInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 5,
    // marginBottom: 24,
  },
  cost: {
    fontSize: 24,
    marginLeft: 5,
  },
  rideInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zinc: {
    color: '#9F9FA9',
  },
  button: {
    // marginTop: 'auto',
    // backgroundColor: '#3B82F6',
  },
  warning: {
    color: '#EF4444', // red color for low time warning
  },
});
