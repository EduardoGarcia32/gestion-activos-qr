import React, { useState } from 'react';
import { Button, Stack, CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';

const DataTransfer = ({ assets, onImport }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    try {
      setLoading(true);
      
      // Preparar datos para exportación
      const worksheet = XLSX.utils.json_to_sheet(assets);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Activos");
      
      // Generar archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array' 
      });
      
      // Descargar archivo
      const data = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(data, 'activos.xlsx');
      
      enqueueSnackbar('Exportación exitosa', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al exportar los datos', { variant: 'error' });
      console.error('Error en exportación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        // Leer archivo Excel
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        // Validar campos mínimos requeridos
        const isValid = jsonData.every(item => item.assetNumber && item.type);
        if (!isValid) {
          throw new Error('El archivo debe contener al menos los campos "assetNumber" y "type"');
        }
        
        // Pasar datos importados al componente padre
        onImport(jsonData);
        enqueueSnackbar('Importación exitosa', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        console.error('Error en importación:', error);
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Button 
        variant="contained" 
        onClick={exportToExcel}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Exportando...' : 'Exportar a Excel'}
      </Button>
      
      <Button
        variant="outlined"
        component="label"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Importando...' : 'Importar desde Excel'}
        <input
          type="file"
          hidden
          accept=".xlsx, .xls"
          onChange={handleImport}
          disabled={loading}
        />
      </Button>
    </Stack>
  );
};

export default DataTransfer;