import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
// import { Text } from '@/components/ui/Text';
// import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import * as walletService from '@/services/wallet.service';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';

export default function WalletScreen() {
  const { user } = useAuth();
  const userId = user?.id || '123';
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      setLoading(true);
      const data = await walletService.getBalance(userId);
      // setBalance(data.balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async () => {
    try {
      await walletService.addBalance(50);
      await loadBalance();
    } catch (error) {
      console.error('Error adding balance:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await walletService.withdraw();
      await loadBalance();
    } catch (error) {
      console.error('Error withdrawing:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.balanceContainer}>
        <ThemedText style={styles.label}>Saldo disponível</ThemedText>
        <ThemedText style={styles.balance}>R$ {balance.toFixed(2)}</ThemedText>
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
    padding: 16,
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  label: {
    marginBottom: 8,
    opacity: 0.7,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
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
