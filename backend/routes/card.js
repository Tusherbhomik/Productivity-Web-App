import express from 'express';
import Card from '../models/Card.js';
import { authMiddleware } from './middleware.js';

const router = express.Router();

// Get cards for a category
router.get('/:categoryId', authMiddleware, async (req, res) => {
  const cards = await Card.find({ category: req.params.categoryId }).sort('order');
  res.json(cards);
});

// Add card to category
router.post('/:categoryId', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const card = await Card.create({ category: req.params.categoryId, title });
  res.status(201).json(card);
});

// Update card (add resources, reorder, etc.)
router.put('/:cardId', authMiddleware, async (req, res) => {
  const { title, resources, order } = req.body;
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { title, resources, order },
    { new: true }
  );
  res.json(card);
});

// Delete card
router.delete('/:cardId', authMiddleware, async (req, res) => {
  await Card.findByIdAndDelete(req.params.cardId);
  res.json({ success: true });
});

export default router;
