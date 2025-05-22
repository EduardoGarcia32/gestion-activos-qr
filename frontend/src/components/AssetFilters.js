import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button,
  Grid,
  InputAdornment
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import { Gird } from '@mui/icons-material';

const AssetFilters = ({ onFilter, assetTypes }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status:'',
    dateFrom: null,
    dateTo: null
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value}));
};

const handleDateChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value}));
};

const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
};

const handleReset = () => {
    setFilters({
        search: '',
        type: '',
        status: '',
        dateFrom: null,
        dateTo: null
    });
    onFilter({});
}

return(
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4}}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <TextField
                fullWidth
                label="Buscar"
                name="search"
                value={filters.search}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                />
            </Grid>
            <Grid item xs={6} md={2}>
                <TextField
                select
                fullWidth
                label="Tipo"
                name="type"
                value={filters.type}
                onChange={handleChange}
                >
                    <MenuItem value="">Todos</MenuItem>
                    {assetTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
                <TextField
                select
                fullWidth
                label="Estado"
                name="status"
                value={filters.status}
                onChange={handleChange}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Disponible">Disponible</MenuItem>
                    <MenuItem value="Asignado">Asignado</MenuItem>
                    <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
                <DatePicker
                label="Desde"
                value={filters.dateFrom}
                onChange={(date) => handleDateChange('dateFrom', date)}
                renderInput={(params) => <TextField fullWidth {...params}/>}
                />
            </Grid>
            <Grid item xs={6} md={2}>
                <DatePicker
                label="Hasta"
                value={filters.dateTo}
                onChange={(date) => handleDateChange('dateTo', date)}
                renderInput={(params) => <TextField fullWidth {...params} />}
                />
            </Grid>

            <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button type="submit" variant="contained" fullWidth sx={{ height: '56px' }}>
            Filtrar
          </Button>
        </Grid>
        <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button onClick={handleReset} fullWidth sx={{ height: '56px' }}>
            Limpiar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetFilters;