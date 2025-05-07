import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import QRScanner from '../components/QRScanner';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <QRScanner navigation={navigation} />
      <View style={styles.buttonContainer}>
        <Button 
          title="Agregar Activo Manualmente"
          onPress={() => navigation.navigate('AssetForm')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    margin: 20
  }
});