import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../services/api';

const QRModal = ({ open, onClose, asset }) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && asset) {
      fetchQRCode();
    } else {
      // Resetear estado cuando se cierra el modal
      setQrImage(null);
      setLoading(true);
      setError('');
    }
  }, [open, asset]);

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      // IMPORTANTE: Usar responseType: 'blob' para imágenes
      const response = await api.get(`/assets/${asset.assetNumber}/qr`, {
        responseType: 'blob'
      });

      // Crear URL para la imagen blob
      const imageUrl = URL.createObjectURL(response.data);
      setQrImage(imageUrl);
    } catch (err) {
      console.error('Error al obtener QR:', err);
      setError('No se pudo cargar el código QR');
      if (err.response?.status === 401) {
        setError('No autorizado - Por favor inicie sesión nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrImage) {
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = `qr-${asset.assetNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Código QR - {asset?.assetNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          padding: 3,
          minHeight: '300px',
          justifyContent: 'center'
        }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : qrImage ? (
            <>
              <img 
                src={qrImage} 
                alt={`QR Code for ${asset.assetNumber}`} 
                style={{ 
                  width: '100%', 
                  maxWidth: '300px', 
                  height: 'auto',
                  marginBottom: '20px'
                }} 
              />
              <Typography variant="body2" color="text.secondary">
                Escanea este código para ver los detalles del activo
              </Typography>
            </>
          ) : (
            <Typography>No se pudo generar el código QR</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button 
          onClick={handleDownload}
          variant="contained"
          disabled={!qrImage || loading}
        >
          Descargar QR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRModal;