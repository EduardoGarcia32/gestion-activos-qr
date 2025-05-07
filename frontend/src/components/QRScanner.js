import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { getAsset } from '../services/api';

export default function QRScanner({ navigation }) {
  const [scanned, setScanned] = useState(false);

  const handleQRScan = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      try {
        const response = await getAsset(data);
        navigation.navigate('AssetDetail', { asset: response.data });
      } catch (error) {
        alert('Activo no encontrado');
      } finally {
        setScanned(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={handleQRScan}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Escanear código QR del activo</Text>
        </View>
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  }
});