import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Voucher } from '@/types/voucher';

interface VoucherListProps {
  vouchers: Voucher[];
}

export function VoucherList({ vouchers }: VoucherListProps) {
  const renderItem = ({ item }: { item: Voucher }) => {
    const expirationDate = item.expiredAt
      ? new Date(item.expiredAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Sem expiração';

    const usageLimit = item.usageLimit
      ? `${item.usageCount || 0}/${item.usageLimit}`
      : 'Ilimitado';

    return (
      <ThemedView style={styles.voucherItem}>
        <ThemedView style={styles.mainInfo}>
          <ThemedText style={styles.code}>{item.code}</ThemedText>
          <ThemedText style={styles.amount}>{item.amount} moedas</ThemedText>
        </ThemedView>

        <ThemedView style={styles.voucherInfo}>
          <ThemedText style={styles.expirationDate}>
            Expira em: {expirationDate}
          </ThemedText>
          <ThemedView style={styles.statusRow}>
            <ThemedText
              style={[
                styles.status,
                { color: item.status === 'active' ? '#22c55e' : '#6b7280' },
              ]}
            >
              {item.status === 'active' ? 'Disponível' : 'Expirado'}
            </ThemedText>
            <ThemedText style={styles.usageLimit}>
              Usos: {usageLimit}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <FlatList
      data={vouchers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.listContent}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    flexGrow: 1,
  },
  voucherItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    width: '100%',
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  code: {
    fontSize: 16,
    fontWeight: '600',
  },
  voucherInfo: {
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  expirationDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  status: {
    fontSize: 12,
    color: '#22c55e',
  },
  usedStatus: {
    color: '#6b7280',
  },
  usageLimit: {
    fontSize: 12,
    color: '#6b7280',
  },
});
