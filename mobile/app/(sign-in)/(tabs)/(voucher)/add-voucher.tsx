import { StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { ThemedButton } from '@/components/ThemedButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useVoucher, getAllVouchers } from '@/services/voucher.service';
import { VoucherList } from '@/components/VoucherList';
import { Voucher } from '@/types/voucher';

export default function VoucherScreen() {
  const { user } = useAuth();
  const isAdmin = true; //user?.isAdmin || false;
  const router = useRouter();

  const [couponCode, setCouponCode] = useState('');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    if (isAdmin) {
      loadVouchers();
    }
  }, [isAdmin]);

  const loadVouchers = async () => {
    try {
      const voucherList = await getAllVouchers();
      console.log({ voucherList });

      setVouchers(voucherList);
    } catch (error) {
      console.error('Error loading vouchers:', error);
    }
  };

  const handleApplyVoucher = async () => {
    try {
      console.log('Applying voucher:', couponCode);
      const voucher = await useVoucher(user?.id, { code: couponCode });
      Alert.alert(
        'Voucher cadastrado com sucesso!',
        `Você acabou de ganhar ${voucher.amount} moeda(s)!`,
      );
    } catch (error: any) {
      Alert.alert('Erro ao utilizar o vocher!', error?.message || '');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {isAdmin ? (
        <>
          <ThemedView style={styles.adminHeader}>
            <ThemedText type="title">Vouchers Cadastrados</ThemedText>
          </ThemedView>
          <VoucherList vouchers={vouchers} />
          <ThemedButton
            icon="add"
            type="secondary"
            title="Criar novo voucher"
            onPress={() =>
              router.push({
                pathname: '/create-voucher',
                params: { headerTitle: 'Criar Voucher' },
              })
            }
            style={styles.createButton}
          />
        </>
      ) : (
        <>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Insira seu código promocional
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <Input
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Digite seu código"
              autoCapitalize="characters"
              maxLength={15}
              style={styles.input}
            />
          </ThemedView>

          <ThemedButton
            title="Aplicar voucher"
            type="primary"
            onPress={handleApplyVoucher}
            style={styles.button}
            disabled={!couponCode}
          />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // justifyContent: 'center',
  },
  header: {
    marginTop: 24,
    marginBottom: 10,
    alignItems: 'center',
  },
  subtitle: {
    // marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    textTransform: 'uppercase',
    backgroundColor: '#f1f1f1',
  },
  button: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    // left: 16,
  },
  adminHeader: {
    marginVertical: 16,
    gap: 16,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: 16,
    // borderBottomWidth: 1,
    borderBottomColor: 'red',
  },
  createButton: {
    marginVertical: 16,
    // marginLeft: 16,
  },
});
