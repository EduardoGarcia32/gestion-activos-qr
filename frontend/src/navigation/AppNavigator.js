import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AssetDetailScreen from '../screens/AssetDetailScreen';
import AssetForm from '../screens/AssetForm';
import AddMaintenanceScreen from '../screens/AddMaintenanceScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Gestión de Activos' }}
      />
      <Stack.Screen 
        name="AssetDetail" 
        component={AssetDetailScreen} 
        options={{ title: 'Detalles del Activo' }}
      />
      <Stack.Screen 
        name="AssetForm" 
        component={AssetForm} 
        options={{ title: 'Nuevo Activo' }}
      />
      <Stack.Screen 
        name="AddMaintenance" 
        component={AddMaintenanceScreen} 
        options={{ title: 'Agregar Mantenimiento' }}
      />
    </Stack.Navigator>
  );
}