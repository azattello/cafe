const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Order } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const orders = await Order.find().populate('customer').populate('items.menuItem').sort({ createdAt: -1 });
  res.json(orders);
});

router.post(
  '/',
  auth,
  [body('items').isArray({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = new Order(req.body);
    await order.save();
    res.json(order);
  }
);

router.put('/:id', auth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

router.delete('/:id', auth, async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ message: 'Order deleted' });
});

module.exports = router;
