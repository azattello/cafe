# 🏪 Cafe Management System - Переменные Окружения

## Backend конфигурация

### Требуемые переменные (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/?appName=YourApp
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=24h
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Описание переменных

| Переменная | Описание | Пример |
|-----------|---------|---------|
| `PORT` | Порт сервера | 5000 |
| `NODE_ENV` | Окружение | development, production |
| `MONGODB_URI` | Строка подключения к MongoDB Atlas | mongodb+srv://... |
| `JWT_SECRET` | Секретный ключ для JWT | секретный_ключ |
| `JWT_EXPIRY` | Время действия токена | 24h |
| `CORS_ORIGIN` | Разрешенные CORS источники | http://localhost:5173 |

### Как получить MongoDB Atlas URL

1. Перейти на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создать или выбрать кластер
3. В разделе "Databases" нажать "Connect"
4. Выбрать "Drivers" → "NodeJS"
5. Скопировать connection string
6. Вставить в `MONGODB_URI` в .env

---

## Frontend конфигурация

### Требуемые переменные (.env)

```env
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Cafe Management System
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

### Описание переменных

| Переменная | Описание | Пример |
|-----------|---------|---------|
| `VITE_APP_ENV` | Окружение приложения | development, production |
| `VITE_API_BASE_URL` | URL API сервера | http://localhost:5000/api |
| `VITE_APP_NAME` | Название приложения | Cafe Management System |
| `VITE_APP_VERSION` | Версия приложения | 1.0.0 |
| `VITE_DEBUG` | Включить отладку | true, false |

---

## 🚀 Запуск приложения

### Требования
- Node.js 16+
- npm или yarn
- MongoDB Atlas аккаунт

### Установка и запуск

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Проверка подключения

**Backend health check:**
```bash
curl http://localhost:5000/api/health
```

Должен вернуть:
```json
{
  "status": "OK",
  "timestamp": "2026-06-06T...",
  "uptime": 123.456,
  "environment": "development"
}
```

---

## 🔒 Безопасность

### В Production обязательно:

1. **Поменять JWT_SECRET** на сложный ключ
   ```bash
   # Генерируем сложный ключ
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Использовать .env.production**
   ```bash
   NODE_ENV=production
   MONGODB_URI=production_uri
   JWT_SECRET=production_secret
   ```

3. **Настроить CORS_ORIGIN** на реальные домены
   ```
   CORS_ORIGIN=https://cafe.example.com,https://www.cafe.example.com
   ```

4. **Включить HTTPS** на сервере

---

## 🐛 Отладка

Если возникают проблемы, проверьте:

### MongoDB не подключается
- ❌ Неправильный MONGODB_URI
- ❌ IP адрес не добавлен в MongoDB Atlas Network Access
- ❌ Пользователь/пароль неправильный
- ✅ Скопируйте правильный URL из Atlas

### Frontend не может подключиться к API
- ❌ Backend не запущен
- ❌ Неправильный VITE_API_BASE_URL
- ❌ CORS не разрешен на backend
- ✅ Проверьте, что backend слушает на указанном порту

### JWT токен не работает
- ❌ JWT_SECRET на backend и в фронтенде разные (они должны быть одинаковые)
- ❌ Токен истёк
- ✅ Проверьте JWT_EXPIRY значение

---

## 📝 Переменные для Optional сервисов

### Cloudinary (загрузка изображений)
```env
CLOUDINARY_CLOUD_NAME=xxxxxx
CLOUDINARY_API_KEY=xxxxxx
CLOUDINARY_API_SECRET=xxxxxx
```

[Получить на cloudinary.com](https://cloudinary.com/console)

### Email (уведомления)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
```

---

## 📞 Контакты и поддержка

Если возникли проблемы с конфигурацией:
1. Проверьте, что все переменные установлены
2. Проверьте логи в консоли
3. Убедитесь, что порты не заняты
4. Перезагрузите оба сервера
