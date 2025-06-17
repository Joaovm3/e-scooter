import { api } from '@/lib/api';
import { CreateVoucher, Voucher } from '@/types/voucher';

const PATH = 'voucher';

export interface VoucherParams {
  code: string;
}

export const getAllVouchers = async () => {
  try {
    const response = await api.get<Voucher[]>(PATH);
    return response.data;
  } catch (error) {
    console.error('Error get all vouchers:', error);
    throw error;
  }
};

export const createVoucher = async (voucher: CreateVoucher) => {
  try {
    const response = await api.post<Voucher>(PATH, voucher);
    return response.data;
  } catch (error) {
    console.error('Error creating voucher:', error);
    throw error;
  }
};

export const useVoucher = async (
  userId: string = '',
  params: VoucherParams,
) => {
  try {
    const response = await api.post<Voucher>(`${PATH}/${userId}/use`, params);
    return response.data;
  } catch (error) {
    console.error('Error adding voucher:', error);
    throw error;
  }
};

export const getUsedVouchers = async (userId: string) => {
  try {
    const response = await api.get<Voucher[]>(`${PATH}/${userId}/used`);
    return response.data;
  } catch (error) {
    console.error('Error fetching used vouchers:', error);
    throw error;
  }
};
