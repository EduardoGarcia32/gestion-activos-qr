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
import { QRCodeSVG } from 'qrcode.react'; // Usar solo esta importación
import { Edit } from "@mui/icons-material";

const AssetCardsView = ({ assets, onEdit }) => {
    return (
        <Grid container spacing={3}>
            {assets.map(asset => (
                <Grid item key={asset._id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardMedia sx={{ p: 2, display: 'flex', justifyContent: 'center'}}>
                            <QRCodeSVG
                            value={JSON.stringify({
                                ide: asset._id,
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
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between'}}>
                                <Chip
                                label={asset.status}
                                color={
                                    asset.status === 'Disponible' ? 'success':
                                    asset.status === 'Mantenimiento' ? 'warning' : 'info'
                                }
                                />
                                <IconButton onClick={() => onEdit(asset)} size="small">
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