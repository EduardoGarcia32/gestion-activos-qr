import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function MaintenanceList({ maintenance }) {
  return (
    <View style={styles.container}>
      {maintenance.length === 0 ? (
        <Text style={styles.emptyText}>No hay mantenimientos registrados</Text>
      ) : (
        <FlatList
          data={maintenance}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.technician}>Técnico: {item.technician}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  date: {
    fontWeight: 'bold',
  },
  technician: {
    fontStyle: 'italic',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  }
});