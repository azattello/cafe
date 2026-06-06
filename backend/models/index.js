const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'waiter', 'cashier'],
    default: 'waiter',
  },
}, { timestamps: true });

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true, default: 0 },
  image: String,
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, default: 1 },
  }],
  totalPrice: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Новый', 'Готовится', 'Готов', 'Выдан', 'Отменен'],
    default: 'Новый',
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  bonusPoints: { type: Number, default: 0 },
}, { timestamps: true });

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  position: String,
  phone: String,
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'waiter', 'cashier'],
    default: 'cashier',
  },
  schedule: String,
}, { timestamps: true });

const inventorySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'шт' },
  minimumQuantity: { type: Number, default: 0 },
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Order = mongoose.model('Order', orderSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = { User, MenuItem, Order, Customer, Employee, Inventory, Expense };
