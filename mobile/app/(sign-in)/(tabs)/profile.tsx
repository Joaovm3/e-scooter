import { StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Image } from 'react-native';
import { router } from 'expo-router';
import { MapPinPlusIcon } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(sign-out)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* <ScrollView contentContainerStyle={styles.scrollContent}> */}
      {/* Profile Header */}
      <ThemedView style={styles.header}>
        <Image source={{ uri: user?.picture }} style={styles.avatar} />
        <ThemedText type="title" style={styles.name}>
          {user?.name}
        </ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
      </ThemedView>

      {/* Menu Items */}
      <ThemedView style={styles.menuContainer}>
        <ThemedButton
          title="Cadastrar patinetes"
          icon="person-outline"
          CustomIcon={() => <MapPinPlusIcon color="#000" size={24} />}
          type="default"
          onPress={() => {
            router.navigate({
              pathname: '/add-scooter',
              params: {
                headerTitle: 'Cadastrar patinetes',
              },
            });
          }}
          style={styles.menuItem}
        />
        <ThemedButton
          title="Meus dados"
          icon="person-outline"
          type="default"
          onPress={() => {}}
          style={styles.menuItem}
        />
        <ThemedButton
          title="Histórico"
          icon="time-outline"
          type="default"
          onPress={() => {}}
          style={styles.menuItem}
        />
        <ThemedButton
          title="Pagamentos"
          icon="card-outline"
          type="default"
          onPress={() => {}}
          style={styles.menuItem}
        />
        <ThemedButton
          title="Minha carteira"
          icon="wallet-outline"
          type="default"
          onPress={() => {
            router.navigate('/my-wallet');
          }}
          style={styles.menuItem}
        />
        <ThemedButton
          title="Meus cupons"
          icon="ticket"
          type="default"
          onPress={() => {
            router.navigate('/add-voucher');
          }}
          style={styles.menuItem}
        />
        <ThemedButton
          title="Ajuda"
          icon="help-circle-outline"
          type="default"
          onPress={() => {}}
          style={styles.menuItem}
        />
        <ThemedButton
          title="Configurações"
          icon="settings"
          type="default"
          onPress={() => {
            router.navigate('/profile');
          }}
          style={styles.menuItem}
        />
      </ThemedView>

      <ThemedButton
        title="Sair"
        icon="log-out-outline"
        type="secondary"
        onPress={handleSignOut}
        style={styles.signOutButton}
      />
      {/* </ScrollView> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    opacity: 0.7,
  },
  menuContainer: {
    gap: 8,
    marginBottom: 32,
    // backgroundColor: '#f2f2f2',
  },
  menuItem: {
    width: '100%',
  },
  signOutButton: {
    // marginTop: 'auto',
    position: 'absolute',
    bottom: 10,
    left: 0,
    width: '100%',
    backgroundColor: '#FF3B30',
  },
});
