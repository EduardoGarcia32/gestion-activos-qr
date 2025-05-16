import { useState } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import api from '../services/api';

function AssetForm({ onAddAsset }) {
  const [formData, setFormData] = useState({
    assetNumber: '',
    type: '',
    model: '',
    status: 'Disponible'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/assets', formData);
      onAddAsset(response.data.data);
      setFormData({
        assetNumber: '',
        type: '',
        model: '',
        status: 'Disponible'
      });
    } catch (error) {
      console.error('Error al crear activo:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Agregar Activo
      </Button>
    </Box>
  );
}

export default AssetForm;