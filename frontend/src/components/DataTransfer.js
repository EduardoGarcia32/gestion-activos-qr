import React from 'react';
import { Button, Stack } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DataTransfer = ({ assets, onImport }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(assets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activos");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'activos.xlsx');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      onImport(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Button 
        variant="contained" 
        onClick={exportToExcel}
      >
        Exportar a Excel
      </Button>
      <Button
        variant="outlined"
        component="label"
      >
        Importar desde Excel
        <input
          type="file"
          hidden
          accept=".xlsx, .xls"
          onChange={handleImport}
        />
      </Button>
    </Stack>
  );
};

export default DataTransfer;