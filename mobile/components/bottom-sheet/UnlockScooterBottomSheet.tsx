import React, { useCallback, useMemo, useRef } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { ThemedView } from '../ThemedView';
import { Colors } from '@/constants/Colors';
import { Scooter, ScooterStatus } from '@/types/scooter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation2, Radius } from 'lucide-react-native';
import { unlockScooter } from '@/services/scooter.service';
import { socketService } from '@/services/socket.service';
import { StatusDot } from '../StatusDot';
import { Divider } from '../Divider';
import { io } from 'socket.io-client';
import { AxiosError } from 'axios';
import { useWallet } from '@/contexts/WalletContext';
import { useRide } from '@/contexts/RideContext';
import { calculateDistanceToScooter } from '@/utils/distance.util';
import { Geolocation } from '@/types/geolocation';

interface ScooterBottomSheetProps {
  scooter: Scooter;
  onClose: () => void;
  onRentPress: (scooter: Scooter) => void;
  currentLocation: Geolocation;
}

const ScooterImage = require('../../assets/images/scooter.png');

export function UnlockScooterBottomSheet({
  scooter,
  onClose,
  onRentPress,
  currentLocation,
}: ScooterBottomSheetProps) {
  const { wallet } = useWallet();
  const { config, calculateMaxUsageTime } = useRide();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '40%'], []);
  const distance = useMemo(() => {
    if (!currentLocation) return { value: 0, unit: 'm' as const };
    return calculateDistanceToScooter(currentLocation, scooter.geolocation);
  }, [currentLocation, scooter.geolocation]);

  const maxUsageTime = useMemo(() => {
    const { hours, minutes, limitedBy } = calculateMaxUsageTime({
      batteryLevel: scooter?.batteryLevel || 0,
      balance: wallet?.balance || 0,
      minimumBalance: wallet?.minimumBalance || 0,
      spentAmountPerMinute: config.SPENT_AMOUNT_PER_MINUTE,
    });

    return {
      formattedTime: `${hours}h ${minutes}min`,
      limitedBy,
    };
  }, [
    scooter.batteryLevel,
    wallet?.balance,
    wallet?.minimumBalance,
    config.SPENT_AMOUNT_PER_MINUTE,
  ]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const handleUnlock = async () => {
    onRentPress(scooter);
  };

  const unavailableBalance =
    (wallet?.balance || 0) <= (wallet?.minimumBalance || 0);

  if (!scooter) return null;

  const getBatteryColor = (batteryLevel: number) => {
    if (batteryLevel > 75) return 'green';
    if (batteryLevel > 50) return 'yellow';
    if (batteryLevel > 25) return 'orange';
    return 'red';
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{scooter.name}</ThemedText>
          <StatusDot color={getBatteryColor(scooter.batteryLevel)} size={10} />
          <Image source={ScooterImage} />
        </ThemedView>

        <ThemedView style={styles.infoContainer}>
          <ThemedView style={styles.infoItem}>
            <Navigation2 color="#27272A" size={20} />
            {/* <ThemedText type="subtitle">15</ThemedText>
            <ThemedText style={styles.zinc}>{config.UNIT_MEASURE}</ThemedText> */}
            <ThemedText type="subtitle">{distance.value}</ThemedText>
            <ThemedText style={styles.zinc}>{distance.unit}</ThemedText>
            {/* <ThemedText>{scooter.status}</ThemedText> */}
          </ThemedView>

          <ThemedView style={styles.infoItem}>
            <Radius color="#27272A" size={20} />
            <ThemedText type="subtitle">{config.FACTOR_IN_SECONDS}</ThemedText>
            <ThemedText style={styles.zinc}>
              /{config.TIME_IN_MINUTES} min
            </ThemedText>
            {/* <ThemedText>{scooter.batteryLevel}%</ThemedText> */}
          </ThemedView>
        </ThemedView>

        <Divider />

        <ThemedView style={styles.usageDescription}>
          <ThemedText>Tempo máximo de uso:</ThemedText>
          {/* <ThemedText>1h 50min</ThemedText> */}
          <ThemedText>{maxUsageTime.formattedTime}</ThemedText>
        </ThemedView>

        <ThemedButton
          title="Desbloquear"
          type="primary"
          onPress={handleUnlock}
          style={[
            styles.button,
            unavailableBalance && { backgroundColor: 'red' },
          ]}
          disabled={unavailableBalance}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    // backgroundColor: 'red',
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
    marginBottom: 20,
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
    // zIndex: 9,
    // elevation: 9,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 16,
  },
  zinc: {
    color: '#9F9FA9',
  },
  infoItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  usageDescription: {
    marginBottom: 24,
    opacity: 0.7,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 'auto',
  },
});
