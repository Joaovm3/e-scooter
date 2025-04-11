import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
  Camera,
} from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, Button, View, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedIconButton } from '@/components/ThemedIconButton';
import { ScannerFrame } from '@/components/ScannerFrame';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState(false);
  const qrCodeLock = useRef(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (!permission) {
      console.log('nao tem permissao');
      return <View />;
    }

    if (!permission.granted) {
      Alert.alert(
        'Permissão da Câmera',
        'Precisamos da sua permissão para acessar a câmera',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => router.back() },
          {
            text: 'Permitir',
            style: 'default',
            onPress: async () => {
              const { granted } = await requestPermission();
              if (!granted) {
                Alert.alert(
                  'Permissão Necessária',
                  'Você precisa permitir o acesso à câmera para escanear QR Codes',
                  [{ text: 'OK', onPress: () => router.back() }],
                );
              }
            },
          },
        ],
      );
      return <View />;
    }
  };

  const toggleFlash = () => {
    setFlashMode(!flashMode);
    // setFlashMode(
    //   flashMode === Camera.Constants.FlashMode.off
    //     ? Camera.Constants.FlashMode.torch
    //     : Camera.Constants.FlashMode.off,
    // );
  };

  const handleManualInput = () => {
    // router.push('/manual-input');
  };

  const handleBack = () => {
    router.back();
  };

  function handleQRCodeRead(data: BarcodeScanningResult) {
    if (data && qrCodeLock.current) {
      return;
    }

    try {
      qrCodeLock.current = true;
      // Handle QR code data
      console.log('QR Code:', data);
    } catch (error) {
      console.error('Error reading QR code:', error);
    } finally {
      setTimeout(() => {
        qrCodeLock.current = false;
      }, 2000);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={flashMode}
        onBarcodeScanned={handleQRCodeRead}
      >
        <ScannerFrame />
        <ThemedText style={styles.hint}>
          Posicione o QR Code no centro da tela
        </ThemedText>
        <ThemedView style={styles.buttonContainer}>
          <ThemedIconButton
            type="action"
            icon="arrow-back"
            onPress={handleBack}
          />
          <ThemedIconButton
            type="action"
            icon="keypad"
            onPress={handleManualInput}
            style={styles.actionButton}
          />
          <ThemedIconButton
            type="action"
            icon={flashMode ? 'flash' : 'flash-off'}
            onPress={toggleFlash}
            style={styles.actionButton}
          />
        </ThemedView>
      </CameraView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 32,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    // margin: 8,
  },
  hint: {
    position: 'absolute',
    top: '28%',
    // flex: 1,
    // alignContent: 'center',
    // alignItems: 'center',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
