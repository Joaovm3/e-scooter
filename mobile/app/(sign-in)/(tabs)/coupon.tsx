import { StyleSheet, ScrollView, View } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Colors';

export default function CouponsScreen() {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = async () => {
    try {
      // adicionar lógica do backend aqui
      console.log('Applying coupon:', couponCode);
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Adicionar Cupom</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Insira seu código promocional para ganhar descontos
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
        title="Aplicar cupom"
        type="primary"
        onPress={handleApplyCoupon}
        style={styles.button}
        disabled={!couponCode}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    textTransform: 'uppercase',
    backgroundColor: '#f1f1f1',
  },
  button: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    left: 0,
    // marginTop: 'auto',
  },
  divider: {
    height: 1,
    // backgroundColor: Colors.light.border,
    backgroundColor: 'red',
    marginVertical: 32,
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    marginBottom: 16,
  },
});
