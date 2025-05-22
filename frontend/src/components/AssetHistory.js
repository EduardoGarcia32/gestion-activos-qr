import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Chip
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AssetHistory = ({ history }) => {
    return (
        <List>
            {history.map((record, index) => (
                <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                        primary={
                            <>
                            <Chip
                            label={record.action}
                            size="samll"
                            sx={{ mr: 1 }}
                            color={
                                record.action === 'CREATED' ? 'success' :
                                record.action === 'DELETED' ? 'error' : 'primary'
                            }
                            />
                            <Typography component="span" variant="body2" color="text.secondary">
                                {format(new Date(record.timestamp), 'PPPpp', { locale: es })}
                            </Typography>
                            </>
                        }
                        secondary={
                            <>
                                <Typography component="span" variant="body2" color="text.primary">
                                     {record.user?.name || 'Sistema'}
                                </Typography>
                                    {Object.entries(record.changes || {}).map(([key, value]) => (
                                        <div key={key}>
                                            <strong>{key}:</strong> {JSON.stringify(value)}
                                        </div>
                                    ))}
                                 </>
                            }
                        />
                    </ListItem>
                        {index < history.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
             </List>
        );
    };

export default AssetHistory;
