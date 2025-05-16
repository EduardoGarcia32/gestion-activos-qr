import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function AssetList({ assets }) {
    return (
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Número</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset._id}>
              <TableCell>{asset.assetNumber}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.model}</TableCell>
              <TableCell>{asset.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AssetList;