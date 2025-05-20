import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import api from '../services/api';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const QRModal = ({ open, onClose, asset }) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && asset) {
      fetchQRCode();
    }
  }, [open, asset]);

  const fetchQRCode = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/assets/${asset.assetNumber}/qr`);
      // Convertir la respuesta de imagen a URL
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrImage(imageUrl);
    } catch (error) {
      console.error('Error al obtener el QR:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Código QR - {asset?.assetNumber}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          padding: 3
        }}>
          {loading ? (
            <CircularProgress />
          ) : qrImage ? (
            <>
              <img 
                src={qrImage} 
                alt={`QR Code for ${asset?.assetNumber}`} 
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
            <Typography>No se pudo cargar el código QR</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button 
          onClick={() => {
            if (qrImage) {
              const link = document.createElement('a');
              link.href = qrImage;
              link.download = `qr-${asset?.assetNumber}.png`;
              link.click();
            }
          }}
          variant="contained"
          disabled={!qrImage}
        >
          Descargar QR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRModal;