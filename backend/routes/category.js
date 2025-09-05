import express from 'express';
import SidebarCategory from '../models/SidebarCategory.js';
import { authMiddleware } from './middleware.js';

const router = express.Router();

// Get all categories for user
router.get('/', authMiddleware, async (req, res) => {
  const categories = await SidebarCategory.find({ user: req.userId });
  res.json(categories);
});

// Add new category
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const category = await SidebarCategory.create({ user: req.userId, name });
  res.status(201).json(category);
});


// Update category name
router.put('/:id', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const updated = await SidebarCategory.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json(updated);
});

// Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
  await SidebarCategory.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
