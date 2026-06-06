import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ fullName: '', phone: '' });

  const loadCustomers = async () => {
    const response = await api.get('/customers');
    setCustomers(response.data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/customers', form);
    setForm({ fullName: '', phone: '' });
    await loadCustomers();
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Клиенты
        </Typography>
        <Typography color="text.secondary">Добавляйте клиентов и следите за бонусами.</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Новый клиент
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
                label="Телефон"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Добавить клиента
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
                    <TableCell>Телефон</TableCell>
                    <TableCell>Бонусы</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>{customer.fullName}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.bonusPoints}</TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Клиенты не найдены.
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
