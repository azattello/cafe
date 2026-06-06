const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Inventory } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const items = await Inventory.find().sort('productName');
  res.json(items);
});

router.post(
  '/',
  auth,
  [body('productName').notEmpty(), body('quantity').isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const item = new Inventory(req.body);
    await item.save();
    res.json(item);
  }
);

router.put('/:id', auth, async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Inventory item not found' });
  res.json(item);
});

router.delete('/:id', auth, async (req, res) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Inventory item not found' });
  res.json({ message: 'Inventory item deleted' });
});

module.exports = router;
