import { api } from '@/lib/api';
import { Wallet } from '@/types/wallet';

const PATH = 'wallet';
interface WalletParams {
  amount: number;
}

export const getWallet = async (id: string) => {
  try {
    const response = await api.get<Wallet>(`${PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

export const addBalance = async (walletId: string, params: WalletParams) => {
  try {
    const endpoint = `${PATH}/${walletId}/add-balance`;
    const response = await api.post<Wallet>(endpoint, {
      amount: params.amount,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching add balance:', error?.message);
    throw error;
  }
};

export const updateWalletBalance = async (params: WalletParams) => {
  try {
    const endpoint = `${PATH}/${params.walletId}`;
    const response = await api.patch<Wallet>(endpoint, {
      balance: params.amount,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    throw error;
  }
};

export const withdraw = async (params: WalletParams) => {
  try {
    const endpoint = `${PATH}/${params.walletId}/withdraw`;
    const response = await api.post<Wallet>(endpoint, {
      amount: params.amount,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching withdraw', error);
    throw error;
  }
};
