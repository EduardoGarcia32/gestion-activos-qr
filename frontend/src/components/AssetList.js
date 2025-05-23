import { useState } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Typography, 
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, QrCode } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import QRModal from './QRModal';
import AssetEditModal from './AssetEditModal';
import api from '../services/api';

// Función helper para estados
const getStatusConfig = (status) => {
  const config = {
    Disponible: { label: 'Disponible', color: 'success' },
    Asignado: { label: 'Asignado', color: 'info' },
    Mantenimiento: { label: 'En Mantenimiento', color: 'warning' },
    Retirado: { label: 'Retirado', color: 'error' }
  };
  return config[status] || { label: status, color: 'default' };
};

function AssetList({ assets, refreshAssets }) {
  const { enqueueSnackbar } = useSnackbar();
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
      enqueueSnackbar('Activo eliminado correctamente', { 
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
      refreshAssets();
    } catch (error) {
      console.error('Error al eliminar:', error);
      enqueueSnackbar('Error al eliminar el activo', { 
        variant: 'error',
        autoHideDuration: 4000
      });
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const columns = [
    { 
      field: 'assetNumber', 
      headerName: 'Número', 
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: 'type', 
      headerName: 'Tipo', 
      width: 120 
    },
    { 
      field: 'model', 
      headerName: 'Modelo', 
      width: 150 
    },
    { 
      field: 'assignedTo', 
      headerName: 'Asignado a', 
      width: 180,
      renderCell: (params) => params.value || 'No asignado'
    },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 160,
      renderCell: (params) => {
        const { label, color } = getStatusConfig(params.value);
        return <Chip label={label} color={color} />;
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Ver QR">
            <IconButton onClick={() => {
              setSelectedAsset(params.row);
              setQrModalOpen(true);
            }}>
              <QrCode />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Editar">
            <IconButton onClick={() => {
              setSelectedAsset(params.row);
              setEditModalOpen(true);
            }}>
              <Edit />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar">
            <IconButton 
              onClick={() => handleDelete(params.row._id)}
              disabled={deleteLoadingId === params.row._id}
            >
              {deleteLoadingId === params.row._id ? 
                <CircularProgress size={24} /> : <Delete />}
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Box sx={{ mt: 4, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Lista de Activos
      </Typography>
      
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

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredAssets}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          getRowId={(row) => row._id}
          localeText={{
            noRowsLabel: 'No se encontraron activos',
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} activos seleccionados`
                : `${count.toLocaleString()} activo seleccionado`,
          }}
        />
      </Box>

      <QRModal 
        open={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        asset={selectedAsset} 
      />
      
      <AssetEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        asset={selectedAsset}
        onUpdate={() => {
          refreshAssets();
          enqueueSnackbar('Activo actualizado correctamente', { variant: 'success' });
        }}
      />
    </Box>
  );
}

export default AssetList;