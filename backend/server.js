const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Загрузка переменных окружения
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Подключение к БД
const connectDB = require('./config/db');
connectDB();

// Инициализация Express
const app = express();

// Middleware для CORS с правильной конфигурацией
// Поддерживаем несколько разрешённых источников через переменную CORS_ORIGIN
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawCors.split(',').map((s) => s.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // origin === undefined for same-origin requests from tools like curl or server-to-server
    if (!origin) return callback(null, true);
    // Если текущий origin находится в списке разрешённых — отражаем его (одиночное значение)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // В противном случае блокируем
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware для парсинга JSON и form-data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Основной маршрут (health check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/expenses', require('./routes/expenses'));

// Обработка 404 ошибок
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 CAFE MANAGEMENT SYSTEM BACKEND         ║
╠════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(33)}║
║  Server: http://localhost:${PORT}                  ║
║  Status: ✅ Ready                         ║
╚════════════════════════════════════════════╝
  `);
});

// Обработка uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// Обработка unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📪 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});
