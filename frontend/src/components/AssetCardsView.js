import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    IconButton,
    CardMedia,
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { QRCodeSVG } from 'qrcode.react';

const AssetCardsView = ({ assets, onEdit }) => {
    return (
        <Grid container spacing={3}>
            {assets.map(asset => (
                <Grid item key={asset._id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardMedia sx={{ p: 2, display: 'flex', justifyContent: 'center'}}>
                            <QRCodeSVG
                              value={JSON.stringify({
                                  id: asset._id,
                                  number: asset.assetNumber
                              })}
                              size={128}
                              level="H"
                            />
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
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Chip
                                  label={
                                    asset.status === 'Disponible' ? 'Disponible' :
                                    asset.status === 'Asignado' ? 'Asignado' :
                                    asset.status === 'Mantenimiento' ? 'En Mantenimiento' : 'Retirado'
                                  }
                                  color={
                                      asset.status === 'Disponible' ? 'success' :
                                      asset.status === 'Mantenimiento' ? 'warning' : 'info'
                                  }
                                />
                                <IconButton 
                                  onClick={() => onEdit(asset)} 
                                  size="small"
                                  color="primary"
                                >
                                    <EditIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default AssetCardsView;