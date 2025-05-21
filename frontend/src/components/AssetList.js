import { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, 
  MenuItem, Box, Typography, IconButton,
  Tooltip, CircularProgress
} from '@mui/material';
import { Edit, Delete, QrCode } from '@mui/icons-material';
import QRModal from './QRModal';
import AssetEditModal from './AssetEditModal';
import api from '../services/api';

function AssetList({ assets, refreshAssets }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      asset.status.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (assetId) => {
    if (!window.confirm('¿Estás seguro de eliminar este activo?')) return;
    
    setDeleteLoadingId(assetId);
    try {
      await api.delete(`/assets/${assetId}`);
      refreshAssets();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el activo');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar activos"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <TextField
          select
          label="Filtrar por estado"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Disponible">Disponible</MenuItem>
          <MenuItem value="Asignado">Asignado</MenuItem>
          <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
          <MenuItem value="Retirado">Retirado</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset._id}>
                <TableCell>{asset.assetNumber}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell>{asset.status}</TableCell>
                <TableCell>
                  <Tooltip title="Ver QR">
                    <IconButton onClick={() => {
                      setSelectedAsset(asset);
                      setQrModalOpen(true);
                    }}>
                      <QrCode />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Editar">
                    <IconButton onClick={() => {
                      setSelectedAsset(asset);
                      setEditModalOpen(true);
                    }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar">
                    <IconButton 
                      onClick={() => handleDelete(asset._id)}
                      disabled={deleteLoadingId === asset._id}
                    >
                      {deleteLoadingId === asset._id ? 
                        <CircularProgress size={24} /> : <Delete />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAssets.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          No se encontraron activos
        </Typography>
      )}

      <QRModal 
        open={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        asset={selectedAsset} 
      />
      
      <AssetEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        asset={selectedAsset}
        onUpdate={refreshAssets}
      />
    </Box>
  );
}

export default AssetList;