import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import api from '../api/axiosClient';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [menuItemId, setMenuItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);

  const loadData = async () => {
    const [ordersRes, menuRes, customersRes] = await Promise.all([
      api.get('/orders'),
      api.get('/menu'),
      api.get('/customers'),
    ]);
    setOrders(ordersRes.data);
    setMenu(menuRes.data);
    setCustomers(customersRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedItem = menu.find((item) => item._id === menuItemId);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const addItem = () => {
    if (!selectedItem || quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((item) => item._id === selectedItem._id);
      if (existing) {
        return prev.map((item) =>
          item._id === selectedItem._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...selectedItem, quantity }];
    });
    setMenuItemId('');
    setQuantity(1);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();
    if (items.length === 0) return;
    await api.post('/orders', {
      customer: customerId || null,
      items: items.map((item) => ({ menuItem: item._id, quantity: item.quantity })),
      totalPrice,
    });
    setItems([]);
    setCustomerId('');
    await loadData();
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Заказы
        </Typography>
        <Typography color="text.secondary">
          Просматривайте текущие заказы и создавайте новые продажи в пару кликов.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Новый заказ
              </Typography>
              <Box component="form" onSubmit={handleCreateOrder}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="customer-label">Клиент</InputLabel>
                  <Select
                    labelId="customer-label"
                    value={customerId}
                    label="Клиент"
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    <MenuItem value="">Гость</MenuItem>
                    {customers.map((customer) => (
                      <MenuItem key={customer._id} value={customer._id}>
                        {customer.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <FormControl fullWidth>
                      <InputLabel id="menu-label">Позиция</InputLabel>
                      <Select
                        labelId="menu-label"
                        value={menuItemId}
                        label="Позиция"
                        onChange={(e) => setMenuItemId(e.target.value)}
                      >
                        {menu.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                              {item.name} — {Number(item.price).toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Кол-во"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={addItem} disabled={!selectedItem || quantity < 1}>
                  Добавить в заказ
                </Button>

                {items.length > 0 && (
                  <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Состав заказа
                    </Typography>
                    <Stack spacing={1}>
                      {items.map((item) => (
                        <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                          <Typography>{item.name} × {item.quantity}</Typography>
                          <Button size="small" color="error" onClick={() => removeItem(item._id)}>
                            Удалить
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                    <Typography sx={{ mt: 2 }} variant="subtitle2">
                      Итого: {Number(totalPrice).toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}
                    </Typography>
                  </Paper>
                )}

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={items.length === 0}>
                  Создать заказ
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Активные заказы
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Клиент</TableCell>
                      <TableCell>Сумма</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Дата</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order.customer?.fullName || 'Гость'}</TableCell>
                        <TableCell>{Number(order.totalPrice).toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}</TableCell>
                        <TableCell>
                          <Chip label={order.status} color="primary" size="small" />
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Нет заказов для отображения.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
