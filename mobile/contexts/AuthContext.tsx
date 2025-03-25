import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextData } from '@/types/auth';
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const USER_KEY = 'user';

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
  offlineAccess: true,
  profileImageSize: 120,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function signIn(): Promise<User> {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) {
        console.log('Houve um erro na mensagem de sucesso do google');
        throw new Error('Houve um erro na mensagem de sucesso do google');
      }

      const { user: googleUser, idToken } = response.data;
      const userData: User = {
        id: googleUser?.id,
        email: googleUser?.email,
        name: googleUser?.name || '',
        picture: googleUser?.photo || '',
        givenName: googleUser?.givenName || '',
        familyName: googleUser?.familyName || '',
        token: idToken || '',
      };

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log('User cancelled login flow');
          break;
        case statusCodes.IN_PROGRESS:
          console.log('Sign in is in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play services not available');
          break;
        default:
          console.error('Erro ao salvar dados do usuário google:', error);
      }

      throw error;
    }
  }

  async function signOut() {
    try {
      await GoogleSignin.signOut();
      await SecureStore.deleteItemAsync(USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async function loadUser() {
    try {
      const savedUser = await SecureStore.getItemAsync(USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
