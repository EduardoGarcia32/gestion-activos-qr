import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createAsset } from '../services/api';

export default function AssetForm({ navigation }) {
  const [assetNumber, setAssetNumber] = useState('');
  const [type, setType] = useState('');
  const [model, setModel] = useState('');

  const handleSubmit = async () => {
    if (!assetNumber || !type || !model) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await createAsset({ assetNumber, type, model });
      Alert.alert('Éxito', 'Activo creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Error al crear el activo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Número de Activo</Text>
      <TextInput
        style={styles.input}
        value={assetNumber}
        onChangeText={setAssetNumber}
        placeholder="Ej: IT-001"
      />

      <Text style={styles.label}>Tipo</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Ej: Laptop, Desktop"
      />

      <Text style={styles.label}>Modelo</Text>
      <TextInput
        style={styles.input}
        value={model}
        onChangeText={setModel}
        placeholder="Ej: Dell XPS 15"
      />

      <Button title="Guardar Activo" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  }
});