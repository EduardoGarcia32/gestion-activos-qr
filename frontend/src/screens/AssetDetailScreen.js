import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { getAsset } from '../services/api';
import MaintenanceList from '../components/MaintenanceList';

export default function AssetDetailScreen({ route, navigation }) {
  const { asset } = route.params;
  const [assetData, setAssetData] = useState(asset);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await getAsset(asset.assetNumber);
        setAssetData(response.data);
      } catch (error) {
        console.error('Error al cargar el activo:', error);
      }
    };

    fetchAsset();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activo: {assetData.assetNumber}</Text>
      <Text>Tipo: {assetData.type}</Text>
      <Text>Modelo: {assetData.model}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mantenimientos</Text>
        <MaintenanceList maintenance={assetData.maintenance} />
        <Button
          title="Agregar Mantenimiento"
          onPress={() => navigation.navigate('AddMaintenance', { 
            assetNumber: assetData.assetNumber 
          })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});