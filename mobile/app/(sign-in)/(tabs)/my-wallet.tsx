import { StyleSheet } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import * as walletService from '@/services/wallet.service';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import * as walletStorage from '@/storage/wallet.storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWallet } from '@/contexts/WalletContext';
import { useFocusEffect } from '@react-navigation/native';

export default function WalletScreen() {
  const { user } = useAuth();

  const { balance, updateBalance, addBalance } = useWallet();

  useFocusEffect(
    useCallback(() => {
      updateBalance();
    }, [updateBalance]),
  );

  const router = useRouter();

  // const { initialBalance } = useLocalSearchParams<{ initialBalance: string }>();
  // const [balance, setBalance] = useState<number>(Number(initialBalance) || 0);

  // useEffect(() => {
  //   loadBalance();
  // }, []);

  // const loadBalance = async () => {
  //   try {
  //     const walletId = user?.walletId || '';
  //     const data = await walletService.getWallet(walletId);
  //     setBalance(data.balance || balance);
  //     router.setParams({ initialBalance: balance });
  //   } catch (error) {
  //     console.error('Error loading balance:', error);
  //   }
  // };

  const handleAddBalance = async () => {
    try {
      await addBalance(2);
      // await walletService.addBalance({
      //   walletId: user?.walletId || '',
      //   amount: 1,
      // });
      // await loadBalance();
    } catch (error) {
      console.error('Error adding balance:', error);
    }
  };

  // const handleWithdraw = async () => {
  //   try {
  //     await walletService.withdraw();
  //     await loadBalance();
  //   } catch (error) {
  //     console.error('Error withdrawing:', error);
  //   }
  // };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.balanceContainer}>
        <ThemedText type="title" style={styles.label}>
          Saldo disponível
        </ThemedText>
        <ThemedText style={styles.balance}>{balance}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.actionsContainer}>
        <ThemedButton
          type="primary"
          title="Adicionar saldo"
          icon="add"
          onPress={handleAddBalance}
          style={styles.button}
        />
      </ThemedView>

      <ThemedView style={styles.historyContainer}>
        <ThemedText style={styles.historyTitle}>
          Histórico de transações
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 16,
    // backgroundColor: 'red',
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  label: {
    marginBottom: 10,
    opacity: 0.7,
  },
  balance: {
    backgroundColor: 'red',
    // fontSize: 36,
    // fontWeight: 'bold',
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    marginBottom: 16,
  },
});
