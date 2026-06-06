const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Customer } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const customers = await Customer.find().sort('fullName');
  res.json(customers);
});

router.post(
  '/',
  auth,
  [body('fullName').notEmpty(), body('phone').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const customer = new Customer(req.body);
    await customer.save();
    res.json(customer);
  }
);

router.put('/:id', auth, async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
});

router.delete('/:id', auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json({ message: 'Customer deleted' });
});

module.exports = router;
