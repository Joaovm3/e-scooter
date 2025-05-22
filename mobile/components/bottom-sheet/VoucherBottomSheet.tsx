import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { ThemedView } from '../ThemedView';
import { Input } from '../ui/Input';

interface VoucherBottomSheetProps {
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export function VoucherBottomSheet({
  onClose,
  onSubmit,
}: VoucherBottomSheetProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%'], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  const handleSubmit = () => {
    if (voucherCode) {
      onSubmit(voucherCode.toUpperCase());
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ThemedView style={styles.inputContainer}>
          <Input
            placeholder="Digite o código do voucher"
            value={voucherCode}
            onChangeText={setVoucherCode}
            autoCapitalize="characters"
            style={styles.input}
          />
        </ThemedView>

        <ThemedButton
          title="Ativar voucher"
          type="primary"
          onPress={handleSubmit}
          disabled={!voucherCode}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
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
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  voucherCode: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 32,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    // fontSize: 16,
  },
});
