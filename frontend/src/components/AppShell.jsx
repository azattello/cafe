import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 280;

const navItems = [
  { label: 'Панель', path: '/', icon: <DashboardIcon /> },
  { label: 'Меню', path: '/menu', icon: <RestaurantMenuIcon /> },
  { label: 'Заказы', path: '/orders', icon: <ReceiptLongIcon /> },
  { label: 'Клиенты', path: '/customers', icon: <PeopleIcon /> },
  { label: 'Сотрудники', path: '/employees', icon: <BadgeIcon /> },
  { label: 'Склад', path: '/inventory', icon: <Inventory2Icon /> },
  { label: 'Отчеты', path: '/reports', icon: <BarChartIcon /> },
];

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ px: 2, py: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#3f51b5', width: 46, height: 46 }}>Д</Avatar>
        <Box>
          <Typography variant="h6">Дәмхана</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.fullName || 'Гость'}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemIcon sx={{ color: '#5c6ac4' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ mb: 2 }} />
      <Button variant="contained" color="secondary" onClick={handleLogout} fullWidth>
        Выйти
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 0,
              bgcolor: '#f8fbff',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {isMobile && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
}
