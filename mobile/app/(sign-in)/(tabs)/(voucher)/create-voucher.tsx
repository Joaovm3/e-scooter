import { StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { ThemedButton } from '@/components/ThemedButton';
import { useRouter } from 'expo-router';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import * as voucherService from '@/services/voucher.service';
import { CreateVoucher, Voucher, VoucherStatus } from '@/types/voucher';

export default function CreateVoucherScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiredAt, setExpiredAt] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCodeChange = (text: string) => {
    // Remove spaces and non-alphanumeric characters
    const alphanumeric = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setCode(alphanumeric);
  };

  const handleCreateVoucher = async () => {
    try {
      const voucherData: CreateVoucher = {
        code: code.trim(),
        amount: Number(amount),
        expiredAt,
        usageLimit: Number(usageLimit),
        status: VoucherStatus.ACTIVE,
      };
      console.log({ voucherData });

      await voucherService.createVoucher(voucherData);
      Alert.alert('Sucesso', 'Voucher criado com sucesso!', [
        {
          text: 'Voltar',
          onPress: () => router.back(),
        },
        {
          text: 'OK',
        },
      ]);
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      Alert.alert('Erro ao criar o voucher', error?.message);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpiredAt(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Crie novos vouchers promocionais
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <Input
          value={code}
          onChangeText={handleCodeChange}
          placeholder="Código do voucher (apenas letras e números)"
          autoCapitalize="characters"
          maxLength={15}
          style={[styles.input, styles.uppercase]}
        />
        <Input
          value={amount}
          onChangeText={setAmount}
          placeholder="Valor do voucher"
          keyboardType="numeric"
          style={styles.input}
        />
        <Input
          value={usageLimit}
          onChangeText={setUsageLimit}
          placeholder="Limite de uso"
          keyboardType="numeric"
          style={styles.input}
        />

        <ThemedButton
          title="Selecionar data de expiração"
          type="secondary"
          onPress={() => setShowDatePicker(true)}
        />

        <ThemedText type="caption" style={styles.dateText}>
          Expira em: {expiredAt.toLocaleDateString('pt-BR')}
        </ThemedText>

        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={expiredAt}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
            locale="pt-BR"
          />
        )}
      </ThemedView>

      <ThemedButton
        title="Criar voucher"
        type="primary"
        onPress={handleCreateVoucher}
        disabled={!code || !amount || !usageLimit}
        style={styles.submitButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f1f1f1',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  dateText: {
    textAlign: 'center',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
