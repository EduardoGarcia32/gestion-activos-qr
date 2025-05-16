import { useState, useEffect } from 'react';
import api from '../services/api';
import AssetList from '../components/AssetList';
import AssetForm from '../components/AssetForm';

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets');
        setAssets(response.data.data);
      } catch (error) {
        console.error('Error al cargar activos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleAddAsset = (newAsset) => {
    setAssets([...assets, newAsset]);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Gestión de Activos</h1>
      <AssetForm onAddAsset={handleAddAsset} />
      <AssetList assets={assets} />
    </div>
  );
}

export default Dashboard;