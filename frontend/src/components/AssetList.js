import { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, 
  MenuItem, Box, Typography, Button, IconButton
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QRModal from './QRModal'; // Crearemos este componente después

function AssetList({ assets }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

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

  const handleOpenQR = (asset) => {
    setSelectedAsset(asset);
    setQrModalOpen(true);
  };

  return (
    <Box sx={{ mt: 4 }}>
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
                  <IconButton 
                    onClick={() => handleOpenQR(asset)}
                    color="primary"
                    aria-label="Ver QR"
                  >
                    <QrCodeIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAssets.length === 0 && (
        <Typography sx={{ mt: 2 }}>No se encontraron activos</Typography>
      )}

      {/* Modal para mostrar el QR */}
      <QRModal 
        open={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        asset={selectedAsset} 
      />
    </Box>
  );
}

export default AssetList;