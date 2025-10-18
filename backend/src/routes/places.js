const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const { authenticateToken } = require('../middleware/auth');
const { createPlaceValidator, updatePlaceValidator, placeIdValidator } = require('../validators/places');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get all places
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const places = await Place.getAll();
    res.json(places);
  } catch (error) {
    next(error);
  }
});

// Get single place
router.get('/:id', authenticateToken, placeIdValidator, validate, async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      throw new AppError('Place not found', 404);
    }
    res.json(place);
  } catch (error) {
    next(error);
  }
});

// Create new place
router.post('/', authenticateToken, createPlaceValidator, validate, async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, category, visit_date, notes } = req.body;
    const id = await Place.create({
      name,
      address,
      latitude,
      longitude,
      category,
      visit_date,
      notes,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Place created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update place
router.put('/:id', authenticateToken, updatePlaceValidator, validate, async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, category, visit_date, notes } = req.body;

    const place = await Place.findById(req.params.id);
    if (!place) {
      throw new AppError('Place not found', 404);
    }

    await Place.update(req.params.id, { name, address, latitude, longitude, category, visit_date, notes });
    res.json({ message: 'Place updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete place
router.delete('/:id', authenticateToken, placeIdValidator, validate, async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      throw new AppError('Place not found', 404);
    }

    await Place.delete(req.params.id);
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Add photo to place
router.post('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Place.addPhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo added to place successfully' });
  } catch (error) {
    next(error);
  }
});

// Remove photo from place
router.delete('/:id/photos/:photoId', authenticateToken, async (req, res, next) => {
  try {
    await Place.removePhoto(req.params.id, req.params.photoId);
    res.json({ message: 'Photo removed from place successfully' });
  } catch (error) {
    next(error);
  }
});

// Get photos for a place
router.get('/:id/photos', authenticateToken, async (req, res, next) => {
  try {
    const photos = await Place.getPhotos(req.params.id);
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
