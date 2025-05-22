import { Alert, StyleSheet } from 'react-native';
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
import { Radius } from 'lucide-react-native';
import { VoucherBottomSheet } from '@/components/bottom-sheet/VoucherBottomSheet';
import { useVoucher } from '@/services/voucher.service';

export default function WalletScreen() {
  const { user } = useAuth();

  const { balance, updateBalance, addBalance } = useWallet();

  useFocusEffect(
    useCallback(() => {
      updateBalance();
    }, [updateBalance]),
  );

  const router = useRouter();

  const [showVoucherSheet, setShowVoucherSheet] = useState(false);

  const handleAddBalance = async () => {
    try {
      await addBalance(2);
    } catch (error) {
      console.error('Error adding balance:', error);
    }
  };

  const handleAddVoucher = () => {
    setShowVoucherSheet(true);
  };

  const handleVoucherSubmit = async (code: string) => {
    setShowVoucherSheet(false);
    await handleApplyVoucher(code);
  };

  const handleApplyVoucher = async (couponCode: string) => {
    try {
      console.log('Applying voucher:', couponCode);
      const voucher = await useVoucher(user?.id, { code: couponCode });

      Alert.alert(
        'Voucher cadastrado com sucesso!',
        `Você acabou de ganhar ${voucher.amount} moeda(s)!`,
      );

      await updateBalance();
    } catch (error: any) {
      Alert.alert('Erro ao utilizar o vocher!', error?.message || '');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.balanceContainer}>
        <ThemedText type="subtitle" style={styles.label}>
          Saldo disponível
        </ThemedText>

        <ThemedView style={styles.balance}>
          <Radius style={styles.icon} />
          <ThemedText type="title" style={styles.text}>
            {balance}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.actionsContainer}>
        {/* <ThemedButton
          type="primary"
          title="Adicionar saldo"
          icon="add"
          onPress={handleAddBalance}
          style={styles.button}
        /> */}

        <ThemedButton
          type="secondary"
          title="Usar voucher"
          iconColor="#27272A"
          icon="add"
          onPress={handleAddVoucher}
          style={styles.button}
        />
      </ThemedView>

      {/* <ThemedView style={styles.historyContainer}>
        <ThemedText style={styles.historyTitle}>
          Histórico de transações
        </ThemedText>
      </ThemedView> */}

      {showVoucherSheet && (
        <VoucherBottomSheet
          onClose={() => setShowVoucherSheet(false)}
          onSubmit={handleVoucherSubmit}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  label: {
    marginBottom: 10,
    opacity: 0.5,
    fontSize: 16,
  },
  text: {
    fontWeight: '600',
  },
  balance: {
    gap: 8,
    flexDirection: 'row',
  },
  icon: {
    alignItems: 'center',
    color: '#000',
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
