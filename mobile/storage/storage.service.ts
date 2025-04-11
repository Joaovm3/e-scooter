import * as SecureStore from 'expo-secure-store';

export class StorageService {
  static async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await SecureStore.setItemAsync(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw new Error('Failed to save data');
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await SecureStore.getItemAsync(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      throw new Error('Failed to read data');
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw new Error('Failed to remove data');
    }
  }

  static async exists(key: string): Promise<boolean> {
    const value = await SecureStore.getItemAsync(key);
    return value != null;
  }
}
