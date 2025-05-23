import React, { useState, useMemo } from 'react';
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
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';

const AssetFilters = ({ onFilter, assetTypes }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    dateFrom: null,
    dateTo: null
  });

  // Debounce para búsqueda
  const debouncedFilter = useMemo(
    () => debounce(onFilter, 500),
    [onFilter]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Apply debounced filter only for search input
    if (name === 'search') {
      debouncedFilter(newFilters);
    }
  };

  const handleDateChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    
    // Validate date range
    if (newFilters.dateFrom && newFilters.dateTo && newFilters.dateFrom > newFilters.dateTo) {
      enqueueSnackbar('Fecha inicial no puede ser mayor a final', { variant: 'warning' });
      return;
    }
    
    setFilters(newFilters);
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
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
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
              <MenuItem value="Retirado">Retirado</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <DatePicker
              label="Desde"
              value={filters.dateFrom}
              onChange={(date) => handleDateChange('dateFrom', date)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <DatePicker
              label="Hasta"
              value={filters.dateTo}
              onChange={(date) => handleDateChange('dateTo', date)}
              renderInput={(params) => <TextField fullWidth {...params} />}
              minDate={filters.dateFrom}
            />
          </Grid>

          <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ height: '56px' }}
            >
              Filtrar
            </Button>
          </Grid>
          
          <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              onClick={handleReset} 
              fullWidth 
              sx={{ height: '56px' }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AssetFilters;