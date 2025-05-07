import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addMaintenance } from '../services/api';

export default function AddMaintenanceScreen({ route, navigation }) {
  const { assetNumber } = route.params;
  const [description, setDescription] = useState('');
  const [technician, setTechnician] = useState('');

  const handleSubmit = async () => {
    if (!description || !technician) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await addMaintenance(assetNumber, { description, technician });
      Alert.alert('Éxito', 'Mantenimiento agregado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Error al agregar mantenimiento');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Mantenimiento a: {assetNumber}</Text>

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ej: Cambio de teclado"
        multiline
      />

      <Text style={styles.label}>Técnico</Text>
      <TextInput
        style={styles.input}
        value={technician}
        onChangeText={setTechnician}
        placeholder="Nombre del técnico"
      />

      <Button title="Guardar Mantenimiento" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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