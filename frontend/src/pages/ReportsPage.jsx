import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import api from '../api/axiosClient';

export default function ReportsPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter((order) => new Date(order.createdAt).toDateString() === today).length;
  }, [orders]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [orders]
  );

  const averageOrder = useMemo(() => {
    if (orders.length === 0) return 0;
    return totalRevenue / orders.length;
  }, [orders, totalRevenue]);

  const popularStatuses = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [orders]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Отчеты
        </Typography>
        <Typography color="text.secondary">Аналитика по продажам, заказам и статусам за любую дату.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Заказов сегодня
              </Typography>
              <Typography variant="h4">{todayOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Общая выручка
              </Typography>
              <Typography variant="h4">{totalRevenue.toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Средний чек
              </Typography>
              <Typography variant="h4">{Math.round(averageOrder).toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Статусы заказов
            </Typography>
            <Stack spacing={1}>
              {popularStatuses.length === 0 ? (
                <Typography color="text.secondary">Нет данных для отчетов.</Typography>
              ) : (
                popularStatuses.map((item) => (
                  <Box key={item.status} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{item.status}</Typography>
                    <Chip label={`${item.count} шт.`} size="small" />
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Последние заказы
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Клиент</TableCell>
                    <TableCell>Сумма</TableCell>
                    <TableCell>Дата</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.customer?.fullName || 'Гость'}</TableCell>
                      <TableCell>{Number(order.totalPrice).toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Нет данных для отображения.
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
