const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Employee } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const employees = await Employee.find().sort('fullName');
  res.json(employees);
});

router.post(
  '/',
  auth,
  [
    body('fullName').notEmpty(),
    body('login').notEmpty(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, ...data } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const employee = new Employee({ ...data, password: hashed });
    await employee.save();
    res.json(employee);
  }
);

router.put('/:id', auth, async (req, res) => {
  const updates = { ...req.body };
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(updates.password, salt);
  }

  const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json(employee);
});

router.delete('/:id', auth, async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json({ message: 'Employee deleted' });
});

module.exports = router;
