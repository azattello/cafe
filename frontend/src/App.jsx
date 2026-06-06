import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import EmployeesPage from './pages/EmployeesPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import AppShell from './components/AppShell';

function App() {
  const layout = (page) => (
    <ProtectedRoute>
      <AppShell>{page}</AppShell>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={layout(<DashboardPage />)} />
      <Route path="/menu" element={layout(<MenuPage />)} />
      <Route path="/orders" element={layout(<OrdersPage />)} />
      <Route path="/customers" element={layout(<CustomersPage />)} />
      <Route path="/employees" element={layout(<EmployeesPage />)} />
      <Route path="/inventory" element={layout(<InventoryPage />)} />
      <Route path="/reports" element={layout(<ReportsPage />)} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
