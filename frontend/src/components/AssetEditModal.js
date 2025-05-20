import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const AssetEditModal = ({ asset, open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    assetNumber: '',
    type: '',
    model: '',
    status: 'Disponible'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del activo cuando se abre el modal
  useEffect(() => {
    if (asset) {
      setFormData({
        assetNumber: asset.assetNumber,
        type: asset.type,
        model: asset.model,
        status: asset.status
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/assets/${asset._id}`, formData);
      onUpdate(response.data.data); // Actualizar lista
      onClose(); // Cerrar modal
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el activo');
      console.error('Error al actualizar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Activo {asset?.assetNumber}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Número de Activo"
            name="assetNumber"
            value={formData.assetNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
          >
            {['Disponible', 'Asignado', 'Mantenimiento', 'Retirado'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssetEditModal;