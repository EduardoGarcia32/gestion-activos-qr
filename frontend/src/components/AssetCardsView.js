import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    IconButton,
    CardMedia,
    Box,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { QRCodeSVG } from 'qrcode.react';

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

const AssetCardsView = ({ assets, onEdit }) => {
    return (
        <Grid container spacing={3}>
            {assets.map(asset => {
                const { label, color } = getStatusConfig(asset.status);
                
                return (
                    <Grid item key={asset._id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                <Tooltip title={`ID: ${asset.assetNumber}`}>
                                    <QRCodeSVG
                                        value={`mi-app-activos://activos/detalle/${asset._id}`}
                                        size={128}
                                        level="H"
                                        onError={(e) => console.error('Error generando QR:', e)}
                                    />
                                </Tooltip>
                            </CardMedia>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {asset.assetNumber}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {asset.type} - {asset.model}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Asignado a:</strong> {asset.assignedTo || 'No asignado'}
                                </Typography>
                                <Box sx={{ 
                                    mt: 1, 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center' 
                                }}>
                                    <Chip label={label} color={color} />
                                    <Tooltip title="Editar">
                                        <IconButton 
                                            onClick={() => onEdit(asset)} 
                                            size="small"
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default React.memo(AssetCardsView);