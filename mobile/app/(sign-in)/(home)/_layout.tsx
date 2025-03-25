import { Redirect, Tabs, usePathname, router, Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedIconButton } from '@/components/ThemedIconButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const colorScheme = useColorScheme();

  if (!user) {
    return <Redirect href="/(sign-out)/login" />;
  }

  const ProfileRouter = () => {
    return (
      <Pressable
        onPress={() => router.push('/profile')}
        style={{
          marginLeft: 16,
          width: 36,
          height: 36,
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Image
          source={{ uri: user.picture }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Pressable>
    );
  };

  const CouponsHeader = () => {
    return (
      <ThemedIconButton
        type="default"
        icon="ticket"
        onPress={() => router.push('/coupon')}
        style={styles.couponButton}
      />
    );
  };

  const WalletBalanceHeader = () => {
    const title = '+10';

    return (
      <ThemedButton
        title={title}
        icon="wallet"
        // iconPosition="right"
        type="action"
        onPress={() => router.push('/my-wallet')}
        style={styles.walletButton}
        disabled={isLoading}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack
        screenOptions={({ route }) => ({
          headerTransparent: true,
          headerTitle: '',
          // headerLeft: ProfileRouter,
          headerLeft: CouponsHeader,
          // headerRight: CouponsHeader,
          headerRight: WalletBalanceHeader,
        })}
      ></Stack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  couponButton: {
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  walletButton: {},
});
