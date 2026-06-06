import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/axiosClient';

const categories = ['Напитки', 'Завтраки', 'Обеды', 'Десерты', 'Салаты', 'Закуски'];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: '', description: '', price: '', image: '', isAvailable: true });
  const [editingId, setEditingId] = useState(null);

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/menu');
      setItems(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleChange = (field) => (event) => {
    const value = field === 'isAvailable' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setForm({ name: '', category: '', description: '', price: '', image: '', isAvailable: true });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      image: form.image,
      isAvailable: form.isAvailable,
    };

    if (editingId) {
      await api.put(`/menu/${editingId}`, payload);
    } else {
      await api.post('/menu', payload);
    }

    await loadMenu();
    clearForm();
  };

  const handleDelete = async (id) => {
    await api.delete(`/menu/${id}`);
    await loadMenu();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category || '',
      description: item.description || '',
      price: item.price || '',
      image: item.image || '',
      isAvailable: item.isAvailable,
    });
  };

  const availableCount = useMemo(() => items.filter((item) => item.isAvailable).length, [items]);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Меню
          </Typography>
          <Typography color="text.secondary">
            Добавляйте блюда, корректируйте цену и управляйте доступностью меню.
          </Typography>
        </Box>
        <Paper sx={{ px: 3, py: 2, bgcolor: '#f7f9ff' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Доступно сейчас
          </Typography>
          <Typography variant="h5">{availableCount} позиций</Typography>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {editingId ? 'Редактировать блюдо' : 'Новое блюдо'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Название"
                value={form.name}
                onChange={handleChange('name')}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label="Категория"
                value={form.category}
                onChange={handleChange('category')}
                margin="normal"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Цена"
                value={form.price}
                onChange={handleChange('price')}
                type="number"
                margin="normal"
                inputProps={{ min: 0 }}
                required
              />
              <TextField
                fullWidth
                label="Описание"
                value={form.description}
                onChange={handleChange('description')}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Ссылка на изображение"
                value={form.image}
                onChange={handleChange('image')}
                margin="normal"
              />
              <FormControlLabel
                control={<Checkbox checked={form.isAvailable} onChange={handleChange('isAvailable')} />}
                label="Позиция доступна"
                sx={{ mt: 1 }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button type="submit" variant="contained">
                  {editingId ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button variant="outlined" onClick={clearForm}>
                  Очистить
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Stack spacing={2}>
            {isLoading ? (
              <Typography>Загрузка меню...</Typography>
            ) : items.length === 0 ? (
              <Typography>Меню пусто. Добавьте первую позицию.</Typography>
            ) : (
              items.map((item) => (
                <Paper key={item._id} sx={{ p: 3, position: 'relative' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {item.category || 'Без категории'}
                      </Typography>
                      <Typography>{item.description || 'Описание отсутствует'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 140, textAlign: 'right' }}>
                      <Typography variant="h6">{Number(item.price).toLocaleString('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })}</Typography>
                      <Typography color={item.isAvailable ? 'success.main' : 'error.main'}>
                        {item.isAvailable ? 'В наличии' : 'Нет в наличии'}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                    <Tooltip title="Редактировать">
                      <IconButton color="primary" onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton color="error" onClick={() => handleDelete(item._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              ))
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
