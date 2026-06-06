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

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ productName: '', quantity: '', unit: 'шт', minimumQuantity: '' });

  const loadInventory = async () => {
    const response = await api.get('/inventory');
    setItems(response.data);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/inventory', {
      productName: form.productName,
      quantity: Number(form.quantity),
      unit: form.unit,
      minimumQuantity: Number(form.minimumQuantity),
    });
    setForm({ productName: '', quantity: '', unit: 'шт', minimumQuantity: '' });
    await loadInventory();
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Склад
        </Typography>
        <Typography color="text.secondary">Следите за запасами продуктов и минимальными остатками.</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Добавить продукт
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Название продукта"
                value={form.productName}
                onChange={(e) => setForm((prev) => ({ ...prev, productName: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Количество"
                type="number"
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Единица"
                value={form.unit}
                onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Минимальный запас"
                type="number"
                value={form.minimumQuantity}
                onChange={(e) => setForm((prev) => ({ ...prev, minimumQuantity: e.target.value }))}
                margin="normal"
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Добавить на склад
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
                    <TableCell>Название</TableCell>
                    <TableCell>Количество</TableCell>
                    <TableCell>Единица</TableCell>
                    <TableCell>Мин. запас</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.minimumQuantity}</TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Записи склада отсутствуют.
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
