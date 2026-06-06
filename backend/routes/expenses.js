const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Expense } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

router.post(
  '/',
  auth,
  [body('title').notEmpty(), body('amount').isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const expense = new Expense(req.body);
    await expense.save();
    res.json(expense);
  }
);

router.put('/:id', auth, async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json(expense);
});

router.delete('/:id', auth, async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Expense deleted' });
});

module.exports = router;
