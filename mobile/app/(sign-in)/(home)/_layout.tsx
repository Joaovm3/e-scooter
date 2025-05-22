import {
  Redirect,
  Tabs,
  usePathname,
  router,
  Stack,
  useGlobalSearchParams,
} from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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
import { getWallet } from '@/services/wallet.service';
import { useWallet } from '@/contexts/WalletContext';
import { useFocusEffect } from '@react-navigation/native';
import { Radius } from 'lucide-react-native';

export default function HomeLayout() {
  const { user, isLoading } = useAuth();

  if (!user) {
    return <Redirect href="/(sign-out)/login" />;
  }

  const { balance, updateBalance } = useWallet();

  useFocusEffect(
    useCallback(() => {
      updateBalance();
    }, [updateBalance]),
  );

  // const [balance, setBalance] = useState<number>(user.wallet?.balance || 0);

  // const loadBalance = async () => {
  //   try {
  //     const walletId = user?.walletId || '';
  //     const data = await getWallet(walletId);
  //     setBalance(data.balance || balance);
  //   } catch (error) {
  //     console.error('Error loading balance:', error);
  //   }
  // };

  // const { initialBalance } = useGlobalSearchParams<{
  //   initialBalance: string;
  // }>();

  // useEffect(() => {
  //   loadBalance();
  // }, [initialBalance]);

  const SettingsRouter = () => {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/profile',
            params: { headerTitle: 'Perfil' },
          })
        }
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
          style={{ width: '100%', height: '100%' }}
        />
      </Pressable>
    );
  };

  const VoucherHeader = () => {
    return (
      <ThemedIconButton
        type="default"
        icon="ticket"
        onPress={() =>
          router.push({
            pathname: '/add-voucher',
            params: { headerTitle: 'Adicionar Voucher' },
          })
        }
        style={styles.voucherHeader}
      />
    );
  };

  const WalletBalanceHeader = () => {
    const isBalancePositive = balance >= 0;
    const title = `${isBalancePositive ? '+' : '-'} ${Math.abs(balance)}`;

    return (
      <ThemedButton
        title={title}
        iconColor={isBalancePositive ? '#18181B' : '#FF0000'}
        // CustomIcon={() => <Radius color="#000" size={24} />}
        icon="wallet"
        type="action"
        onPress={() =>
          router.push({
            pathname: '/my-wallet',
            params: {
              headerTitle: 'Minha Carteira',
              initialBalance: balance,
            },
          })
        }
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
          headerLeft: VoucherHeader,
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
  voucherHeader: {
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  walletButton: {
    // backgroundColor: 'red',
    // color: 'blue',
    borderRadius: '20%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});
