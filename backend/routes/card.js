import express from 'express';
import Card from '../models/Card.js';
import { authMiddleware } from './middleware.js';

const router = express.Router();

// Get cards for a category
router.get('/:categoryId', authMiddleware, async (req, res) => {
  try {
    const cards = await Card.find({ category: req.params.categoryId }).sort('order');
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ message: 'Error fetching cards' });
  }
});

// Add card to category
router.post('/:categoryId', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const card = await Card.create({ 
      category: req.params.categoryId, 
      title,
      resources: [],
      order: 0
    });
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ message: 'Error creating card' });
  }
});

// SIMPLIFIED UPDATE APPROACH - Find, Modify, Save
router.put('/:cardId', authMiddleware, async (req, res) => {
  try {
    const { title, resources, order } = req.body;
    
    console.log('=== UPDATE CARD START ===');
    console.log('Card ID:', req.params.cardId);
    console.log('Received data:', JSON.stringify({ title, resources, order }, null, 2));
    
    // Find the card first
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    console.log('Found card:', card.title);
    console.log('Current resources:', JSON.stringify(card.resources, null, 2));
    
    // Update fields directly
    if (title !== undefined) {
      card.title = title;
    }
    
    if (resources !== undefined) {
      // Clear existing resources and add new ones
      card.resources = [];
      
      // Add each resource individually to ensure proper structure
      resources.forEach((resource, index) => {
        console.log(`Adding resource ${index}:`, JSON.stringify(resource, null, 2));
        
        card.resources.push({
          type: resource.type,
          title: resource.title || '', // Ensure title is always set
          content: resource.content
        });
      });
    }
    
    if (order !== undefined) {
      card.order = order;
    }
    
    console.log('Before save - card resources:', JSON.stringify(card.resources, null, 2));
    
    // Save the card
    const savedCard = await card.save();
    
    console.log('After save - card resources:', JSON.stringify(savedCard.resources, null, 2));
    console.log('=== UPDATE CARD END ===');
    
    res.json(savedCard);
    
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ 
      message: 'Error updating card', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete card
router.delete('/:cardId', authMiddleware, async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ message: 'Error deleting card' });
  }
});

export default router;