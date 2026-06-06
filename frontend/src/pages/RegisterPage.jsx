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
  MenuItem,
  Alert,
} from '@mui/material';
import api from '../api/axiosClient';

const roles = [
  { value: 'waiter', label: 'Официант' },
  { value: 'cashier', label: 'Кассир' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'admin', label: 'Администратор' },
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('waiter');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/auth/register', { fullName, email, password, role });
      setSuccess('Регистрация успешна! Перенаправляю...');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => navigate('/'), 1300);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 6, bgcolor: '#eef2ff' }}>
      <Card sx={{ width: '100%', maxWidth: 500, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Регистрация
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Создайте профиль сотрудника кафе и начните работу.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="ФИО"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              margin="normal"
              required
            />
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
            <TextField
              fullWidth
              select
              label="Роль"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              margin="normal"
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }} type="submit">
              Зарегистрироваться
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" align="center">
            Уже есть аккаунт?{' '}
            <Link to="/login" style={{ color: '#3f51b5', fontWeight: 600 }}>
              Войти
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
