import { useState, useEffect } from 'react';
import { 
  Container, Typography, CircularProgress, Box,
  ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import AssetList from '../components/AssetList';
import AssetCardsView from '../components/AssetCardsView';
import AssetForm from '../components/AssetForm';
import AssetFilters from '../components/AssetFilters';
import AssetSkeleton from '../components/AssetSkeleton';
import DataTransfer from '../components/DataTransfer';
import AssetEditModal from '../components/AssetEditModal';
import api from '../services/api';

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [filterParams, setFilterParams] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const refreshAssets = async () => {
    try {
      setLoading(true);
      setError('');
      const query = new URLSearchParams(filterParams).toString();
      const response = await api.get(`/assets?${query}`);
      setAssets(response.data.data);
      setFilteredAssets(response.data.data);
    } catch (err) {
      setError('Error al cargar los activos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAssets();
  }, [filterParams]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Activos
        </Typography>
        
        {error && (
          <Typography color="error" paragraph>
            {error}
          </Typography>
        )}

        <DataTransfer assets={filteredAssets} onImport={refreshAssets} />

        <AssetFilters 
          onFilter={setFilterParams}
          assetTypes={['Laptop', 'Desktop', 'Monitor', 'Impresora', 'Router']}
        />

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => setViewMode(newMode)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="table">Tabla</ToggleButton>
          <ToggleButton value="cards">Tarjetas</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ mb: 4 }}>
          <AssetForm onAddAsset={refreshAssets} />
        </Box>

        {loading ? (
          <AssetSkeleton />
        ) : viewMode === 'table' ? (
          <AssetList 
            assets={filteredAssets} 
            refreshAssets={refreshAssets} 
          />
        ) : (
          <AssetCardsView 
            assets={filteredAssets}
            onEdit={(asset) => {
              setSelectedAsset(asset);
              setEditModalOpen(true);
            }}
          />
        )}

        <AssetEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          asset={selectedAsset}
          onUpdate={refreshAssets}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;