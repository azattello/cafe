import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import api from '../api/axiosClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 6, bgcolor: '#eef2ff' }}>
      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Вход
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Войдите, чтобы управлять кафе, меню и заказами.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Электронная почта"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }} type="submit">
              Войти
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" align="center">
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: '#3f51b5', fontWeight: 600 }}>
              Зарегистрироваться
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
