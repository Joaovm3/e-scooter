import { Alert, StyleSheet, ImageBackground, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleUser } from '@/types/auth';
import { findOrCreateUser } from '@/services/auth.service';
import * as walletStorage from '@/storage/wallet.storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedIconButton } from '@/components/ThemedIconButton';
import { Radius } from 'lucide-react-native';

export default function LoginScreen() {
  const { signIn, setAndStoreUser, isLoading } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await signIn();
      await handleBackendRequest(googleUser);
    } catch (error: any) {
      Alert.alert('Houve um erro ao fazer login', error?.message || error);
      console.error(error);
    }
  };

  const handleBackendRequest = async (googleUser: GoogleUser) => {
    if (!apiUrl) {
      throw new Error('Sem acesso a url da api backend');
    }

    const userResponse = await findOrCreateUser(googleUser);

    if (!userResponse) {
      throw new Error('Authentication failed');
    }
    console.log('userResponse', userResponse);
    setAndStoreUser(userResponse);
    await walletStorage.setWallet(userResponse.wallet);

    router.replace('/(sign-in)/(home)');
  };

  const backgroundImage = require('../../assets/images/background.png');
  const iconImage = require('../../assets/images/react-logo.png');

  return (
    <SafeAreaProvider>
      <ThemedView style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <ThemedView style={styles.contentContainer}>
            <ThemedView style={styles.header}>
              <ThemedIconButton
                CustomIcon={() => <Radius style={styles.icon} size={44} />}
              />

              <ThemedText type="title" style={styles.title}>
                escooter
              </ThemedText>
            </ThemedView>

            <ThemedButton
              title="Entrar com Google"
              icon="logo-google"
              iconColor="#FFFFFF"
              type="primary"
              onPress={handleGoogleSignIn}
              style={styles.button}
              disabled={isLoading}
            />
          </ThemedView>
        </ImageBackground>
      </ThemedView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Add darker overlay
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    // width: '100%',
    // height: '100%',
  },
  header: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    // marginVertical: 50,
    marginBottom: 100,
  },
  icon: {
    width: 44,
    height: 44,
    color: '#FFFFFF',
  },
  contentContainer: {
    // flex: 1,
    // alignItems: 'center',
    // gap: 16,
    // justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: 'MuseoModerno',
    fontSize: 48,
    lineHeight: 56,
    marginBottom: 8,
    // marginTop: 30,
    textAlign: 'center',
    color: '#FFFFFF',
    // backgroundColor: 'red',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    color: '#FFFFFF',
  },
  button: {
    width: '100%',
    backgroundColor: '#1294E2',
  },
});
