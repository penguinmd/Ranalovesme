const express = require('express');
const router = express.Router();
const Day = require('../models/Day');
const { authenticateToken } = require('../middleware/auth');
const { createDayValidator, updateDayValidator, dayIdValidator } = require('../validators/days');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get stats (must be before /:id route)
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const stats = await Day.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Get all days
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const days = await Day.getAll();
    res.json(days);
  } catch (error) {
    next(error);
  }
});

// Get single day
router.get('/:id', authenticateToken, dayIdValidator, validate, async (req, res, next) => {
  try {
    const day = await Day.findById(req.params.id);
    if (!day) {
      throw new AppError('Day not found', 404);
    }
    res.json(day);
  } catch (error) {
    next(error);
  }
});

// Create new day
router.post('/', authenticateToken, createDayValidator, validate, async (req, res, next) => {
  try {
    const { date, title, description, mood, rating } = req.body;
    const id = await Day.create({
      date,
      title,
      description,
      mood,
      rating,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Day created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update day
router.put('/:id', authenticateToken, updateDayValidator, validate, async (req, res, next) => {
  try {
    const { title, description, mood, rating } = req.body;

    const day = await Day.findById(req.params.id);
    if (!day) {
      throw new AppError('Day not found', 404);
    }

    await Day.update(req.params.id, { title, description, mood, rating });
    res.json({ message: 'Day updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete day
router.delete('/:id', authenticateToken, dayIdValidator, validate, async (req, res, next) => {
  try {
    const day = await Day.findById(req.params.id);
    if (!day) {
      throw new AppError('Day not found', 404);
    }

    await Day.delete(req.params.id);
    res.json({ message: 'Day deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Add photo to day
router.post('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Day.addPhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo added to day successfully' });
  } catch (error) {
    next(error);
  }
});

// Remove photo from day
router.delete('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Day.removePhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo removed from day successfully' });
  } catch (error) {
    next(error);
  }
});

// Get photos for a day
router.get('/:id/photos', authenticateToken, async (req, res, next) => {
  try {
    const photos = await Day.getPhotos(req.params.id);
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
