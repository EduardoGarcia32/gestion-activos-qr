import axios from 'axios';

const api = axios.create({
  baseURL: 'http://[TU_IP_LOCAL]:5000/api', // Reemplaza con tu IP
  timeout: 10000,
});

export const getAsset = (assetNumber) => api.get(`/assets/${assetNumber}`);
export const createAsset = (assetData) => api.post('/assets', assetData);
export const addMaintenance = (assetNumber, maintenanceData) => 
  api.post(`/assets/${assetNumber}/maintenance`, maintenanceData);