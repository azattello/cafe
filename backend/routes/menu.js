const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { MenuItem } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const items = await MenuItem.find().sort('category');
  res.json(items);
});

router.post(
  '/',
  auth,
  [body('name').notEmpty(), body('price').isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description, category, price, image, isAvailable } = req.body;
    const menuItem = new MenuItem({ name, description, category, price, image, isAvailable });
    await menuItem.save();
    res.json(menuItem);
  }
);

router.put('/:id', auth, async (req, res) => {
  const updates = req.body;
  const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json(item);
});

router.delete('/:id', auth, async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json({ message: 'Menu item deleted' });
});

module.exports = router;
