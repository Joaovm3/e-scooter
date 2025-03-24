import { api } from '@/lib/api';

const PATH = 'wallet';

export const getBalance = async (userId: string) => {
  try {
    const response = await api.get(`${PATH}/balance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};

export const addBalance = async (amount: number) => {
  try {
    const response = await api.post(`${PATH}/add-balance`, { amount });
    return response.data;
  } catch (error) {
    console.error('Error fetching add balance:', error);
    throw error;
  }
};

export const withdraw = async () => {
  try {
    const response = await api.get(`${PATH}/withdraw`);
    return response.data;
  } catch (error) {
    console.error('Error fetching withdraw', error);
    throw error;
  }
};
