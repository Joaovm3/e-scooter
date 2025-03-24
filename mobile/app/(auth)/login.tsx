import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { router } from 'expo-router';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';
import { findOrCreateUser } from '@/services/auth.service';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

  const handleGoogleSignIn = async () => {
    try {
      const user = await signIn();
      await handleBackendRequest(user);
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
          console.error('Login error:', error);
      }
    }
  };

  const handleBackendRequest = async (user: User) => {
    if (!apiUrl) {
      return console.error('Sem acesso a url da api backend');
    }

    // const apiResponse = await fetch(`${apiUrl}/auth/google`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: user.email,
    //     username: user.name,
    //     picture: user.picture,
    //     googleId: user.id,
    //     token: user.token,
    //   }),
    // });
    const data = await findOrCreateUser(user);
    // const data = await apiResponse.json();
    console.log('bateu no back', { data });

    if (data) {
      router.replace('/(tabs)');
    } else {
      throw new Error(data.message || 'Authentication failed');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          Bem vindo ao E-Scooter
        </ThemedText>

        <ThemedText type="subtitle" style={styles.subtitle}>
          Entre para começar a sua jornadas
        </ThemedText>

        <ThemedButton
          title="Autenticar com Google"
          icon="logo-google"
          type="primary"
          onPress={handleGoogleSignIn}
          style={styles.button}
          disabled={isLoading}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    // minWidth: 250,
    width: '100%',
  },
});
