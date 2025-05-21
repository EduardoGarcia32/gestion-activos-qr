import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import AssetList from '../components/AssetList';
import AssetForm from '../components/AssetForm';
import api from '../services/api';

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar/actualizar los activos
  const refreshAssets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/assets');
      setAssets(response.data.data);
    } catch (err) {
      setError('Error al cargar los activos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    refreshAssets();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Activos
      </Typography>
      
      {error && (
        <Typography color="error" paragraph>
          {error}
        </Typography>
      )}

      <Box sx={{ mb: 4 }}>
        <AssetForm onAddAsset={refreshAssets} />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <AssetList 
          assets={assets} 
          refreshAssets={refreshAssets} 
        />
      )}
    </Container>
  );
};

export default Dashboard;