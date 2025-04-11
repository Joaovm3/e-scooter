import { api } from '@/lib/api';
import { CreateScooter, Scooter } from '@/types/scooter';

const PATH = '/scooter';

export const createScooter = async (params: CreateScooter) => {
  try {
    const response = await api.post<Scooter>(PATH, params);
    return response.data;
  } catch (error) {
    console.error('Error creating scooter:', error);
    throw error;
  }
};

export const getScooters = async (params?: Scooter) => {
  try {
    const response = await api.get<Scooter[]>(PATH, { params });
    return response.data;
  } catch (error) {
    console.error('Error creating scooter:', error);
    throw error;
  }
};
