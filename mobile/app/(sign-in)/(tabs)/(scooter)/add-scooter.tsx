import { StyleSheet, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { ThemedButton } from '@/components/ThemedButton';
import { useRouter } from 'expo-router';
import * as scooterService from '@/services/scooter.service';
import { CreateScooter, Scooter, ScooterStatus } from '@/types/scooter';
import { Geolocation } from '@/types/geolocation';
import { Map } from '@/components/Map';

export default function AddScooterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [batteryLevel, setBatteryLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<Geolocation | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      console.log('Current location:', location);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    }
  };

  const handleCreateScooter = async () => {
    try {
      if (!location) {
        Alert.alert('Erro', 'Localização não disponível');
        return;
      }

      setIsLoading(true);

      const scooterData: CreateScooter = {
        name: name.trim(),
        batteryLevel: Number(batteryLevel),
        geolocation: location,
        // locked: true,
        // status: ScooterStatus.AVAILABLE,
      };
      console.log({ scooterData });
      await scooterService.createScooter(scooterData);

      Alert.alert('Sucesso', 'Patinete cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Erro ao cadastrar patinete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatteryChange = (text: string) => {
    if (!text) setBatteryLevel('');
    const batteryPercentage = parseInt(text);
    if (batteryPercentage >= 0 && batteryPercentage <= 100) {
      setBatteryLevel(text);
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Preencha os dados do novo patinete
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.form}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Nome do patinete"
          autoCapitalize="words"
          maxLength={50}
        />

        <Input
          value={batteryLevel}
          onChangeText={handleBatteryChange}
          placeholder="Nível da bateria (%)"
          keyboardType="numeric"
          maxLength={3}
        />

        {location && (
          <>
            <ThemedText style={styles.mapHelper}>
              Toque no mapa para ajustar a localização do patinete
            </ThemedText>

            <Map
              location={location}
              onLocationChange={setLocation}
              draggableMarker
              markers={[
                { batteryLevel: Number(batteryLevel), coordinate: location },
              ]}
            />
          </>
        )}
      </ThemedView>

      <ThemedButton
        title="Cadastrar patinete"
        type="primary"
        onPress={handleCreateScooter}
        disabled={!name || !batteryLevel || !location || isLoading}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  form: {
    padding: 16,
    gap: 16,
  },
  button: {
    margin: 16,
  },
  mapHelper: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
