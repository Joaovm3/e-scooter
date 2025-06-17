import React, { createContext, useContext, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Geolocation } from '@/types/geolocation';

interface RideConfig {
  FACTOR_IN_SECONDS: number;
  SPENT_AMOUNT_PER_MINUTE: number;
  TIME_IN_MINUTES: number;
  UNIT_MEASURE: 'km' | 'm';
}

interface RideContextData {
  config: RideConfig;
  initialRideBalance: number | null;
  initialGeolocation: Geolocation | null;
  startTime: Date | null;
  totalDistance: number;
  setTotalDistance: (distance: number) => Promise<void>;
  setInitialRideBalance: (balance: number) => Promise<void>;
  setInitialGeolocation: (location: Geolocation) => Promise<void>;
  setStartTime: (time: Date) => Promise<void>;
  clearRideData: () => Promise<void>;
  calculateMaxUsageTime: (props: MaxUsageProps) => MaxUsageTime;
}

interface MaxUsageProps {
  batteryLevel: number;
  balance: number;
  minimumBalance: number;
  spentAmountPerMinute: number;
}

interface MaxUsageTime {
  hours: number;
  minutes: number;
  limitedBy: 'battery' | 'balance';
}

const STORAGE_KEYS = {
  INITIAL_BALANCE: 'ride_initial_balance',
  INITIAL_LOCATION: 'ride_initial_location',
  START_TIME: 'ride_start_time',
  TOTAL_DISTANCE: 'ride_total_distance',
} as const;

const RIDE_CONFIG: RideConfig = {
  FACTOR_IN_SECONDS: 60,
  SPENT_AMOUNT_PER_MINUTE: 1,
  TIME_IN_MINUTES: 1,
  UNIT_MEASURE: 'km',
};

const RideContext = createContext<RideContextData>({} as RideContextData);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const [initialRideBalance, setInitialBalance] = useState<number | null>(null);
  const [initialGeolocation, setInitialLocation] = useState<Geolocation | null>(
    null,
  );
  const [startTime, setInitialTime] = useState<Date | null>(null);
  const [totalDistance, setDistance] = useState<number>(0);

  const setTotalDistance = useCallback(async (distance: number) => {
    try {
      setDistance(distance);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.TOTAL_DISTANCE,
        distance.toString(),
      );
    } catch (error) {
      console.error('Error storing total distance:', error);
    }
  }, []);

  const setInitialRideBalance = useCallback(async (balance: number) => {
    try {
      setInitialBalance(balance);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.INITIAL_BALANCE,
        balance.toString(),
      );
    } catch (error) {
      console.error('Error storing initial balance:', error);
      throw error;
    }
  }, []);

  const setInitialGeolocation = useCallback(async (location: Geolocation) => {
    try {
      setInitialLocation(location);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.INITIAL_LOCATION,
        JSON.stringify(location),
      );
    } catch (error) {
      console.error('Error storing initial location:', error);
      throw error;
    }
  }, []);

  const setStartTime = useCallback(async (time: Date) => {
    try {
      setInitialTime(time);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.START_TIME,
        time.toISOString(),
      );
    } catch (error) {
      console.error('Error storing start time:', error);
      throw error;
    }
  }, []);

  const clearRideData = useCallback(async () => {
    try {
      setInitialBalance(null);
      setInitialLocation(null);
      setInitialTime(null);
      setDistance(0);

      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.INITIAL_BALANCE),
        SecureStore.deleteItemAsync(STORAGE_KEYS.INITIAL_LOCATION),
        SecureStore.deleteItemAsync(STORAGE_KEYS.START_TIME),
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOTAL_DISTANCE),
      ]);
    } catch (error) {
      console.error('Error clearing ride data:', error);
      throw error;
    }
  }, []);

  const calculateMaxUsageTime = ({
    batteryLevel,
    balance,
    minimumBalance,
    spentAmountPerMinute,
  }: MaxUsageProps): MaxUsageTime => {
    // Calculate max time based on battery (assuming 100% = 2 hours)
    const FULL_BATTERY_MINUTES = 120;
    const batteryMinutes = Math.floor(
      (batteryLevel / 100) * FULL_BATTERY_MINUTES,
    );

    // Calculate max time based on available balance
    const availableBalance = balance - minimumBalance;
    const balanceMinutes = Math.floor(availableBalance / spentAmountPerMinute);

    // Use the lower value between battery and balance time
    const totalMinutes = Math.min(batteryMinutes, balanceMinutes);

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      limitedBy: batteryMinutes < balanceMinutes ? 'battery' : 'balance',
    };
  };

  React.useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [balanceStr, locationStr, timeStr, distanceStr] =
          await Promise.all([
            SecureStore.getItemAsync(STORAGE_KEYS.INITIAL_BALANCE),
            SecureStore.getItemAsync(STORAGE_KEYS.INITIAL_LOCATION),
            SecureStore.getItemAsync(STORAGE_KEYS.START_TIME),
            SecureStore.getItemAsync(STORAGE_KEYS.TOTAL_DISTANCE),
          ]);

        if (balanceStr) setInitialBalance(Number(balanceStr));
        if (locationStr) setInitialLocation(JSON.parse(locationStr));
        if (timeStr) setInitialTime(new Date(timeStr));
        if (distanceStr) setDistance(Number(distanceStr));

        console.log('[RideContext] Loaded stored data:', {
          balance: balanceStr,
          location: locationStr,
          time: timeStr,
        });
      } catch (error) {
        console.error('[RideContext] Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  const contextValue = React.useMemo(
    () => ({
      config: RIDE_CONFIG,
      initialRideBalance,
      initialGeolocation,
      startTime,
      totalDistance,
      setTotalDistance,
      setInitialRideBalance,
      setInitialGeolocation,
      setStartTime,
      clearRideData,
      calculateMaxUsageTime,
    }),
    [
      initialRideBalance,
      initialGeolocation,
      startTime,
      totalDistance,
      setTotalDistance,
      setInitialRideBalance,
      setInitialGeolocation,
      setStartTime,
      clearRideData,
      calculateMaxUsageTime,
    ],
  );

  return (
    <RideContext.Provider value={contextValue}>{children}</RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);

  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }

  return context;
}
