import { USER_KEY } from '@/constants/Storage';
import { StorageService } from './storage.service';
import { User } from '@/types/auth';

export const getUser = async () => {
  const user = await StorageService.get<User>(USER_KEY);
  return user;
};

export const storeUser = async (data: User) => {
  await StorageService.set(USER_KEY, data);
};

export const removeUser = async () => {
  await StorageService.remove(USER_KEY);
};

export const userExists = async () => {
  const exists = await StorageService.exists(USER_KEY);
  return exists;
};

export const clearUser = async () => {
  await StorageService.remove(USER_KEY);
};
