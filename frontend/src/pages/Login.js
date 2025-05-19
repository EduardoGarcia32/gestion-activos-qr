import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box,
  Paper
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Error en el servidor';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'No se pudo conectar al servidor. Verifica:';
        errorMessage += '\n1. Que el backend esté corriendo';
        errorMessage += '\n2. Que la URL sea correcta';
        errorMessage += '\n3. Que no haya problemas de red';
      } else if (err.response) {
        errorMessage = err.response.data.message || 'Credenciales incorrectas';
      }
      
      setError(errorMessage);
      console.error('Detalles del error:', {
        code: err.code,
        message: err.message,
        config: err.config
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Gestión de Activos
        </Typography>
        <Typography variant="h6" component="h2" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <Typography color="error" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Typography>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;