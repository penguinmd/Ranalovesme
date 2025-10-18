const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { authenticateToken } = require('../middleware/auth');
const { createActivityValidator, updateActivityValidator, activityIdValidator } = require('../validators/activities');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get all activities
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { category } = req.query;
    const activities = await Activity.getAll(category);
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

// Get single activity
router.get('/:id', authenticateToken, activityIdValidator, validate, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }
    res.json(activity);
  } catch (error) {
    next(error);
  }
});

// Create new activity
router.post('/', authenticateToken, createActivityValidator, validate, async (req, res, next) => {
  try {
    const { title, description, category, date } = req.body;
    const id = await Activity.create({
      title,
      description,
      category,
      date,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Activity created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update activity
router.put('/:id', authenticateToken, updateActivityValidator, validate, async (req, res, next) => {
  try {
    const { title, description, category, date } = req.body;

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    await Activity.update(req.params.id, { title, description, category, date });
    res.json({ message: 'Activity updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete activity
router.delete('/:id', authenticateToken, activityIdValidator, validate, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    await Activity.delete(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
