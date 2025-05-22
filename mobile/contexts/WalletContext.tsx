import { createContext, useContext, useCallback, useState } from 'react';
import * as walletService from '@/services/wallet.service';
import * as walletStorage from '@/storage/wallet.storage';
import { Wallet } from '@/types/wallet';
import { useAuth } from './AuthContext';

interface WalletContextData {
  balance: number;
  isLoading: boolean;
  wallet: Wallet | null;
  updateBalance: () => Promise<void>;
  addBalance: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  // if (!user?.walletId) return;

  const [balance, setBalance] = useState<number>(0);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateBalance = useCallback(async () => {
    if (!user?.walletId) return;

    try {
      setIsLoading(true);
      const walletResponse = await walletService.getWallet(user.walletId);
      setBalance(walletResponse.balance);
      setWallet(walletResponse);
      await walletStorage.setWallet(walletResponse);
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
        const updatedWallet = await walletService.updateBalance(user.walletId, {
          amount,
        });
        setBalance(updatedWallet.balance);
        await walletStorage.setWallet(updatedWallet);
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
      value={{
        balance,
        wallet,
        isLoading,
        updateBalance,
        addBalance,
      }}
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
