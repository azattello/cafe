# Cafe Management System (MERN)

Автоматизированная информационная система для кафе на основе MERN-стека.

## Структура проекта

- `backend/` — Node.js + Express API, MongoDB, JWT.
- `frontend/` — React + Vite, React Router, Material UI.

## Запуск сервера

1. Перейдите в `backend`
2. Скопируйте `.env.example` в `.env`
3. Установите зависимости:
   ```powershell
   npm install
   ```
4. Запустите сервер:
   ```powershell
   npm run dev
   ```

## Запуск фронтенда

1. Перейдите в `frontend`
2. Установите зависимости:
   ```powershell
   npm install
   ```
3. Запустите приложение:
   ```powershell
   npm run dev
   ```

## Основные требования

Система поддерживает:
- регистрацию и вход пользователей;
- управление меню, заказами, клиентами, сотрудниками, складом и расходами;
- JWT-аутентификацию;
- REST API для бизнес-процессов кафе.
