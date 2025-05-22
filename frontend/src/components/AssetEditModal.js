import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  MenuItem,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

function AssetForm({ onAddAsset }) {
  const [formData, setFormData] = useState({
    assetNumber: '',
    type: '',
    model: '',
    status: 'Disponible',
    assignedTo: '', // Nuevo campo
    specifications: {
      brand: '',
      serialNumber: '',
      location: '',
      description: '' // Nuevo campo
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await api.post('/assets', formData);
      onAddAsset(response.data.data);
      setFormData({
        assetNumber: '',
        type: '',
        model: '',
        status: 'Disponible',
        assignedTo: '', // Reset del nuevo campo
        specifications: {
          brand: '',
          serialNumber: '',
          location: '',
          description: '' // Reset del nuevo campo
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el activo');
      console.error('Error al crear activo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Nuevo Activo
      </Typography>
      
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

      {/* Nuevo campo - Asignado a */}
      <TextField
        label="Asignado a"
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        fullWidth
        margin="normal"
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

      {/* Nuevo campo - Descripción */}
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

      <Button 
        type="submit" 
        variant="contained" 
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Agregar Activo'}
      </Button>
    </Box>
  );
}

export default AssetForm;