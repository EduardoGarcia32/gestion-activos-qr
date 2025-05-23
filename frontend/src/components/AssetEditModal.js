import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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

const validationSchema = Yup.object().shape({
  assetNumber: Yup.string().required('Requerido'),
  type: Yup.string().required('Requerido'),
  model: Yup.string().required('Requerido'),
  status: Yup.string().required('Requerido'),
  assignedTo: Yup.string(),
  specifications: Yup.object().shape({
    brand: Yup.string(),
    serialNumber: Yup.string(),
    location: Yup.string(),
    description: Yup.string()
  })
});

function AssetEditModal({ open, onClose, asset, onUpdate }) {
  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await api.put(`/assets/${asset._id}`, values);
        onUpdate();
        onClose();
      } catch (err) {
        setStatus(err.response?.data?.message || 'Error al actualizar el activo');
        console.error('Error al actualizar activo:', err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (asset) {
      formik.setValues({
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Activo</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          {formik.status && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formik.status}
            </Alert>
          )}

          <TextField
            label="Número de Activo"
            name="assetNumber"
            value={formik.values.assetNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.assetNumber && Boolean(formik.errors.assetNumber)}
            helperText={formik.touched.assetNumber && formik.errors.assetNumber}
            required
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Tipo"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
            required
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Modelo"
            name="model"
            value={formik.values.model}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.model && Boolean(formik.errors.model)}
            helperText={formik.touched.model && formik.errors.model}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Asignado a"
            name="assignedTo"
            value={formik.values.assignedTo}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            placeholder="Nombre del responsable"
          />

          <TextField
            select
            label="Estado"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
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
            name="specifications.brand"
            value={formik.values.specifications.brand}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Número de Serie"
            name="specifications.serialNumber"
            value={formik.values.specifications.serialNumber}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Ubicación"
            name="specifications.location"
            value={formik.values.specifications.location}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Descripción"
            name="specifications.description"
            value={formik.values.specifications.description}
            onChange={formik.handleChange}
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
          onClick={formik.handleSubmit}
          variant="contained" 
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <CircularProgress size={24} /> : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssetEditModal;