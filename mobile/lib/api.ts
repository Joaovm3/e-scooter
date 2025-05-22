import { getUser, removeUser } from '@/storage/user.storage';
import axios, { AxiosError, isAxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const user = await getUser();
  // console.log('interceptr', { user });
  const token = user?.token || '';
  if (token) {
    // const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log('interceptor', error);

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Handle token expiration
        await removeUser();
        // adicionar logout aqui
      }

      const errorMessage = data?.message || 'Erro desconhecido';

      console.error(`Erro da API: `, data);

      return Promise.reject(new Error(errorMessage));
    }

    if (error.request) {
      console.error('Erro de conexão. Verifique sua internet.', error);
      return Promise.reject(new Error('Erro de conexão'));
    }

    // Outros erros
    console.error('Erro inesperado:', error.message);
    return Promise.reject(error);
  },
);

export { api };
