import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from '@mui/material';
import api from '../api/axiosClient';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/menu'), api.get('/customers')])
      .then(([ordersRes, menuRes, customersRes]) => {
        setOrders(ordersRes.data);
        setMenuItems(menuRes.data);
        setCustomers(customersRes.data);
      })
      .catch(() => {});
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0),
    [orders]
  );

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter((order) => new Date(order.createdAt).toDateString() === today).length;
  }, [orders]);

  const topItems = useMemo(() => {
    const counts = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const menuItem = item.menuItem;
        if (!menuItem) return;
        counts[menuItem.name] = (counts[menuItem.name] || 0) + item.quantity;
      });
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [orders]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Панель администратора
        </Typography>
        <Typography color="text.secondary">
          Управляйте меню, заказами, запасами и аналитикой в одном месте.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Заказы всего
              </Typography>
              <Typography variant="h4">{orders.length}</Typography>
              <Typography color="text.secondary">Всего обработано заказов</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Текущие позиции меню
              </Typography>
              <Typography variant="h4">{menuItems.length}</Typography>
              <Typography color="text.secondary">Блюд и напитков в базе</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Клиенты
              </Typography>
              <Typography variant="h4">{customers.length}</Typography>
              <Typography color="text.secondary">Зарегистрировано клиентов</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Выручка
              </Typography>
              <Typography variant="h4">{totalRevenue.toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}</Typography>
              <Typography color="text.secondary">Общая сумма заказов</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Сегодня заказов
              </Typography>
              <Typography variant="h4">{todayOrders}</Typography>
              <Typography color="text.secondary">Заказов за сегодня</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Последние заказы
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Клиент</TableCell>
                      <TableCell>Сумма</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Дата</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.slice(0, 6).map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.customer?.fullName || 'Гость'}</TableCell>
                        <TableCell>{Number(row.totalPrice).toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}</TableCell>
                        <TableCell>
                          <Chip label={row.status} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Топ блюд
              </Typography>
              <Stack spacing={1}>
                {topItems.length > 0 ? (
                  topItems.map(([name, count]) => (
                    <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography>{name}</Typography>
                      <Typography color="text.secondary">{count} шт.</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">Нет данных для отображения.</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
