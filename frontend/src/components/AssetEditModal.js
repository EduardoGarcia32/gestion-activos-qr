import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import api from '../services/api';

const AssetEditModal = ({ asset, open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    assetNumber: '',
    type: '',
    model: '',
    status: 'Disponible',
    specifications: {
      brand: '',
      serialNumber: '',
      location: ''
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
        specifications: {
          brand: asset.specifications?.brand || '',
          serialNumber: asset.specifications?.serialNumber || '',
          location: asset.specifications?.location || ''
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
      console.error('Error al actualizar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Activo {asset?.assetNumber}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
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
            fullWidth
            margin="normal"
            required
            disabled
          />

          <TextField
            label="Tipo"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Modelo"
            name="model"
            value={formData.model}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {['Disponible', 'Asignado', 'Mantenimiento', 'Retirado'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssetEditModal;