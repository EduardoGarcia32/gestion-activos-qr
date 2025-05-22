import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../services/api';

function AssetEditModal({ open, onClose, asset, onUpdate }) {
  const [formData, setFormData] = useState({
    assetNumber: '',
    type: '',
    model: '',
    status: 'Disponible',
    assignedTo: '',
    specifications: {
      brand: '',
      serialNumber: '',
      location: '',
      description: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (asset) {
      setFormData({
        assetNumber: asset.assetNumber,
        type: asset.type,
        model: asset.model,
        status: asset.status,
        assignedTo: asset.assignedTo || '',
        specifications: {
          brand: asset.specifications?.brand || '',
          serialNumber: asset.specifications?.serialNumber || '',
          location: asset.specifications?.location || '',
          description: asset.specifications?.description || ''
        }
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/assets/${asset._id}`, formData);
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el activo');
      console.error('Error al actualizar activo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Activo</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Número de Activo"
            name="assetNumber"
            value={formData.assetNumber}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Tipo"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Modelo"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Asignado a"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Nombre del responsable"
          />

          <TextField
            select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Disponible">Disponible</MenuItem>
            <MenuItem value="Asignado">Asignado</MenuItem>
            <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
            <MenuItem value="Retirado">Retirado</MenuItem>
          </TextField>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Especificaciones
          </Typography>
          
          <TextField
            label="Marca"
            name="brand"
            value={formData.specifications.brand}
            onChange={handleSpecChange}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Número de Serie"
            name="serialNumber"
            value={formData.specifications.serialNumber}
            onChange={handleSpecChange}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Ubicación"
            name="location"
            value={formData.specifications.location}
            onChange={handleSpecChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Descripción"
            name="description"
            value={formData.specifications.description}
            onChange={handleSpecChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssetEditModal;