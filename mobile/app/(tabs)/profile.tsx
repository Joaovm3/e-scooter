import { StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Image } from 'react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            title="Ajuda"
            icon="help-circle-outline"
            type="default"
            onPress={() => {}}
            style={styles.menuItem}
          />
        </ThemedView>

        {/* Sign Out Button */}
        <ThemedButton
          title="Sair"
          icon="log-out-outline"
          type="secondary"
          onPress={signOut}
          style={styles.signOutButton}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  menuItem: {
    width: '100%',
  },
  signOutButton: {
    marginTop: 'auto',
    backgroundColor: '#FF3B30',
  },
});
