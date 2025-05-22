import { INITIAL_RIDE_BALANCE, WALLET_KEY } from '@/constants/Storage';
import { StorageService } from './storage.service';
import { Wallet } from '@/types/wallet';

export const getWallet = async () => {
  const wallet = await StorageService.get<Wallet>(WALLET_KEY);
  return wallet;
};

export const setWallet = async (data: Wallet) => {
  await StorageService.set(WALLET_KEY, data);
};

export const getInitialRideBalance = async () => {
  const balance = await StorageService.get<number>(INITIAL_RIDE_BALANCE);
  return balance || 0;
};

export const setInitialRideBalance = async (data: number) => {
  await StorageService.set(INITIAL_RIDE_BALANCE, data);
};
