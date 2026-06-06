import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import api from '../api/axiosClient';

const roles = [
  { value: 'admin', label: 'Администратор' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'waiter', label: 'Официант' },
  { value: 'cashier', label: 'Кассир' },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ fullName: '', position: '', phone: '', login: '', password: '', role: 'waiter' });

  const loadEmployees = async () => {
    const response = await api.get('/employees');
    setEmployees(response.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/employees', {
      fullName: form.fullName,
      position: form.position,
      phone: form.phone,
      login: form.login,
      password: form.password,
      role: form.role,
    });
    setForm({ fullName: '', position: '', phone: '', login: '', password: '', role: 'waiter' });
    await loadEmployees();
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Сотрудники
        </Typography>
        <Typography color="text.secondary">Добавляйте сотрудников и назначайте рабочие роли.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Новый сотрудник
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="ФИО"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Должность"
                value={form.position}
                onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Телефон"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Логин"
                value={form.login}
                onChange={(e) => setForm((prev) => ({ ...prev, login: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label="Роль"
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                margin="normal"
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
                Создать сотрудника
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ФИО</TableCell>
                    <TableCell>Должность</TableCell>
                    <TableCell>Телефон</TableCell>
                    <TableCell>Роль</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>{employee.fullName}</TableCell>
                      <TableCell>{employee.position || '-'}</TableCell>
                      <TableCell>{employee.phone || '-'}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                    </TableRow>
                  ))}
                  {employees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Сотрудники не найдены.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
