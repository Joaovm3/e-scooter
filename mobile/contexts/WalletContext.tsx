import { createContext, useContext, useCallback, useState } from 'react';
import * as walletService from '@/services/wallet.service';
import * as walletStorage from '@/storage/wallet.storage';
import { Wallet } from '@/types/wallet';
import { useAuth } from './AuthContext';

interface WalletContextData {
  balance: number;
  isLoading: boolean;
  updateBalance: () => Promise<void>;
  addBalance: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const updateBalance = useCallback(async () => {
    if (!user?.walletId) return;

    try {
      setIsLoading(true);
      const wallet = await walletService.getWallet(user.walletId);
      setBalance(wallet.balance);
      await walletStorage.setWallet(wallet);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.walletId]);

  const addBalance = useCallback(
    async (amount: number) => {
      if (!user?.walletId) return;

      try {
        setIsLoading(true);
        const wallet = await walletService.addBalance(user.walletId, {
          amount,
        });
        setBalance(wallet.balance);
        await walletStorage.setWallet(wallet);
      } catch (error) {
        console.error('Error adding balance:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.walletId],
  );

  return (
    <WalletContext.Provider
      value={{ balance, isLoading, updateBalance, addBalance }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
