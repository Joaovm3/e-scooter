import { WALLET_KEY } from '@/constants/Storage';
import { StorageService } from './storage.service';
import { Wallet } from '@/types/wallet';

export const getWallet = async () => {
  const wallet = await StorageService.get<Wallet>(WALLET_KEY);
  return wallet;
};

export const setWallet = async (data: Wallet) => {
  await StorageService.set(WALLET_KEY, data);
};
