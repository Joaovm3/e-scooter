import { api } from '@/lib/api';
import { Wallet } from '@/types/wallet';

const PATH = 'wallet';

export const getBalance = async (userId: string) => {
  try {
    const response = await api.get<Wallet>(`${PATH}/balance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

export const addBalance = async (amount: number) => {
  try {
    const response = await api.post<Wallet>(`${PATH}/add-balance`, { amount });
    return response.data;
  } catch (error) {
    console.error('Error fetching add balance:', error);
    throw error;
  }
};

export const withdraw = async () => {
  try {
    const response = await api.get<Wallet>(`${PATH}/withdraw`);
    return response.data;
  } catch (error) {
    console.error('Error fetching withdraw', error);
    throw error;
  }
};
